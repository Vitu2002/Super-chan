import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, ThreadChannel } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";
import moment from "moment";

module.exports = async (Client: SuperChan, member: GuildMember) => {
    if (member.guild.id !== "831638879094308935") return;

    const createdAt = moment(member.user.createdAt)
    const diffTime = moment().diff(createdAt, "days")

    if (diffTime >= 60) return;

    if (diffTime <= 6) return member.kick(`Conta com apenas ${diffTime} dias.`);

    await member.roles.add("899430178973949992");

    const row = new MessageActionRow().addComponents(new MessageButton().setStyle("DANGER").setLabel("BANIR").setEmoji("738375981240156180").setCustomId("captcha-ban"))
    const embed = new MessageEmbed().setColor('#8348a5').setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true})).setTitle(`${emojis.info} Novo membro!`).setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${member.user.tag} - ${member.user.id}\`\n${emojis.timer} \*\*Conta criada\*\* <t:${Number(member.user.createdTimestamp / 1000).toFixed()}:R>`).setFooter(member.id);
    const channel = member.guild.channels.cache.get("900452257848492062") as ThreadChannel;

    return await channel.send({ content: member.id, embeds: [embed], components: [row] });
}