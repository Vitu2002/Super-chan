import { SuperChan } from "../../../../@types/SuperChan";

module.exports = async (Client: SuperChan) => {
    if (!Client.user) return;

    Client.user.setPresence({
        status: "online",
        activities: [{
            type: "WATCHING",
            name: "roles"
        }]
    });

    console.log("[SYSTEM] Sistema ativado com sucesso!");
}