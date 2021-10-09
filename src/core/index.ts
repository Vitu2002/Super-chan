import { SuperChanTypes } from '../types/Client';
import { magenta, yellow } from 'colors';
import Handler from './handlers';
import { readdirSync } from 'fs';
import { config } from 'dotenv';

config()

const SuperChan = new SuperChanTypes();

Handler.Events(SuperChan, readdirSync('../events'));
Handler.Slashs(SuperChan, readdirSync('../slashs'));
Handler.Commands(SuperChan, readdirSync('../commands'));

SuperChan.on('error', err => {
    console.error(magenta('[Discord]' + yellow(' Ops! Ocorreu um erro! ') + err))
})

SuperChan.login(process.env.DISCORD_TOKEN)