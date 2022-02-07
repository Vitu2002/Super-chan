import { MessageEmbed, WebhookClient } from "discord.js";

export default async function error(err: Error) {
    const embed = new MessageEmbed()
    .setColor("RED")
    .setTitle("<:ss_info:911024684110340166> Ocorreu um erro na central!")
    .setDescription(`\`\`\`js\n${err.message}\n\`\`\``);

    const webhook = new WebhookClient({ url: "https://discord.com/api/webhooks/937391509974679572/CARvHLl9PtiRXd7U8f21dONW5NdW21puNeaO-MRfZg6bLhjDEbU795qsTvUFKbyjuRgY" })
    await webhook.send({
        content: "> <:ss_x:911024648500699167> Falha crítica!\n\n> " + err.name,
        embeds: [embed]
    });

}