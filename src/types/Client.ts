import { Client, Collection, ClientOptions, Message, Interaction, CommandInteraction, ButtonInteraction, SelectMenuInteraction, MessageSelectOptionData } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders"
import CreateLogError from "../utils/functions/createLogError";

const options: ClientOptions = {
    intents: [
        "GUILDS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_PRESENCES"
    ]
};

interface SelectRoles {
    customID: string;
    roleID: string,
    emojiID: string,
    title: string,
    description: string
}

export class SuperChanTypes extends Client {
    interactions: Interactions;
    data: Data;

    selectMenus: Menu[] = [];
    selectRoles: SelectRoles[] = [];
    createLogError = CreateLogError;
    
    constructor() {
        super(options);
        this.interactions = {
            commands: new Collection(),
            slashs: new Collection(),
            buttons: new Collection(),
            selectMenus: new Collection(),
            errors: []
        };
        this.data = {
            tipIndex: 0,
            bannedLinks: [],
            ordinal_options: ["first_option", "second_option", "third_option", "fourth_option", "fifth_option", "sixth_option", "seventh_option", "eighth_option", "ninth_option", "tenth_option", "eleventh_option", "twelfth_option", "thirteenth_option", "fourteenth_option", "fifteenth_option", "sixteenth_option", "seventeenth_option", "eighteenth_option", "nineteenth_option", "twentieth_option", "twenty_first_option", "twenty_second_option", "twenty_third_option", "twenty_fourth_option", "twenty_fifth_option"],
            roles: {
                default: [],
                colors: [],
                projects: {
                    normal: [],
                    hentai: [],
                }
            }
        }
    }
}

interface Data {
    tipIndex: number;
    bannedLinks: {
        link: string;
        staff: string;
        date: number;
    }[];
    ordinal_options: string[];
    roles: {
        default: SelectMenuRole[];
        colors: SelectMenuRole[];
        projects: {
            normal: SelectMenuRole[];
            hentai: SelectMenuRole[];
        }
    };
}

export interface SelectMenuRole {
    options: MessageSelectOptionData;
    roleID: string;
    SelectMenu: "project-hentai" | "project-normal" | "colors" | "roles";
}

interface Interactions {
    commands: Collection<string, Command>;
    slashs: Collection<string, Slash>;
    buttons: Collection<string, Button>;
    selectMenus: Collection<string, Menu>;
    errors: ErrorInteraction[];
}

interface ErrorInteraction {
    file: string;
    error: unknown;
    type: "command" | "slash" | "button" | "selectMenu" | "event";
}

interface Command {
    data: {
        name: string;
        description: string;
        aliases: string[];
    };
    run: (client: SuperChanTypes, message: Message, args: string[]) => any;
}

interface Slash {
    run: (client: SuperChanTypes, interation: CommandInteraction) => any;
    data: SlashCommandBuilder;
}

interface Button {
    run: (client: SuperChanTypes, interaction: ButtonInteraction) => any;
    data: {
        customId: string;
    }
}

interface Menu {
    run: (client: SuperChanTypes, interaction: SelectMenuInteraction) => any;
    data: {
        customId: string;
    }
}