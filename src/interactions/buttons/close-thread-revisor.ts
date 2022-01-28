import { ButtonInteraction, GuildChannel, ThreadChannel } from "discord.js";
import { unlinkSync, writeFileSync } from "fs";
import { SuperChanTypes } from "../../types/Client";
import { ThreadJson } from "../../types/ThreadJson";

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {

    const revisores: ThreadJson[] = require('../json/thread-revisor.json')

    const channel = await interaction.guild?.channels.cache.get('891394652467499088');
    const thread = await interaction.guild?.channels.cache.get(interaction.channelId);
    const i: number = await revisores.map(data => { return data.user}).indexOf(interaction.user.id)

    await (thread as ThreadChannel).delete(`Thread fechada por ${interaction.user.tag} - ${interaction.user.id}`)
    await (channel as GuildChannel).permissionOverwrites.delete(`${revisores[i].user}`)

    await revisores.slice(i)

    await unlinkSync('src/json/thread-revisor.json')
    await writeFileSync('src/json/thread-revisor.json', JSON.stringify(revisores))
}