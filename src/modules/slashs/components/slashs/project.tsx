import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChan } from "../../../../@types/SuperChan";
import { CommandInteraction, Interaction, MessageEmbed } from "discord.js";
import Model from "../../../../database/types/ProjectsRoles";
import ProjectRoles from "../../../../database/models/ProjectsRoles";
import emojis from "../../../../json/emojis.json";

exports.run = async (Client: SuperChan, i: CommandInteraction) => {
    await i.deferReply();

    try {

        const data: Model = {
            roleId: i.options.getRole("cargo", true).id,
            title: i.options.getString("título", true),
            description: i.options.getString("descrição", true),
            cover: i.options.getString("imagem", true),
            type: i.options.getString("tipo", true) as "normal" | "hentai",
            tsuki: i.options.getString("tsuki") ? i.options.getString("tsuki", true) : undefined,
            ml: i.options.getString("ml") ? i.options.getString("ml", true) : undefined,
            other: i.options.getString("outros") ? i.options.getString("outros", true) : undefined
        }

        await new ProjectRoles(data).save();

        const embed = new MessageEmbed()
            .setColor("#8348a5")
            .setDescription(`${emojis.success} Pronto! Obra adicionada com sucesso!\n\n:newspaper: **• ${data.title}**\n\`\`\`\n${data.description}\n\`\`\`\n\n${data.tsuki ? `<:Tsuki:915862034359406592> **• [Tsuki](${data.tsuki})**` : ``}\n${data.ml ? `<:mangalivre:915862598019321867> **• [MangaLivre](${data.ml})**` : ``}\n${data.other ? `<:mangadex:934304370705702912> **• [Mangadex](${data.other})**` : ``}`)
            .setImage(data.cover);

        await i.editReply({ embeds: [embed] });

    } catch (err) {
        i.editReply(`\`\`\`js\n${err}\n\`\`\``)
    }
}

exports.data = new SlashCommandBuilder()
    .setName('project')
    .setDescription('Manuseie os projetos disponíveis para cargo')
    .addSubcommand(command => command
        .setName('add')
        .setDescription('Adiciona um projeto')
        .addRoleOption(role => role
            .setName('cargo')
            .setDescription('Cargo que receberá o projeto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('título')
            .setDescription('Título do projeto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('descrição')
            .setDescription('Descrição do projeto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('imagem')
            .setDescription('URL da imagem do projeto')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('tipo')
            .setDescription('Tipo do projeto')
            .setRequired(true)
            .addChoice('Normal', 'normal')
            .addChoice('Hentai', 'hentai')
        )
        .addStringOption(option => option
            .setName('tsuki')
            .setDescription('URL do projeto (Tsuki)')
        )
        .addStringOption(option => option
            .setName('ml')
            .setDescription('URL do projeto (ML)')
        )
        .addStringOption(option => option
            .setName('outro')
            .setDescription('URL do projeto (Outro)')
        )
    )