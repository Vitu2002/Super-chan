import { ButtonInteraction, Message, MessageEmbed } from "discord.js";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";
import Tips from "../types/Tips";

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {

    const data: Tips[] = require('../json/tips');

    const page = data[SuperChan.pageNumber]
    const pagesCount = data.length

    if (SuperChan.pageNumber == 0) {
        SuperChan.pageNumber = pagesCount - 1
    } else {
        SuperChan.pageNumber--
    }

    const tip: Tips = data[SuperChan.pageNumber]

    const embeds = [
        new MessageEmbed()
            .setAuthor('SuperScans', `${interaction.guild?.iconURL({ dynamic: true })}`)
            .setTitle(`${emojis.translator} Dicas de Tradução ${tip.language_flag} | #${tip.id}`)
            .setDescription(`${emojis.blue} Original: \*\*${tip.tip_original}\*\*\n${emojis.green} Tradução: \*\*${tip.tip_translation}\*\*\n${emojis.red} Exemplo:\n\`\`\`diff\n- ${tip.example_original}\n+ ${tip.example_translation}\n\`\`\``)
            .setThumbnail(page.user_avatar)
            .setFooter(`Página ${SuperChan.pageNumber + 1} de ${pagesCount} | Tip by ${tip.user_name}`)
        ];
                
    await (interaction.message as Message).edit({ content: `Utilizado por: \`${interaction.user.tag}\``, embeds })
}