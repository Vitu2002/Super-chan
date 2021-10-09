import { Client, Collection, ClientOptions, Message, Interaction } from 'discord.js';

const options: ClientOptions = {
    intents: [
        "GUILDS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES"
    ]
};

interface Command {
    name: string;
    description: string;
    execute: (message: Message, args: string[]) => any;
}

interface Slashs {
    name: string;
    description: string;
    execute: (interaction: Interaction) => any;
}

export class SuperChanTypes extends Client {
    commands: Collection<string, Command>;
    
    constructor() {
        super(options);
        this.commands = new Collection();
    }
}