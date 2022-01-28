import BannedLinks from "../database/models/BannedLinks";
import { SuperChanTypes } from "../types/Client";
import { ActivitiesOptions } from "discord.js";
import { green, magenta, cyan, gray } from "colors";
import Role from "../database/models/menuRoles";

const activities: ActivitiesOptions[] = [
    { type: 'PLAYING', name: 'SuperScans', url: "https://superscans.site" },
    { type: 'COMPETING', name: 'custa de um pacote de Pão de Mel', url: "https://vitorlach.site" },
    { type: 'WATCHING', name: 'TATAKAE', url: "https://superscans.site" },
    { type: 'LISTENING', name: "Rammstein", url: "https://open.spotify.com/track/4HLcqGelHzQY7nAhxhh1hO?si=7xU_gKa9Qc6eWTFMwqTGeg&utm_source=copy-link&dl_branch=1"}
]

module.exports = async (SuperChan: SuperChanTypes) => {
    
    // Atualizando o status a cada 30 segundos
    setInterval(() => {
        updateActivity(SuperChan, activities)
    }, 30000)


    // Atualizando os dados principais do bot
    const bannedLinksData = await BannedLinks.find() ?? [];
    SuperChan.data.bannedLinks = bannedLinksData

    const menuRolesData = await Role.find();
    console.log(cyan('[SYSTEM]') + green(` Os dados globais dos SelectMenus foram carregados com sucesso!`));
    SuperChan.data.roles.default = await menuRolesData.filter((role: any) => role.SelectMenu === "roles");
    console.log(cyan('[SYSTEM]') + green(` O SelectMenu ${gray('default')} teve seus cargos carregados com sucesso!`));
    SuperChan.data.roles.colors = await menuRolesData.filter((role: any) => role.SelectMenu === "colors");
    console.log(cyan('[SYSTEM]') + green(` O SelectMenu ${gray('colors')} teve seus cargos carregados com sucesso!`));
    SuperChan.data.roles.projects.normal = await menuRolesData.filter((role: any) => role.SelectMenu === "project-normal");
    console.log(cyan('[SYSTEM]') + green(` O SelectMenu ${gray('project-normal')} teve seus cargos carregados com sucesso!`));
    SuperChan.data.roles.projects.hentai = await menuRolesData.filter((role: any) => role.SelectMenu === "project-hentai");
    console.log(cyan('[SYSTEM]') + green(` O SlectMenu ${gray('project-hentai')} teve seus cargos carregados com sucesso!`));

    // Avisando que o bot iniciou
    console.log(magenta('[Discord]') + green(' Logado com sucesso!'))
}

async function updateActivity(SuperChan: SuperChanTypes, activity: ActivitiesOptions[]) {
    const number = Math.floor(Math.random() * activity.length)

    SuperChan?.user?.setPresence({
        activities: [activity[number]]
    })
}