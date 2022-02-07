import { SuperChan } from '../../@types/SuperChan'

export default async function Events(Client: SuperChan, module: string, files: string[]) {

  if (files.length === 0) return console.log("[SYSTEM] Nenhum evento para ser carregado.");

  files.forEach(file => {
    try {
      const name = file.split('.')[0];
      const extension = file.split(".")[1];

      if (!['js', 'ts'].includes(extension)) return;

      const event = require(`../../modules/${module}/components/events/${file}`);

      if (!event) return console.error(`[SYSTEM] Não foi possível identificar o arquivo ${file}!`);

      Client.on(name, event.bind(null, Client));
      console.log(`[SYSTEM] Evento ${name} carregado com sucesso!`);
    } catch (err) {
      console.error(`[SYSTEM] Não foi possível carregar o evento ${file}!\n`, err);
    };
  });
};