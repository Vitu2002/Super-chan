import { magenta, yellow, red, green, gray } from 'colors';
import { SuperChanTypes } from '../../types/Client';

export default async function Commands(SuperChan: SuperChanTypes, files: string[]) {
    // Avisando que está começando a carregar os comandos
    console.log(magenta('[Discord]') + yellow(` Carregando ${red(`${files.length}`)} comandos.`))

    if (files.length <= 0) return console.error(magenta('[Discord]') + red(` Nenhum ${gray('comando')} encontrado.`))

    files.forEach(file => {
        try {
            const commandName = file.split('.')[0]
            const commandFile = require(`../../commands/${file}`);
            if (!['js', 'ts'].includes(file.split('.')[1])) return;
            if (commandFile.init) commandFile.init(SuperChan);

            SuperChan.commands.set(commandFile.data.name, commandFile)
            if (commandFile.data.aliases)
              commandFile.alias = true && commandFile.data.aliases.map(a => SuperChan.commands.set(a, commandFile))
              console.log(magenta('[Discord]' + green(` O comando ${gray(`${commandName}`)} foi carregado com sucesso!`)))
        } catch(err) {
            console.error(magenta('[Discord]') + yellow(` O comando ${gray(`${file}`)} teve uma falha ao carregar!\n` + err));
        }
    })
}