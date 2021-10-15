import { CommandInteraction, MessageEmbed } from "discord.js";
import Members from "../database/models/halloween_members";
import { SlashCommandBuilder } from "@discordjs/builders";
import MembersHalloween from "../types/MembersHalloween";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
 try {

    const members: MembersHalloween[] = await Members.find().sort({ candy: -1 });

    const userIndex = await members.map(data => data.id).indexOf(interaction.user.id) + 1 || "Indefinido"

    const rank: string[] = await getText(members)

    const embed = new MessageEmbed()
        .setTitle(`${emojis.balde_de_doces} Rank de Doces`)
        .setDescription(`${rank.join('\n')}`)
        .setFooter(`Sua posição: ${userIndex} | SuperScans, vivendo um novo mundo!`, `${interaction.guild?.iconURL({ dynamic: true })}`)

    interaction.reply({ content: `${interaction.user}`, embeds: [embed] })

    async function getText(members: MembersHalloween[]): Promise<string[]> {
        const text: string[] = [];

        for (let i: number = 0; i < 19; i++) {
            if (members[i]) {
                text.push(`${ i == 0 ? emojis.one_place : i == 1 ? emojis.two_place : i == 2 ? emojis.three_place : emojis.medal } ${i + 1}. <@!${members[i].id}>\n${emojis.doces} Doces: \*\*${members[i].candy?.toFixed()}\*\*`)
            }
        }

        return (text as unknown as string[])
    }

    } catch (err) {
        console.log(err)
    }
}

exports.data = new SlashCommandBuilder()
.setName('rankdoces')
.setDescription('Veja as 20 pessoas com mais doces.')