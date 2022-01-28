import { magenta, yellow, red, white, green, gray } from 'colors';
import { SuperChanTypes } from '../../types/Client';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { config } from 'dotenv';

config()

export let SlashsFiles: any = [];

const rest = new REST({ version: '9' }).setToken(`${process.env.DISCORD_TOKEN}`);

export default async function Slashs(SuperChan: SuperChanTypes, files: string[]) {
    const SlashsArray: object[] = [];
    try {
    // Avisando que está começando a carregar os comandos
    console.log(magenta('[Discord]') + yellow(` Carregando ${red(`${files.length}`)} slashs.`))

    if (files.length <= 0) return console.error(magenta('[Discord]') + red(` Nenhum ${gray('slash')} encontrado.`))

    files.forEach(file => {
        try {
            const slashName = file.split('.')[0]
            const slashFile = require(`../../interactions/slashs/${file}`);
            if (!['js', 'ts'].includes(file.split('.')[1])) return;
            //if (slashFile.init) slashFile.init(SuperChan);

            SlashsArray.push(slashFile.data.toJSON())
            SuperChan.interactions.slashs.set(slashName.toLowerCase(), slashFile);
            console.log(magenta('[Discord]' + green(` O slash ${gray(`${slashName}`)} foi carregado com sucesso!`)))
        } catch(err) {
            console.error(magenta('[Discord]') + yellow(` O slash ${gray(`${file}`)} teve uma falha ao carregar!\n` + err));
            SuperChan.interactions.errors.push({ type: "slash", file: file, error: err })
        }
    })

    await rest.put(
        Routes.applicationGuildCommands("869377195682983957", "831638879094308935"),
        { body: SlashsArray }
    );
    } catch (err) {
        console.log('Erro ao salvar os slashs')
        console.error(err)
        SuperChan.interactions.errors.push({ type: "slash", file: files.join(' '), error: err })
    }
}