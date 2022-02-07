import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";

exports.run = async (Client: SuperChan, i: ButtonInteraction) => {
    await i.deferReply({ ephemeral: true });

    const member = await i.guild?.members.fetch(i.message.content);
    const row = new MessageActionRow().addComponents(new MessageButton().setStyle("DANGER").setLabel("BANIR").setEmoji("738375981240156180").setCustomId("captcha-ban").setDisabled(true));
    const msg = i.message as Message;

    if (!member) {
        const embed = new MessageEmbed().setColor("RED").setDescription(`${emojis.error} Ops! Parece que esse membro já foi banido!`)
        await msg.edit({ content: `> ${emojis.error} \*\*Membro não encontrado!\*\*`, components: [row] });
        return await i.editReply({ embeds: [embed] });
    }

    if (member.bannable) {
        const embed = new MessageEmbed().setColor("RED").setDescription(`${emojis.error} Ops! Parece que esse membro já foi banido!`)
        await msg.edit({ content: `> ${emojis.error} \*\*Impossível banir o membro.\*\*`, components: [row] });
        return await i.editReply({ embeds: [embed] });
    }

    const embed = new MessageEmbed().setColor("GREEN").setDescription(`${emojis.success} Pronto! O membro foi banido com sucesso!`);
    await msg.edit({ content: `> ${emojis.success} \*\*Membro banido com sucesso!\*\*`, components: [row] });
    return await i.editReply({ embeds: [embed] });
}