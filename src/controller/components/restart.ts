import { ButtonInteraction, MessageAttachment, Message } from "discord.js";
import { Controller } from "../../@types/Controller";
import { select, restart, logs, list } from "../functions/dashboard";

export default async function startModule(Client: Controller, interaction: ButtonInteraction) {

    const msg = await interaction.deferReply({ fetchReply: true, ephemeral: true });
    const { SelectMenu, optionsValues } = await select();
    await interaction.editReply({ content: "> **Selecione abaixo qual módulo você deseja reiniciar**", components: [SelectMenu] });
    const collector = await (msg as Message).createMessageComponentCollector({ max: 1, componentType: "SELECT_MENU", filter: (f) => f.user.id === interaction.user.id });

    collector.on("collect", async i => {
        const module = optionsValues[optionsValues.findIndex(f => f.value === i.values[0])].module;
        const modules = await list()
        if (modules[modules.findIndex(F => F.name === module)].status !== "online") {
            await interaction.editReply({ content: `> **Ops! Você não pode \`reiniciar\` um módulo que está \`desligado\`.**`, components: [] });
            return;
        }
        await restart(module);

        await interaction.editReply({ content: `> **Pronto! \`Reiniciando\` o módulo \`${module}\`**`, components: [] });
    })
}