import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Padrinhos from "../database/models/padrinhos";
import { SuperChanTypes } from "../types/Client";
import PadrinhosPromps from "../types/Padrinhos";
import emojis from "../json/emojis.json";
import moment from "moment";
moment.locale('pt-br')

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
    if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has('ADMINISTRATOR'))
        return interaction.reply({ content: `${emojis.error} Ops <@!${interaction.user.id}>, você não tem poder o suficiente para usar este comando.`, ephemeral: true});

    const command: string = interaction.options.getSubcommand(true);

    switch (command) {
        case 'todos': {

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('donators-prev')
                    .setLabel('Anterior')
                    .setStyle('PRIMARY'),

                    new MessageButton()
                    .setCustomId('donators-next')
                    .setLabel('Próximo')
                    .setStyle('PRIMARY')
                )

            const padrinhos = await Padrinhos.find().sort({ total: -1 });

            let index: number = 0;

            const msg = await interaction.reply({ embeds: [ await updateEmbed(index, padrinhos.length, padrinhos)], components: [row] })

            const collector = await interaction?.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

            collector?.on('collect', async (i: ButtonInteraction) => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: `${emojis.error} Hey, esses botões não foram feitos para voce!`, ephemeral: true})
                } else {
                    switch (i.customId) {
                        case "donators-prev": {
                            if (index <= 0) return;
                            index = index - 1;

                            i.editReply({ embeds: [ await updateEmbed(index, padrinhos.length, padrinhos) ] })
                        }
                        case "donators-next": {
                            if (index >= Math.floor(padrinhos.length / 10)) return;
                            index = index + 1
                            
                            i.editReply({ embeds: [ await updateEmbed(index, padrinhos.length, padrinhos) ] })
                        }
                    }
                }
            })

            async function updateEmbed(i: number, max: number, data: object[]) {

                const text = await padrinhosList(i, max, data)

                return new MessageEmbed()
                .setTitle(`${emojis.money} Padrinhos`)
                .setDescription(`${text.join('\n')}`)
                .setFooter('SuperScans, vivendo um novo mundo!')
            }

            async function padrinhosList(i: number, max: number, data: any) {
                const array: string[] = [];

                for (let index = 0; index < max; index++) {
                    const n = index + i * index
                    array.push(`${n + 1}. <@!${data[n].id}>\n${emojis.money} Total: \*\*R$${data[n].total}\*\*\n`)
                }

                return (array as unknown as string[])
            }

            return;

        }
        case 'ver': {
            
            const user = interaction.options.getUser('membro', true)
            const member: PadrinhosPromps = await Padrinhos.findOne({ id: user.id })

            if (!member) return interaction.reply({ content: `${emojis.error} Hey <@!${interaction.user.id}>, este usuário não está cadastrado na database!`})

            const donatesHistory = member.donateHistory.map(data => `- Data ${moment(data.date, 'YYYY-MM-DD-HH-mm-ss').format('LL')}\n+ Valor: R$${data.value}`)

            const embed = new MessageEmbed()
                .setTitle(`${emojis.money} Padrinhos`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(`${emojis.user_card} Membro: <@!${user.id}> \`[${user.username} - ${user.id}]\`\n${emojis.timer} Doador desde: \*\*${moment(member.donatorSince, 'YYYY-MM-DD-HH-mm-ss').format('LLL')}\*\*\n${emojis.wallet} Total doado: \*\*R$${member.total}\*\*\n${emojis.money} Ultima doação: \*\*R$${member.value}\*\*\n${member.isDonator ? emojis.success + " Status: \*\*Doador\*\*" : emojis.error + " Status: \*\*Não doador\*\*"}\n${emojis.file} Histórico de doação: \`\`\`diff\n${donatesHistory.join('\n\n')}\n\`\`\` `)
                .setFooter('SuperScans, vivendo um novo mundo!')

            return interaction.reply({ embeds: [embed] })

        }
        case 'adicionar': {

            const user = interaction.options.getUser('membro', true)
            const value = interaction.options.getNumber('valor', true)

            const member = await Padrinhos.findOne({ id: user.id })

            if (member) return interaction.reply({ content: `${emojis.error} Hey <@!${interaction.user.id}>, este usuário já está cadastrado na database!`})

            await new Padrinhos({ id: user.id, value: value, total: value, donatorSince: moment().format('YYYY-MM-DD-HH-mm-ss'), donateHistory: { value: value, date: moment().format('YYYY-MM-DD-HH-mm-ss') } }).save()

            return interaction.reply({ content: `${emojis.success} Pronto! Padrinho registrado com sucesso!` })
        }
        case 'remover': {}
    }
}

exports.data = new SlashCommandBuilder()
.setName('padrinhos')
.setDescription('Veja todos os padrinhos cadastrados na database')
.addSubcommand(command => 
    command
        .setName('ver')
        .setDescription('Verifique informações sobre o padrinho mencionado')
        .addUserOption(user => 
            user
                .setName('membro')
                .setDescription('Mencione o padrinho')
                .setRequired(true)
        )
)
.addSubcommand(command => 
    command
        .setName('todos')
        .setDescription('Verifique todos os padrinhos cadastrados')
)
.addSubcommand(command => 
    command
        .setName('adicionar')
        .setDescription('Adicione um membro na database')
        .addUserOption(user => 
            user
                .setName('membro')
                .setDescription('Mencione o membro')
                .setRequired(true)
        )
        .addNumberOption(value => 
            value
                .setName('valor')
                .setDescription('Valor da primeira doação.')
                .setRequired(true)
        )
)
.addSubcommand(command => 
    command
        .setName('remover')
        .setDescription('Remove um padrinho da database')
        .addUserOption(user => 
            user
                .setName('membro')
                .setDescription('Mencione o padrinho')
                .setRequired(true)
        )
)