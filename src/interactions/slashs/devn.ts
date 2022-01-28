import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js"
import { SuperChanTypes } from "../../types/Client"
import emojis from "../../json/emojis.json";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
    
    if (interaction.user.id !== "293913134748401674") 
        return interaction.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true})

    const embed = new MessageEmbed()
    .setColor('#8348a5')
    .setAuthor('SuperScans - Obras em lançamento', `${interaction.guild?.iconURL({ dynamic: true })}`, 'https://superscans.site')
    .setDescription(`${emojis.pin} \*\*Gostaria de ser notificado sempre que um novo capítulo da sua obra preferida estiver disponível? Basta selecionar abaixo sobre quais obras você gostaria de ser notificado.\*\*\n\n${emojis.info} \*\*Como usar?\*\*\n${emojis.pin} As obras são caracterizadas como \`Adultas\` (Manhwa Ero, Doujinshi e etc) e \`Normais\` (Manhwa, Mangá, Manhua, Webtoon e etc). Basta clicar na seção desejada e escolher qual obra você deseja pegar.`)
    .setThumbnail("https://cdn.discordapp.com/attachments/879139551984099408/919211855614980176/20211211_095722.png")

    const row1 = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('roles-projects-hentai')
        .setPlaceholder('Notificações de obras adultas (+18)')
        .setOptions({label: "Em Desenvolvimento", value: "first-option", description: "Em breve..."})
    )

    const row2 = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('roles-projects-normal')
        .setPlaceholder('Notificações de obras normais (-18)')
        .setOptions({label: "Em Desenvolvimento", value: "first-option", description: "Em breve..."})
    )

    interaction.channel?.send({ content: `${emojis.timer} \*\*Última interação:\*\* <t:${(Date.now() / 1000).toFixed()}:R>`, components: [row1, row2], embeds: [embed] })
}

exports.data = new SlashCommandBuilder()
.setName('devn')
.setDescription('Teste')