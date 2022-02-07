import hasBannedLinks from "../../functions/bannedLinks";
import { SuperChan } from "../../../../@types/SuperChan";
import { Message } from "discord.js";

module.exports = async (Client: SuperChan, message: Message) => {
    if (message.author.bot) return;

    await hasBannedLinks(Client, message);
}