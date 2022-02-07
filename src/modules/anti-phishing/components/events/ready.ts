import { SuperChan } from "../../../../@types/SuperChan";
import { UpdateLinks } from "../../core";

module.exports = async (Client: SuperChan) => {
    if (!Client.user) return;

    Client.user.setPresence({
        status: "online",
        activities: [{
            type: "PLAYING",
            name: "anti-phishing"
        }]
    });

    await UpdateLinks();

    console.log("[SYSTEM] Sistema ativado com sucesso!");
}