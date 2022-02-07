import { SuperChan } from '../../@types/SuperChan';

export default async function Buttons(Client: SuperChan, module: string, files: string[]) {

    if (files.length === 0) return console.log("[SYSTEM] Nenhum button para ser carregado.");

    files.forEach(file => {
        try {
            console.log(`[SYSTEM] Carregando o button ${file}.`)

            const name = file.split(".")[0];
            const extension = file.split(".")[1];

            if (!['js', 'ts'].includes(extension)) return;

            const button = require(`../../modules/${module}/components/buttons/${file}`)

            if (!button) return console.error(`[SYSTEM] Não foi possível identificar o arquivo ${file}!`)

            if (button.init) button.init(Client);
            Client.interactions.buttons.set(name, button);
            console.log(`[SYSTEM] Button ${name} carregado com sucesso!`);
        } catch (err) {
            console.error(`[SYSTEM] Não foi possível carregar o button ${file}!\n`, err)
        };
    });
};