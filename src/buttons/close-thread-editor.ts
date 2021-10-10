import { ButtonInteraction, GuildChannel, ThreadChannel } from "discord.js";
import { unlinkSync, writeFileSync } from "fs";
import { SuperChanTypes } from "../types/Client";
import { ThreadJson } from "../types/ThreadJson";

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {

    const editores: ThreadJson[] = require('../json/thread-editor.json')

    const channel = await interaction.guild?.channels.cache.get('891394614437765141');
    const thread = await interaction.guild?.channels.cache.get(interaction.channelId);
    const i: number = await editores.map(data => { return data.user}).indexOf(interaction.user.id)

    await (thread as ThreadChannel).delete(`Thread fechada por ${interaction.user.tag} - ${interaction.user.id}`)
    await (channel as GuildChannel).permissionOverwrites.delete(`${editores[i].user}`)

    await editores.slice(i)

    await unlinkSync('src/json/thread-editor.json')
    await writeFileSync('src/json/thread-editor.json', JSON.stringify(editores))
}