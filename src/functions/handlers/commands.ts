import { magenta, yellow, red, green, gray } from 'colors';
import { SuperChan } from '../../@types/SuperChan';

export default async function Commands(Client: SuperChan, module: string, files: string[]) {

    if (files.length === 0) return console.log("[SYSTEM] Nenhum comando para ser carregado.");

    files.forEach(file => {
        try {
            console.log(`[SYSTEM] Carregando o comando ${file}.`)

            const name = file.split(".")[0];
            const extension = file.split(".")[1];

            if (!['js', 'ts'].includes(extension)) return;

            const command = require(`../../modules/${module}/components/commands/${file}`)

            if (!command) return console.error(`[SYSTEM] Não foi possível identificar o arquivo ${file}!`)

            if (command.init) command.init(Client);
            Client.interactions.commands.set(name, command);
            if (command.data.aliases) command.data.aliases.forEach((alias: string) => Client.interactions.commands.set(alias, command))
            console.log(`[SYSTEM] Comando ${name} carregado com sucesso!`);
            return;
        } catch (err) {
            console.error(`[SYSTEM] Não foi possível carregar o comando ${file}!\n`, err)
        }
    });
};