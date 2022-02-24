import { SuperChan } from "../../../../@types/SuperChan";
import { UpdateMenuRoles } from "../../core";

module.exports = async (Client: SuperChan) => {
    if (!Client.user) return;

    Client.user.setPresence({
        status: "online",
        activities: [{
            type: "WATCHING",
            name: "roles"
        }]
    });

    await UpdateMenuRoles();
    console.log("[SYSTEM] Sistema ativado com sucesso!");
}