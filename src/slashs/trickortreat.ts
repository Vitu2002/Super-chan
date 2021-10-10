import Members from "../database/models/halloween_members";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChanTypes } from "../types/Client";
import { CommandInteraction, MessageEmbed } from "discord.js";
import emojis from "../json/emojis.json";
import moment from 'moment';
moment.locale('pt-br');

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
    
    let member = await Members.findOne({ id: interaction.user.id })

    if (!member) {
        const data = new Members({ id: interaction.user.id }).save()

        member = await Members.findOne({ id: interaction.user.id })
    }

    const lastDate = moment(member.lastDate, 'YYYY-MM-DD-HH-mm-ss')
    const newDate = moment().format('YYYY-MM-DD-HH-mm-ss')
    const date = lastDate.fromNow()

    if (['segundos', 'minuto', 'minutos'].includes(date.split(' ')[2])) {
        return interaction.reply({ content: `> ${emojis.error} Ops <@!${interaction.user.id}>! Você já pediu doces \*\*${date}\*\*, você deve desperar no mínimo 1 hora para pedir novamente.` })
    }

    const embed = new MessageEmbed()
    .setAuthor('Evento de Halloween')
    .setTitle(`${emojis.balde_de_doces} Doces ou Travessuras? ~Ahahah~`)
    .setColor('#ff3662')
    .setFooter(`SuperScans, vivendo um novo mundo!`, `${interaction.guild?.iconURL({ dynamic: true })}`)

    const i = Math.floor(Math.random() * 100)

    const good_doors: string[] = ['\_\_uma família festiva\_\_', '\_\_uma família rica\_\_', '\_\_uma velhinha bondosa\_\_', '\_\_uma cara normal\_\_', '\_\_um bom senhor\_\_'];
    const devil_doors: string[] = ['\_\_uma velha bruxa\_\_', '\_\_alguns valentões\_\_', '\_\_uma família de ladrões\_\_'];

    if (i > 40) {
        // Ganhou

    const candy: number = i / 10 * 1.25
    const candyTotal: number = member.candy + candy

    embed
    .setThumbnail('')
    .setDescription(`${emojis.green} Yeah! Você bateu na porta de ${good_doors[Math.floor(Math.random() * good_doors.length)]} e ganhou **__${candy.toFixed()} Doces ${emojis.doces}__**.\n\n ${emojis.balde_de_doces} Seus doces: \*\*\_\_${candyTotal.toFixed()}\_\_\*\*`);

    await member.update({ used: member.used + 1, candy: candyTotal.toFixed(), lastDate: newDate })

    interaction.reply({ embeds: [embed] })

    } else if (i > 25) {
        // Nada

    const candy: number = 0
    const candyTotal: number = member.candy + candy

    embed
    .setThumbnail('')
    .setDescription(`${emojis.blue} Uhm?! Você bateu na porta de uma casa misteriosa, você ouviu um barulho estranho dentro da casa mas ninguém atendeu...\n\n ${emojis.balde_de_doces} Seus doces: \*\*\_\_${candyTotal.toFixed()}\_\_\*\*`);

    await member.update({ used: member.used + 1, candy: candyTotal.toFixed(), lastDate: newDate })

    interaction.reply({ embeds: [embed] })

    } else if (i > 5) {
        // Perdeu

    const candy: number = i / 100 * 2;
    const candyTotal: number = member.candy - candy;

    embed
    .setThumbnail('')
    .setDescription(`${emojis.red} Ops! Você bateu na porta de ${devil_doors[Math.floor(Math.random() * good_doors.length)]} e perdeu **__${candy.toFixed()} Doces ${emojis.doces}__**.\n\n ${emojis.balde_de_doces} Seus doces: \*\*\_\_${candyTotal.toFixed()}\_\_\*\*`);

    await member.update({ used: member.used + 1, candy: candyTotal.toFixed(), lastDate: newDate })

    interaction.reply({ embeds: [embed] })

    } else if (i <= 5) {
        // Jack

    const candy: number = member.candy / 2;
    const candyTotal: number = member.candy - candy;

    embed
    .setThumbnail('')
    .setDescription(`${emojis.black} Oh no! Você bateu na porta de uma \_\_casa assombrada\_\_ e foi pego por uma \*\*\_\_Travessura ${emojis.travessuras}\_\_\*\* do \*\*Jack\*\*, ao correr você deixou cair \*\*metade\*\* dos seus \*\*\_\_Doces \`[${candy}]\`\_\_\*\*.\n\n ${emojis.balde_de_doces} Seus doces: \*\*\_\_${candyTotal.toFixed()}\_\_\*\*`);

    await member.update({ used: member.used + 1, candy: candyTotal.toFixed(), lastDate: newDate })

    interaction.reply({ embeds: [embed] })

    } 

}

exports.data = new SlashCommandBuilder()
.setName('trickortreat')
.setDescription('Doçuras ou Travessuras? ~Ahahahahaha~')