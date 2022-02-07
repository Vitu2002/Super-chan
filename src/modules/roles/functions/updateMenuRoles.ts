import MenuRoles from "../../../database/models/MenuRoles";
import { SuperChan } from "../../../@types/SuperChan";

export default async function updateMenuRoles(Client: SuperChan) {
    const roles = await MenuRoles.find();
    Client.data.menuRoles = roles;
    console.log("[Database] Links atualizados com sucesso!")
}