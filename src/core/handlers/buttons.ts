import { magenta, yellow, red, green, gray } from 'colors';
import { SuperChanTypes } from '../../types/Client';

export default async function Buttons(SuperChan: SuperChanTypes, files: string[]) {
    // Avisando que está começando a carregar os botões
    console.log(magenta('[Discord]') + yellow(` Carregando ${red(`${files.length}`)} botões.`))

    if (files.length <= 0) return console.error(magenta('[Discord]') + red(` Nenhum ${gray('botão')} encontrado.`))

    files.forEach(file => {
        try {
            const commandName = file.split('.')[0]
            const commandFile = require(`../../interactions/buttons/${file}`);
            if (!['js', 'ts'].includes(file.split('.')[1])) return;
            if (commandFile.init) commandFile.init(SuperChan);

            SuperChan.interactions.buttons.set(commandName, commandFile)
            console.log(magenta('[Discord]' + green(` O botão ${gray(`${commandName}`)} foi carregado com sucesso!`)))
        } catch(err) {
            console.error(magenta('[Discord]') + yellow(` O botão ${gray(`${file}`)} teve uma falha ao carregar!\n` + err));
            SuperChan.interactions.errors.push({ type: "button", file: file, error: err })
        }
    })
}