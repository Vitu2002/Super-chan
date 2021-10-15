import { ButtonInteraction, CollectorFilter, CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, ThreadChannel } from "discord.js";
import Members from "../database/models/halloween_members";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChanTypes } from "../types/Client";
import Produtos from "../types/Produtos";
import emojis from "../json/emojis.json";
import MembersHalloween from "../types/MembersHalloween";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('shop-prev')
            .setLabel('Anterior')
            .setStyle('PRIMARY'),

            new MessageButton()
            .setCustomId('shop-buy')
            .setLabel('Comprar')
            .setStyle('SUCCESS'),

            new MessageButton()
            .setCustomId('shop-next')
            .setLabel('Próximo')
            .setStyle('PRIMARY')
        )

    const produtos: Produtos[] = [
        {
            id: 0,
            name: "Cargo <@&892753337244590090>",
            description: "A cada vez comprado, você tem o direito de ficar +1 dia com o cargo <@&892753337244590090>\n\n \*\*Nota:\*\* \`O cargo pode ser coletado a partir do dia 22/10\`",
            value: 24
        },
        {
            id: 1,
            name: "Ticket",
            description: "Você pode comprar um ticket e participar de um sorteio exclusivo do evento de halloween.",
            value: 100
        },
        {
            id: 2,
            name: "Mute",
            description: "Compre um mute e veja a mágica acontecer",
            value: 1000
        }
    ]

    let index: number = 0

    const msg = await interaction.reply({ embeds: [ await updateEmbed(index)], components: [row] })

    const collector = await interaction?.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

    collector?.on('collect', async (i: ButtonInteraction) => {
        if (i.user.id !== interaction.user.id) {
            return i.reply({ content: `${emojis.error} Hey, esses botões não foram feitos para voce!`, ephemeral: true})
        } else {
            switch (i.customId) {
                case "shop-prev": {
                    if (index <= 0) {
                        index = produtos.length
                    } else {
                        index = index - 1
                    }

                    (i.message as Message).edit({ embeds: [ await updateEmbed(index) ] })

                    return;
                }
                case "shop-next": {
                    if (index >= produtos.length) {
                        index = 0
                    } else {
                        index = index + 1
                    }
                    
                    (i.message as Message).edit({ embeds: [ await updateEmbed(index) ] })

                    return;
                }
                case "shop-buy": {
                    let member: MembersHalloween = await Members.findOne({ id: interaction.user.id })

                    if (!member) {
                        const data = new Members({ id: interaction.user.id }).save()
                
                        member = await Members.findOne({ id: interaction.user.id })
                    }

                    const candys = Number(member.candy)
                    const value = Number(produtos[index].value)

                    if (value > candys)
                        return i.reply({ content: `${emojis.error} Ops <@!${i.user.id}>! Você é pobre demais para comprar este produto, tente usar \`/trickortreat\` para conseguir alguns doces!` })

                    i.reply({ content: `${emojis.black} Digite a quantia (números) de unidades que você deseja comprar de \*\*${produtos[index].name}\*\*\n\n${emojis.doces} Custo: ${produtos[index].value} Doces.\n${emojis.balde_de_doces} Seus doces: ${member.candy}` })

                    const filter = (message: any) => message.author.id === i.user.id;

                    const collectorAmount = i.channel?.awaitMessages({ filter ,max: 1, time: 60000 }).then(async resp => {
                        if (!Number(resp.first()?.content)) return i.channel?.send({ content: `${emojis.error} <@!${interaction.user.id}> Insira um \*\*número\*\*, analfa...` })

                        const amount: number = Number(resp.first()?.content)
                        const price: number = Number(produtos[index].value)
                        const total: number = Number(Math.floor(price * amount))
                        const candys: number = Number(member.candy)
                        const days: number = Number(member.buyRoleDays)
                        const tickets: number = Number(member.tickets)

                        console.log(total.toFixed() + " ----- " + candys.toFixed())

                        if (total.toFixed() < candys.toFixed()) {
                            return i.channel?.send({ content: `${emojis.error} Ops <@!${i.user.id}>! Você é pobre demais para comprar este produto, tente usar \`/trickortreat\` para conseguir alguns doces!` })
                        }

                    switch (produtos[index].id) {
                        case 0: return await Members.findOne({ id: i.user.id }).updateOne({ candy: Number(candys - total), buyRoleDays: days + 1 * amount }) && i.channel?.send({ content: `${emojis.success} Pronto <@!${i.user.id}>, você comprou \*\*${amount}x\*\* de \*\*${produtos[index].name}\*\*` });
                        case 1: return await Members.findOne({ id: i.user.id }).updateOne({ candy: Number(candys - total), tickets: tickets + 1 * amount }) && i.channel?.send({ content: `${emojis.success} Pronto <@!${i.user.id}>, você comprou \*\*${amount}x\*\* de \*\*${produtos[index].name}\*\*` });
                        case 2: return await (interaction.guild?.channels.cache.get('878056378520989736') as ThreadChannel)?.send({ content: `${emojis.info} <@!293913134748401674> o membro <@!${i.user.id}> comprou ${amount} mute(s) de 1h` }) && i.channel?.send({ content: `${emojis.success} Pronto <@!${i.user.id}>, você comprou \*\*${amount}x\*\* de \*\*${produtos[index].name}\*\*` });
                    }

                    return i.channel?.send({ content: `${emojis.success} Pronto <@!${i.user.id}>, você comprou \*\*${amount}x\*\* de \*\*${produtos[index].name}\*\*` })

                    }).catch(err => {
                        console.log(err)
                        i.channel?.send({ content: `${emojis.error} Qual foi <@!${interaction.user.id}>? Vai me deixar aqui esperando?` })
                    })

                    return;
                }
            }
        }
    })

    async function updateEmbed(i: number) {
        return new MessageEmbed()
        .setTitle(`${emojis.cart} Lojinha Fantasmagórica`)
        .setDescription(`${emojis.search} Produto: \*\*${produtos[i].name}\*\*\n${emojis.file} Descrição: ${produtos[i].description}\n${emojis.money} Valor: \*\*${produtos[i].value} Doces ${emojis.doces}\*\*`)
        .setFooter(`Página ${i + 1} de ${produtos.length} |SuperScans, vivendo um novo mundo!`, `${interaction.guild?.iconURL({ dynamic: true })}`)
    }
}

exports.data = new SlashCommandBuilder()
.setName('loja')
.setDescription('Compre algo gastando os seus sonhos ganhos no trickortreat')