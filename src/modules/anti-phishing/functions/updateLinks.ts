import BannedLinks from "../../../database/models/BannedLinks";
import { SuperChan } from "../../../@types/SuperChan";

export default async function updateLinks(Client: SuperChan) {
    const links = await BannedLinks.find();
    Client.data.phishingLinks = links;
    console.log("[DATABASE] Links atualizados com sucesso!")
}