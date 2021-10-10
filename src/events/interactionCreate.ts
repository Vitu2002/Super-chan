import { Interaction, ButtonInteraction, CommandInteraction } from "discord.js";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";
import { readdirSync } from "fs";
import { magenta, red } from "colors";

module.exports = async (SuperChan: SuperChanTypes, interaction: Interaction) => {
    
    try {
    const Slashs: string[] = readdirSync('src/slashs')
    const Buttons: string[] = readdirSync('src/buttons')

    if (interaction.isCommand()) {
        

    } else if (interaction.isButton()) {

    }
    } catch (err) {
        (interaction as CommandInteraction).reply({ content: `${emojis.error} Ops! Desculpe <@${interaction.user.id}>, mas ocorreu um erro no meu código, eu vou notificar o meu criador para ele resolver o mais breve possível.\n${emojis.developer} <@!293913134748401674>.\n\n\`\`\`js\n${err}\n\`\`\`` })
        console.log(magenta('[SCRIPT]') + red(' Ocorreu um erro! ') + err)
    }
}