import { ButtonInteraction, MessageAttachment, Message } from "discord.js";
import { Controller } from "../../@types/Controller";
import { select, logs } from "../functions/dashboard";

export default async function getLogs(Client: Controller, interaction: ButtonInteraction) {

    const msg = await interaction.deferReply({ fetchReply: true, ephemeral: true });
    const { SelectMenu, optionsValues } = await select();
    await interaction.editReply({ content: "> **Selecione abaixo qual módulo você deseja ver as logs**", components: [SelectMenu] });
    const collector = await (msg as Message).createMessageComponentCollector({ max: 1, componentType: "SELECT_MENU", filter: (f) => f.user.id === interaction.user.id });

    collector.on("collect", async i => {
        const module = optionsValues[optionsValues.findIndex(f => f.value === i.values[0])].module;
        const Logs = await logs(module);
        const file = new MessageAttachment(Buffer.from(Logs, "utf-8"), "logs.txt");

        await interaction.editReply({ content: `> **Aqui está os logs do módulo \`${module}\`**`, components: [], files: [file] });
    })

}