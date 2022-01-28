import { ButtonInteraction, GuildChannel, MessageActionRow, MessageButton, MessageEmbed, ThreadChannel } from "discord.js";
import { SuperChanTypes } from "../../types/Client";
import emojis from "../../json/emojis.json";
import { ThreadJson } from "../../types/ThreadJson";
import { unlinkSync, writeFileSync } from "fs";

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {

    const revisores: ThreadJson[] = require('../json/thread-revisor.json')

    if (interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has('834674596895653899'))
        return interaction.reply({ content: `${emojis.error} Ops <@!${interaction.user.id}>! Você já faz parte da equipe!`, ephemeral: true})

    const users = revisores.map(data => { return data.user})

    if (users.includes(interaction.user.id)) return interaction.reply({ content: `${emojis.error} Ops <@!${interaction.user.id}>! Você já tem uma thread aberta!`, ephemeral: true})

    if (interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has('834674596895653899'))
        return interaction.reply({ content: `${emojis.error} Ops <@!${interaction.user.id}>! Você já faz parte da equipe!`, ephemeral: true})

    interaction.reply({ content: `${emojis.success} Pronto! Você abriu uma Thread para solicitar um teste de revisor.`, ephemeral: true })

    const channel = await interaction.guild?.channels.cache.get('891394652467499088');

    await (channel as GuildChannel).permissionOverwrites.edit(interaction.user.id, { VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })

    const thread = await (channel as any).threads.create({
        name: `${interaction.user.username}`,
        autoArchiveDuration: 60*24*3,
        type: 'GUILD_PRIVATE_THREAD',
        reason: `O membro ${interaction.user.tag} - ${interaction.user.id} solicitou um teste para revisor.`,
    });

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('close-thread-revisor')
            .setLabel('Fechar')
            .setStyle('DANGER')
            .setEmoji('738375981240156180')
    )

    const embed = new MessageEmbed()
    .setDescription(`${emojis.info} Olá ${interaction.user.username}, a nossa equipe já foi notificada sobre a sua solicitação para \*\*REVISOR\*\*, em breve iremos entrar em contato com você.\n\n\`\`\`\nNo momento, você poderia indo nos falando um pouco sobre você?\n\`\`\``)
    .setColor('#ff3662')
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setFooter(`SuperScans, vivendo um novo mundo!`, `${interaction.guild?.iconURL({ dynamic: true })}`)

    await (thread as ThreadChannel).send({ content: `<@&834674596895653899> - <@!${interaction.user.id}>`, embeds: [embed], components: [row]})

    await revisores.push({ user: interaction.user.id, channel: interaction.channelId, open: true})

    await unlinkSync('src/json/thread-revisor.json')
    await writeFileSync('src/json/thread-revisor.json', JSON.stringify(revisores))
}