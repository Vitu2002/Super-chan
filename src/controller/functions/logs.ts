import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { Controller } from "../../@types/Controller";
import system from "systeminformation";
import disk from "diskusage";
import { list } from "./dashboard";

export default async function logs(Client: Controller) {

    const guild = await Client.guilds.fetch("831638879094308935");
    const dashboardChannel = await guild.channels.fetch("937389022630785056")
    const message = await (dashboardChannel as TextChannel).messages.fetch("937389692616343582")
    const started = (Date.now() / 1000).toFixed();

    update();

    setInterval(() => {
        update();
    }, 30000);

    async function update() {
        const modules = await list();
        const cpu = await system.cpu();
        const mem = await system.mem();
        const osi = await system.osInfo();
        const cul = await system.currentLoad();
        const diskUsage = disk.checkSync("/");

        const memTotalMb = mem.total / 1024 / 1024;
        const memTotalType = memTotalMb > 1024 ? "GB" : "MB";
        const memTotal = memTotalMb > 1024 ? (memTotalMb / 1024).toFixed(1) : (memTotalMb).toFixed(1);
        const memUsedMb = mem.used / 1024 / 1024;
        const memUsedType = memUsedMb > 1024 ? "GB" : "MB";
        const memUsed = memUsedMb > 1024 ? (memUsedMb / 1024).toFixed(1) : (memUsedMb).toFixed(1);

        const embed = new MessageEmbed()
        .setColor("#8348a5")
        .setDescription(`
<:countainer:738375764927316028> **SO**: \`${osi.distro.toLocaleUpperCase()} ${osi.release}\`
<:process:738376639800410124> **CPU**: \`${Number(cul.currentLoad).toFixed(2)}%\` (${cpu.manufacturer} ${cpu.brand})
<:ram:738376680741142558> **Ram**: \`${memUsed}${memUsedType}/${memTotal}${memTotalType}\`
<:ssd:738376969703653377> **SSD**: \`${Number((diskUsage.total - diskUsage.available) / 1024 / 1024 / 1024).toFixed(2)}GB\`
<:timer:738377157243306015> **Ligado**: <t:${started}:R>
<:timer:738377157243306015> **Última verificação**: <t:${(Date.now() / 1000).toFixed()}:R>

${modules.map(module => {
    return `${module.status === "stopped" ? "<:off:738376425920528384>" : "<:on:738376529180098601>"} | \*\*${module.name}\*\* \`(CPU: ${module.cpu} | Ram: ${module.mem})\``
}).join("\n")}
        `)

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Start")
            .setEmoji("738376529180098601")
            .setCustomId("dashboard-start"),

            new MessageButton()
            .setStyle("DANGER")
            .setLabel("Stop")
            .setEmoji("738376425920528384")
            .setCustomId("dashboard-stop"),

            new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Restart")
            .setEmoji("738376834022113320")
            .setCustomId("dashboard-restart"),

            new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Logs")
            .setEmoji("738376012647104533")
            .setCustomId("dashboard-logs")
        )

        await message.edit({ embeds: [embed] });
    }
}