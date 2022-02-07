import { Interaction } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";

module.exports = async (Client: SuperChan, i: Interaction) => {
    if (i.isButton()) {
        const button = Client.interactions.buttons.get(i.customId);

        if (!button) return;

        await button.run(Client, i);
    }
}