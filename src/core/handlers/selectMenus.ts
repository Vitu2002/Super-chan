import { magenta, yellow, red, green, gray } from 'colors';
import { SuperChanTypes } from '../../types/Client';

export default async function Buttons(SuperChan: SuperChanTypes, files: string[]) {
    // Avisando que está começando a carregar os botões
    console.log(magenta('[Discord]') + yellow(` Carregando ${red(`${files.length}`)} menus.`))

    if (files.length <= 0) return console.error(magenta('[Discord]') + red(` Nenhum ${gray('menu')} encontrado.`))

    files.forEach(file => {
        try {
            const commandName = file.split('.')[0]
            const commandFile = require(`../../interactions/select-menus/${file}`);
            if (!['js', 'ts'].includes(file.split('.')[1])) return;
            if (commandFile.init) commandFile.init(SuperChan);

            SuperChan.interactions.selectMenus.set(commandName, commandFile)
            console.log(magenta('[Discord]' + green(` O menu ${gray(`${commandName}`)} foi carregado com sucesso!`)))
        } catch(err) {
            console.error(magenta('[Discord]') + yellow(` O menu ${gray(`${file}`)} teve uma falha ao carregar!\n` + err));
            SuperChan.interactions.errors.push({ type: "selectMenu", file: file, error: err })
        }
    })
}