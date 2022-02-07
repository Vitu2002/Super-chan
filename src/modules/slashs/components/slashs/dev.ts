import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChan } from "../../../../@types/SuperChan";
import { CommandInteraction, Interaction } from "discord.js";
import Model from "../../../../database/models/menuRoles";
import MenuRoles from "../../../../database/models/MenuRoles";

exports.run = async (Client: SuperChan, i: CommandInteraction) => {
    i.deferReply({ ephemeral: true });

    try {

        const old = await Model.find();
        
        i.editReply(`Carregando ${old.length} dados...`)

        old.forEach(async (o, index) => {
            i.editReply(`Carregado \`[${index + 1}/${o.length}]\``)
            await new MenuRoles({
                id: o.SelectMenu,
                roleId: o.roleID,
                label: o.options.label,
                description: o.options.description,
                emoji: o.options.emoji
            }).save();
        })
        
        await i.editReply("Dev")
        
    } catch (err) {
        i.editReply(`\`\`\`js\n${err}\n\`\`\``)
    }
}

exports.data = new SlashCommandBuilder()
.setName('dev')
.setDescription('Development')