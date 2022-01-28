import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js"
import { SuperChanTypes } from "../../types/Client"
import emojis from "../../json/emojis.json";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {
    
    if (interaction.user.id !== "293913134748401674") 
        return interaction.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true})

    const embed = new MessageEmbed()
    .setDescription("> <:sE_Lists:936711033286979614> • **Regras**  do canal <#936716998426107924>\n> Diferentes das regras **primordiais** do servidor, esse canal se trata de um conteúdo mais sensível, e potencialmente **nocivo** se não for bem observado e moderado, tenha ciência de que você está em uma comunidade, com pessoas diferentes, o **ódio generalizado** será **punido** severamente, não propague ódio para com as pessoas que você considera diferente, até mesmo o óbvio, seja **preconceito**, **discriminação de raça**, **cor**, **origem**, **orientação sexual** ou até mesmo **classe social**, não divulgue mídias que façam referência a **genocídio** ou **extremismo**, tenha consciência de que esse é um lugar **público**, e todos nós só queremos o bem de todos aqui presentes, ao quebrar essas regras você está infligindo nossos termos e os termos do **__Discord__**, e consequentemente prejudicando nossa reputação, para relatar **denúncias**, utilize o <#833559000125276210>")
    .setColor("#8348a5")

    interaction.channel?.send({ embeds: [embed] })
}

exports.data = new SlashCommandBuilder()
.setName('devn')
.setDescription('Teste')