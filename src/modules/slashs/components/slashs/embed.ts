import { CommandInteraction, MessageEmbed, ThreadChannel } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChan } from "../../../../@types/SuperChan";

exports.run = async (SuperChan: SuperChan, interaction: CommandInteraction) => {

    await interaction.deferReply();

    if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("ADMINISTRATOR")) return interaction.deleteReply();
    
    const options = {
        channel: interaction.options.getChannel("canal", true),
        author: {
            name: interaction.options.getString("author-name"),
            iconURL: interaction.options.getString("author-image") ?? undefined,
            url: interaction.options.getString("author-url") ?? undefined
        },
        titleText: interaction.options.getString("title-text"),
        titleURL: interaction.options.getString("title-url"),
        descriptionText: interaction.options.getString("description-text"),
        thumbnail: interaction.options.getString("thumbnail"),
        image: interaction.options.getString("image"),
        footer: {
            name: interaction.options.getString("footer-name"),
            iconURL: interaction.options.getString("footer-image") ?? undefined,
        },
        color: interaction.options.getString("cor"),
        timestamp: interaction.options.getNumber("timestamp")
    }
    
    const embed = new MessageEmbed();

    if (options.author.name) embed.setAuthor(options.author.name, options.author.iconURL, options.author.url);

    if (options.titleText) {
        embed.setTitle(options.titleText);

        if (options.titleURL) embed.setURL(options.titleURL);
    };

    if (options.descriptionText) embed.setDescription(options.descriptionText);
    else embed.setDescription("\u200B");

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);

    if (options.image) embed.setImage(options.image);

    if (options.footer.name) embed.setFooter(options.footer.name, options.footer.iconURL)

    if (options.color) embed.setColor(options.color as any);

    if (options.timestamp) {
        if (options.timestamp === 0) embed.setTimestamp();
        else embed.setTimestamp(options.timestamp)
    }

    const msg = await (options.channel as ThreadChannel).send({ embeds: [embed ]});

    await interaction.editReply({ content: `> **Embed enviada!**\n\n> ${msg.url}` })
}

exports.data = new SlashCommandBuilder()
.setName('embed')
.setDescription('Crie uma embed personalizada e envie no canal selecionado')
.addChannelOption(channel => channel.setName('canal').setDescription('Em qual canal ser?? enviado a embed?').setRequired(true))
.addStringOption(string => string.setName("author-name").setDescription("Texto pequeno para o author"))
.addStringOption(string => string.setName("author-image").setDescription("URL de imagem do author"))
.addStringOption(string => string.setName("author-url").setDescription("URL do author"))
.addStringOption(string => string.setName("title-text").setDescription("Texto pequeno para o t??tulo"))
.addStringOption(string => string.setName("title-url").setDescription("URL do t??tulo"))
.addStringOption(string => string.setName("description-text").setDescription("Texto de at?? 2000 caracteres para a descri????o"))
.addStringOption(string => string.setName("thumbnail").setDescription("URL de uma imagem para a thumbnail"))
.addStringOption(string => string.setName("imagem").setDescription("URL de uma imagem para a image"))
.addStringOption(string => string.setName("footer-name").setDescription("Texto pequeno para o footer"))
.addStringOption(string => string.setName("footer-image").setDescription("URL de imagem do footer"))
.addStringOption(string => string.setName("cor").setDescription("Cor da embed em c??digo hex"))
.addNumberOption(string => string.setName("timestamp").setDescription("Timestamp (0 para hora atual)"))