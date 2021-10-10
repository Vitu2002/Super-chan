import { green, magenta } from "colors";
import { ActivitiesOptions } from "discord.js";
import { SuperChanTypes } from "../types/Client";

module.exports = async (SuperChan: SuperChanTypes) => {
    
    const activities: ActivitiesOptions[] = [
        { type: 'PLAYING', name: 'SuperScans', url: "https://superscans.site" },
        { type: 'COMPETING', name: 'custa de um pacote de Pão de Mel', url: "https://vitorlach.site" },
        { type: 'WATCHING', name: 'Evento de Halloween', url: "https://superscans.site" },
        { type: 'LISTENING', name: "Rammstein", url: "https://open.spotify.com/track/4HLcqGelHzQY7nAhxhh1hO?si=7xU_gKa9Qc6eWTFMwqTGeg&utm_source=copy-link&dl_branch=1"}
    ]

    setInterval(() => { updateActivity(SuperChan, activities)}, 30000)

    console.log(magenta('[Discord]') + green(' Logado com sucesso!'))
}

async function updateActivity(SuperChan: SuperChanTypes, activity: ActivitiesOptions[]) {
    const number = Math.floor(Math.random() * activity.length)

    SuperChan?.user?.setPresence({
        activities: [activity[number]]
    })
}