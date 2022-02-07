import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, Client, ClientOptions, Collection, CommandInteraction, Message, MessageSelectOptionData, PermissionFlags, Permissions, PermissionString, SelectMenuInteraction } from "discord.js";
import BannedLinks from "../database/types/BannedLinks";
import MenuRoles from "../database/types/MenuRoles";

const options: ClientOptions = {
    intents: ["GUILDS","GUILD_INVITES","GUILD_MEMBERS","GUILD_MESSAGES","GUILD_PRESENCES"]
};

export class SuperChan extends Client {
    interactions: Interactions;
    data: DatabaseData;

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
        this.data = {
            phishingLinks: [],
            menuRoles: []
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
    run: (SuperChan: SuperChan, message: Message, args: string[]) => any;
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
    run: (SuperChan: SuperChan, interaction: SelectMenuInteraction) => any;
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
    run: (SuperChan: SuperChan, interaction: ButtonInteraction) => any;
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
    run: (SuperChan: SuperChan, interaction: CommandInteraction) => any;
    data: SlashCommandBuilder;
}





/* [!]=========================================[!] */
/* [!]                 DATABASE                [!] */
/* [!]=========================================[!] */
interface DatabaseData {
    phishingLinks: BannedLinks[];
    menuRoles: MenuRoles[];
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