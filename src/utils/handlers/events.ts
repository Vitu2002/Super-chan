import { magenta, yellow, red, gray, green} from 'colors'
import { Client } from 'discord.js'

export default async function loadEvents(SuperChan: Client, files: string[]) {
  // Avisando que está começando a carregar os eventos
  console.log(magenta('[Discord]') + yellow(` Carregando ${red(`${files.length}`)} eventos.`))

  if (files.length <= 0) return console.error(magenta('[Discord]') + red(` Nenhum ${gray('evento')} encontrado`))

  files.forEach(file => {
    try {
      const eventName = file.split('.')[0];
      const eventFile = require(`../../events/${file}`);

      SuperChan.on(eventName, eventFile.bind(null, SuperChan))
      console.log(magenta('[Discord]' + green(` O evento ${gray(`${eventName}`)} foi carregado com sucesso!`)))
    } catch (err) {
      console.error(magenta('[Discord]') + yellow(` O evento ${gray(`${file}`)} teve uma falha ao carregar!\n` + err))
    }
  })
}