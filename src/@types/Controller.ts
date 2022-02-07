import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, Client, ClientOptions, Collection, CommandInteraction, Message, MessageSelectOptionData, PermissionFlags, Permissions, PermissionString, SelectMenuInteraction } from "discord.js";

const options: ClientOptions = {
    intents: ["GUILDS","GUILD_INVITES","GUILD_MEMBERS","GUILD_MESSAGES","GUILD_PRESENCES"]
};

export class Controller extends Client {
    interactions: Interactions;

    constructor() {
        super(options)
        this.interactions = {
            ignored: { 
                slashs: [],
                buttons: [],
                selects: [],
                commands: []
            },
            slashs: new Collection(),
            selects: new Collection(),
            buttons: new Collection(),
            commands: new Collection()
        }
    }
}









/* [!]=========================================[!] */
/* [!]               INTERACTIONS              [!] */
/* [!]=========================================[!] */
interface Interactions {
    ignored: IgnoredInteractions;
    slashs: Collection<string, Slash>;
    selects: Collection<string, Select>;
    buttons: Collection<string, Button>;
    commands: Collection<string, Command>;
}





/* [!]=========================================[!] */
/* [!]              TEXT COMMANDS              [!] */
/* [!]=========================================[!] */
interface Command {
    run: (SuperChan: Controller, message: Message, args: string[]) => any;
    data: CommandData
}

interface CommandData {
    name: string;
    aliases: string[];
    description: string;
    permissions: DataPermissions;
}





/* [!]=========================================[!] */
/* [!]              SELECT-MENUS               [!] */
/* [!]=========================================[!] */
interface Select {
    run: (Client: Controller, interaction: SelectMenuInteraction) => any;
    data: SelectData;
}

interface SelectData {
    name: string;
    aliases: string[];
    description: string;
    permissions: DataPermissions;
}





/* [!]=========================================[!] */
/* [!]                 BUTTONS                 [!] */
/* [!]=========================================[!] */
interface Button {
    run: (SuperChan: Controller, interaction: ButtonInteraction) => any;
    data: ButtonData;
}

interface ButtonData {
    name: string;
    aliases: string[];
    description: string;
    permissions: DataPermissions;
}





/* [!]=========================================[!] */
/* [!]             SLASH COMMANDS              [!] */
/* [!]=========================================[!] */
interface Slash {
    run: (SuperChan: Controller, interaction: CommandInteraction) => any;
    data: SlashCommandBuilder;
}





/* [!]=========================================[!] */
/* [!]                  OTHERS                 [!] */
/* [!]=========================================[!] */
interface IgnoredInteractions {
    slashs: string[];
    selects: string[];
    buttons: string[];
    commands: string[];
}

interface DataPermissions {
    type: "GUILD_ROLE" | "GUILD_MEMBER" | "GUILD_PERMISSION";
    id?: string[];
    permissions?: PermissionString[];
}