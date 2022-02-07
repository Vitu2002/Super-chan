import { SuperChan } from '../../@types/SuperChan';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { config } from 'dotenv';

config()

export default async function Slashs(Client: SuperChan, module: string, files: string[]) {

    if (files.length === 0) return console.log("[SYSTEM] Nenhum slash para ser carregado.");

    const slashs: object[] = [];

    files.forEach(file => {
        try {
            console.log(`[SYSTEM] Carregando o slash ${file}.`)

            const name = file.split(".")[0];
            const extension = file.split(".")[1];

            if (!['js', 'ts'].includes(extension)) return;

            const slash = require(`../../modules/${module}/components/slashs/${file}`)

            if (!slash) return console.error(`[SYSTEM] Não foi possível identificar o arquivo ${file}!`)

            if (slash.init) slash.init(Client);
            Client.interactions.slashs.set(name, slash);
            console.log(`[SYSTEM] Comando ${name} carregado com sucesso!`);
            return slashs.push(slash.data.toJSON());
        } catch (err) {
            console.error(`[SYSTEM] Não foi possível carregar o slash ${file}!\n`, err)
        }
    });

    await new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string).put(
        Routes.applicationGuildCommands("869377195682983957", "831638879094308935"),
        { body: slashs },
    );
}