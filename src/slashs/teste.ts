import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import { SuperChanTypes } from "../types/Client"

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
    interaction.reply('testado')
}

exports.data = new SlashCommandBuilder()
.setName('teste')
.setDescription('testando')