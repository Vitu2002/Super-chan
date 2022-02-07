import { Message, MessageEmbed, ThreadChannel } from "discord.js";
import { SuperChan } from "../../../@types/SuperChan";
import emojis from "../../../json/emojis.json";
import moment from "moment";
moment.locale("pt-br");

export default async function hasBannedLinks(Client: SuperChan, message: Message) {
    const bannedLinks = Client.data.phishingLinks;
    const texts = message.content.toLowerCase().replace(/\n/g, " ").split(" ");
  
    texts.forEach(async text => {
      if (!text.startsWith('https://' || 'http://')) return;
      const url = new URL(text);
      console.log(bannedLinks)
      if (bannedLinks.map(m => m.link).includes(url.hostname)) {
        message.delete();
  
        const embedU = new MessageEmbed().setColor("#ff0000").setAuthor(`${message.guild?.name}`, `${message.guild?.iconURL()}`, "https://superscans.site").setTitle(`${emojis.error} Ops!`).setDescription(`${emojis.info} Ops, Você foi expulso do nosso servidor!\n${emojis.red} Parece que a sua conta foi hackeada (ou foi intensionalmente) e foi pego pelo nosso sistema propagando vírus malíciosos.\n\n${emojis.pin} Caso você recupere a sua conta, e queira voltar ao nosso servidor, basta [clicar aqui](https://discord.gg/WjFHddvUQs).`).addField(`${emojis.black} Link malicioso:`, `\`\`\`diff\n- ${text}\`\`\``).addField(`${emojis.file} Mensagem:`, `\`\`\`\n${message.content}\`\`\``).setFooter("Atenciosamente, Super-chan", Client.user?.displayAvatarURL()).setTimestamp();
        const embedS = new MessageEmbed().setColor("#ff0000").setTitle(`${emojis.info} Membro expulso!`).setDescription(`${emojis.user_card} \*\*Membro\*\*: \`${message.author.tag} - ${message.author.id}\`\n${emojis.timer} \*\*Entrou no servidor em:\*\* <t:${Number(moment(message.member?.joinedAt).format('X')).toFixed()}:D>`).addField(`${emojis.black} Link malicioso:`, `\`\`\`diff\n- ${text}\`\`\``).addField(`${emojis.file} Mensagem:`, `\`\`\`\n${message.content}\`\`\``).setThumbnail(message.author.displayAvatarURL());
                
  
        message.author.send({ embeds: [embedU] }).catch(() => {});
  
        if (message.member?.kickable) {
          message.member.kick("Link malicioso: " + text).catch(() => {});
        }
  
        (message.guild?.channels.cache.get("901250905247191070") as ThreadChannel).send({ content: message.member?.kickable ? `${emojis.success} Membro expulso com sucesso!` : `${emojis.error} Não foi possível expulsar o membro!`, embeds: [embedS] }).catch(() => {});
      }
    })
  }