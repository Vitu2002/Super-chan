import { Interaction } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";

module.exports = async (Client: SuperChan, i: Interaction) => {
    if (i.isSelectMenu()) {
        const menu = Client.interactions.selects.get(i.customId);

        if (!menu) return;

        return await menu.run(Client, i);

    } else if (i.isButton()) {
        const button = Client.interactions.buttons.get(i.customId);

        if (!button) return;

        return await button.run(Client, i);
    } else if (i.isCommand()) {
        const command = Client.interactions.slashs.get(i.commandName);

        if (!command) return;

        return await command.run(Client, i);
    }
}