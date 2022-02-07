import { SuperChan } from '../@types/SuperChan';
import { createConnection } from "mongoose";
import { config } from 'dotenv';
import { Events, Slashs, Commands, Buttons, Selects } from './handlers';
import { readdirSync } from 'fs';

config();

export default function createBotConnect(config: ConnectionConfiguration) {
    const Client = new SuperChan();

    const module = config.moduleName;

    Events(Client, module, readdirSync(`src/modules/${module}/components/events`));

    if (config.slashs) Slashs(Client, module, readdirSync(`src/modules/${module}/components/slashs`));
    if (config.buttons) Buttons(Client, module, readdirSync(`src/modules/${module}/components/buttons`));
    if (config.selects) Selects(Client, module, readdirSync(`src/modules/${module}/components/selects`));
    if (config.commands) Commands(Client, module, readdirSync(`src/modules/${module}/components/commands`));

    Client.login(process.env.DISCORD_TOKEN);

    return Client
}

interface ConnectionConfiguration {
    moduleName: string;
    slashs?: boolean;
    selects?: boolean;
    buttons?: boolean;
    commands?: boolean;
}