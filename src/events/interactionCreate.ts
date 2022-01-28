import { Interaction, ButtonInteraction, MessageEmbed, CommandInteraction, ThreadChannel, SelectMenuInteraction } from "discord.js";
import { magenta, red, blue, gray, cyan, yellow, green } from "colors";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";
import moment from "moment";
moment.updateLocale('pt-bt', null);

const ignore = {
    slashs: [""],
    buttons: ["custom-roles-edit-cancel", "custom-roles-edit-icon", "custom-roles-edit-color", "custom-roles-edit-name", "custom-roles-edit", "custom-roles-info", "custom-roles-delete", "custom-roles-delete-confirm", "custom-roles-delete-cancel", "custom-roles-create", "custom-roles-save", "custom-roles-cancel",'donators-prev', 'donators-next', 'rank-prev', 'rank-next', 'shop-prev', 'shop-next', 'shop-buy'],
    selectMenus: ["captcha"]
}

module.exports = (SuperChan: SuperChanTypes, interaction: Interaction) => {
    try {
        if (interaction.isButton()) {
            console.log(interaction.customId)
            if (!SuperChan.interactions.buttons.get(interaction.customId)) return;
            if (ignore.buttons.includes(interaction.customId)) return;
        
            return handle(SuperChan, interaction, "BUTTON");
        } else if (interaction.isCommand()) {
            if (!SuperChan.interactions.slashs.get(interaction.commandName)) return;
            if (ignore.slashs.includes(interaction.commandName)) return;
            
            return handle(SuperChan, interaction, "SLASH");
        } else if (interaction.isSelectMenu()) {
            if (!SuperChan.interactions.selectMenus.get(interaction.customId)) return;
            if (ignore.selectMenus.includes(interaction.customId)) return;

            return handle(SuperChan, interaction, "SELECT_MENU");
        }
    } catch (err) {
        (interaction as CommandInteraction).reply({ content: `${emojis.error} Ops! Desculpe <@${interaction.user.id}>, mas ocorreu um erro no meu código, eu vou notificar o meu criador para ele resolver o mais breve possível.\n${emojis.developer} <@!293913134748401674>.\n\n\`\`\`js\n${err}\n\`\`\`` })
        console.log(magenta('[SCRIPT]') + red(' Ocorreu um erro! ') + err)
    }
}


function handle(SuperChan: SuperChanTypes, interaction: ButtonInteraction | CommandInteraction | SelectMenuInteraction, type: "BUTTON" | "SLASH" | "SELECT_MENU") {

    log(SuperChan, interaction, type);
    const data = {
        folder: type === "BUTTON" ? "buttons" : type === "SLASH" ? "slashs" : "select-menus",
        name: type === "SLASH" ? (interaction as CommandInteraction).commandName : (interaction as ButtonInteraction | SelectMenuInteraction).customId,
    }

    const file = require(`../interactions/${data.folder}/${data.name}`)
    return file.run(SuperChan, interaction);
}

function log(SuperChan: SuperChanTypes, interaction: ButtonInteraction | CommandInteraction | SelectMenuInteraction, type: "BUTTON" | "SLASH" | "SELECT_MENU") {

    const data = {
        type: type === "BUTTON" ? "botão" : type === "SLASH" ? "slash" : "selectMenu",
        name: type === "SLASH" ? (interaction as CommandInteraction).commandName : (interaction as ButtonInteraction | SelectMenuInteraction).customId,
        date: moment().format('DD/MM/YY [ás] HH:mm:ss')
    }

    const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }), `https://discord.com/channels/@me/${interaction.user.id}`)
        .setTitle(`${emojis.info} Nova interação!`)
        .setDescription(`${emojis.search} \*\*Tipo:\*\* \`${type === "BUTTON" ? "Botão" : type === "SLASH" ? "Slash" : "SelectMenu" }\`\n${emojis.file} \*\*Nome:\*\* \`${data.name}\`\n${emojis.timer} \*\*Data:\*\* <t:${Number((Date.now() as number) / 1000).toFixed()}:R>`)
        .setFooter(`${interaction.user.id}`)

    console.log(`${blue('[LOG]')} ${gray(`${data.date}`)} O membro ${cyan(`${interaction.user.tag} - ${interaction.user.id}`)} utilizou o ${yellow(data.type)} ${green(`'${data.name}'`)}`)
    return (interaction.guild?.channels.cache.get('878056378520989736') as ThreadChannel).send({ embeds: [embed] });
}