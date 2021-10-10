import { SuperChanTypes } from '../types/Client';
import { magenta, yellow } from 'colors';
import Handler from './handlers';
import MongoDB from './mongoose';
import { readdirSync } from 'fs';
import { config } from 'dotenv';

const SuperChan = new SuperChanTypes();

config()
MongoDB()
Handler.Events(SuperChan, readdirSync('src/events'));
Handler.Slashs(SuperChan, readdirSync('src/slashs'));
Handler.Commands(SuperChan, readdirSync('src/commands'));

SuperChan.on('error', err => {
    console.error(magenta('[Discord]' + yellow(' Ops! Ocorreu um erro! ') + err))
})

SuperChan.login(process.env.DISCORD_TOKEN)