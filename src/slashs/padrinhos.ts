import { ButtonInteraction, CommandInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Padrinhos from "../database/models/padrinhos";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";

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

            const padrinhos = await Padrinhos.find({});

            let index: number = 0;

            const msg = await interaction.reply({ embeds: [ await updateEmbed(index, padrinhos.length - 1, padrinhos)], components: [row] })

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
                    array.push(`${n + 1}. <@!${data[n].id}>\n${emojis.money} Total: ${data[n].total}\n`)
                }

                return (array as unknown as string[])
            }

        }
        case 'ver': {}
        case 'adicionar': {}
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