import { Interaction, ButtonInteraction, CommandInteraction } from "discord.js";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";
import { readdirSync } from "fs";
import { magenta, red } from "colors";
import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = async (SuperChan: SuperChanTypes, interaction: Interaction) => {

    try {
    let Slashs: string[] = readdirSync('src/slashs')
    let Buttons: string[] = readdirSync('src/buttons')

    Slashs = Slashs.map(name => name.split('.')[0])
    Buttons = Buttons.map(name => name.split('.')[0])

    if (interaction.isCommand()) {
        if (!Slashs.includes(interaction.commandName)) return interaction.reply({ content: `${emojis.error} Ops! Desculpe <@${interaction.user.id}>, mas parece que este comando não está registrado no meu sistema, eu vou notificar o meu criador para ele resolver o mais breve possível.\n${emojis.developer} <@!293913134748401674>.` })

        return Slash(SuperChan, interaction, interaction.commandName)
    } else if (interaction.isButton()) {
        if (!Buttons.includes(interaction.customId)) return interaction.reply({ content: `${emojis.error} Ops! Desculpe <@${interaction.user.id}>, mas parece que este botão não está registrado no meu sistema, eu vou notificar o meu criador para ele resolver o mais breve possível.\n${emojis.developer} <@!293913134748401674>.` })

        return Button(SuperChan, interaction, interaction.customId)
    }
    } catch (err) {
        (interaction as CommandInteraction).reply({ content: `${emojis.error} Ops! Desculpe <@${interaction.user.id}>, mas ocorreu um erro no meu código, eu vou notificar o meu criador para ele resolver o mais breve possível.\n${emojis.developer} <@!293913134748401674>.\n\n\`\`\`js\n${err}\n\`\`\`` })
        console.log(magenta('[SCRIPT]') + red(' Ocorreu um erro! ') + err)
    }
}

async function Slash(SuperChan: SuperChanTypes, interaction: CommandInteraction , name: string) {
    const file = require(`../slashs/${name}`)

    return file.run(SuperChan, interaction)
}

async function Button(SuperChan: SuperChanTypes, interaction: ButtonInteraction , name: string) {
    const file = require(`../buttons/${name}`)

    return file.run(SuperChan, interaction)
}