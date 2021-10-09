import { SuperChanTypes } from "../types/Client";

module.exports = async (SuperChan: SuperChanTypes) => {
    

    SuperChan.user.setPresence({
        activities: [
            { type: 'PLAYING', name: 'SuperScans', url: "https://superscans.site" },
            { type: 'COMPETING', name: 'por um pacote de Pão de Mel', url: "https://vitorlach.site" },
            { type: 'WATCHING', name: 'Evento de Halloween', url: "https://superscans.site" },
            { type: 'LISTENING', name: 'Rammstein'}
        ]
    })
}