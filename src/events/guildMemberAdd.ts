import { MessageEmbed, ThreadChannel, GuildMember } from 'discord.js';
import { SuperChanTypes } from '../types/Client';
import emojis from '../json/emojis.json';
import moment from 'moment';
moment.locale('pt-bt')

module.exports = async (SuperChan: SuperChanTypes, member: GuildMember) => {
    if (member.guild.id === "831638879094308935") {
        if (moment().diff(moment(member.user.createdAt), 'days') > 60)
            return;

        await member.roles.add("899430178973949992")

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true}))
        .setTitle(`${emojis.info} Novo membro!`)
        .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${member.user.tag} - ${member.user.id}\`\n${emojis.timer} \*\*Conta criada\*\* <t:${Number(member.user.createdTimestamp / 1000).toFixed()}:R>`)

        const channel = member.guild.channels.cache.get("900452257848492062") as ThreadChannel;

        await channel.send({ embeds: [embed] });

        return;
    }
}