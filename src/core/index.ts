import { SuperChanTypes } from '../types/Client';
import { magenta, yellow, red } from 'colors';
import Handler from './handlers';
import MongoDB from './mongoose';
import { readdirSync } from 'fs';
import { config } from 'dotenv';

const SuperChan = new SuperChanTypes();

config()
MongoDB()
Handler.Jsons(SuperChan)
Handler.Events(SuperChan, readdirSync('src/events'));
Handler.Slashs(SuperChan, readdirSync('src/interactions/slashs'));
Handler.Commands(SuperChan, readdirSync('src/interactions/commands'));
Handler.Buttons(SuperChan, readdirSync('src/interactions/buttons'));
Handler.SelectMenus(SuperChan, readdirSync('src/interactions/select-menus'));

SuperChan.on('error', err => {
    console.error(magenta('[Discord]' + yellow(' Ops! Ocorreu um erro! ') + err))
})

SuperChan.login(process.env.DISCORD_TOKEN)