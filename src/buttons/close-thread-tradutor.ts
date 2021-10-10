import { ButtonInteraction, GuildChannel, ThreadChannel } from "discord.js";
import { unlinkSync, writeFileSync } from "fs";
import { SuperChanTypes } from "../types/Client";
import { ThreadJson } from "../types/ThreadJson";

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {

    const tradutores: ThreadJson[] = require('../json/thread-tradutor.json')

    const channel = await interaction.guild?.channels.cache.get('891394652467499088');
    const thread = await interaction.guild?.channels.cache.get(interaction.channelId);
    const i: number = await tradutores.map(data => { return data.user}).indexOf(interaction.user.id)

    await (thread as ThreadChannel).delete(`Thread fechada por ${interaction.user.tag} - ${interaction.user.id}`)
    await (channel as GuildChannel).permissionOverwrites.delete(`${tradutores[i].user}`)

    await tradutores.slice(i)

    await unlinkSync('src/json/thread-tradutor.json')
    await writeFileSync('src/json/thread-tradutor.json', JSON.stringify(tradutores))
}