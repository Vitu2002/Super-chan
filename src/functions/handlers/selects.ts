import { SuperChan } from '../../@types/SuperChan';

export default async function Selects(Client: SuperChan, module: string, files: string[]) {

    if (files.length === 0) return console.log("[SYSTEM] Nenhum select para ser carregado.");

    files.forEach(file => {
        try {
            console.log(`[SYSTEM] Carregando o select ${file}.`)

            const name = file.split(".")[0];
            const extension = file.split(".")[1];

            if (!['js', 'ts'].includes(extension)) return;

            const select = require(`../../modules/${module}/components/selects/${file}`)

            if (!select) return console.error(`[SYSTEM] Não foi possível identificar o arquivo ${file}!`)

            if (select.init) select.init(Client);
            Client.interactions.selects.set(name, select);
            console.log(`[SYSTEM] Select ${name} carregado com sucesso!`);
        } catch (err) {
            console.error(`[SYSTEM] Não foi possível carregar o select ${file}!\n`, err)
        };
    });
};