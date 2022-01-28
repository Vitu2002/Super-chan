import { Message, MessageEmbed, ThreadChannel } from "discord.js";
import { blue, gray, white, cyan, yellow, green } from "colors";
import { SuperChanTypes } from "../types/Client";
import emojis from "../json/emojis.json";
import moment from "moment";
moment.locale('pt-BR');

module.exports = async (client: SuperChanTypes, message: Message) => {
  
    // se o author da msg for um bot
    if (message.author.bot) return;

    // verificando por links maliciosos
    hasBannedLinks(client, message);
  
    // se a mensagem não iniciar com o prefixo
    if (message.content.indexOf(process.env.PREFIX as string) !== 0) return;
  
    // pegando o conteudo da mensagem
    const args = message.content.slice((process.env.PREFIX as string).length).trim().split(/ +/g);
  
    // pegando o comando
    const command = args.shift()?.toLowerCase();
  
    // verificando comando
    const cmd = client.interactions.commands.get(command as string);
    
    // se não existir o comando, retorna mensagem de erro
    if (!cmd) {
      const possibleCommands = client.interactions.commands.filter(c => similarity(c.data.name, command as string) > 0.5);
      const embed = new MessageEmbed()
      .setColor("#ff0000")
      .setAuthor(message.author.tag, message.author.displayAvatarURL(), "https://superscans.site")
      .setTitle(`${emojis.error} ERROR 404!`)
      .setDescription(`${emojis.info} \*\*O comando \`${command}\` não existe!\*\*${possibleCommands.size > 0 ? `${emojis.pin} Você quis dizer... \`${possibleCommands.map(d => d).join("`, `")}\`?` : `` }`)

      return await message.channel.send({ embeds: [embed] });
    }
  
    (message.guild?.channels.cache.get('878056378520989736') as ThreadChannel).send(`\*\*[LOG]\*\* O membro \`${message.author.tag} - ${message.author.id}\` utilizou o comando \`${cmd.data.name}\` no canal <#${message.channelId}>`)
    console.log(blue('[LOG]') + gray(`${moment().format(' DD/MM/YY [ás] HH:mm:ss ')}`) + white(`O membro ${cyan(`${message.author.tag} - ${message.author.id}`)} utilizou o ` + yellow('comando ') + green(`'${cmd.data.name}'`)))
  
    cmd.run(client, message, args);
};

function hasBannedLinks(client: SuperChanTypes, message: Message) {
  const bannedLinks = client.data.bannedLinks;
  const texts = message.content.toLowerCase().replace(/\n/g, " ").split(" ");

  texts.forEach(async text => {
    if (!text.startsWith('https://' || 'http://')) return;

    const url = new URL(text);
    if (bannedLinks.map(m => m.link).includes(url.hostname)) {
      message.delete();

      const embedU = new MessageEmbed()
          .setColor("#ff0000")
          .setAuthor(`${message.guild?.name}`, `${message.guild?.iconURL()}`, "https://superscans.site")
          .setTitle(`${emojis.error} Ops!`)
          .setDescription(`${emojis.info} Ops, Você foi expulso do nosso servidor!\n${emojis.red} Parece que a sua conta foi hackeada (ou foi intensionalmente) e foi pego pelo nosso sistema propagando vírus malíciosos.\n\n${emojis.pin} Caso você recupere a sua conta, e queira voltar ao nosso servidor, basta [clicar aqui](https://discord.gg/WjFHddvUQs).`)
          .addField(`${emojis.black} Link malicioso:`, `\`\`\`diff\n- ${text}\`\`\``)
          .addField(`${emojis.file} Mensagem:`, `\`\`\`\n${message.content}\`\`\``)
          .setFooter("Atenciosamente, Super-chan", client.user?.displayAvatarURL())
          .setTimestamp();

      const embedS = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`${emojis.info} Membro expulso!`)
          .setDescription(`${emojis.user_card} \*\*Membro\*\*: \`${message.author.tag} - ${message.author.id}\`\n${emojis.timer} \*\*Entrou no servidor em:\*\* <t:${Number(moment(message.member?.joinedAt).format('X')).toFixed()}:D>`)
          .addField(`${emojis.black} Link malicioso:`, `\`\`\`diff\n- ${text}\`\`\``)
          .addField(`${emojis.file} Mensagem:`, `\`\`\`\n${message.content}\`\`\``)
          .setThumbnail(message.author.displayAvatarURL());
              

      message.author.send({ embeds: [embedU] }).catch(() => {});

      if (message.member?.kickable) {
        message.member.kick("Link malicioso: " + text).catch(() => {});
      }

      (message.guild?.channels.cache.get("901250905247191070") as ThreadChannel).send({ content: message.member?.kickable ? `${emojis.success} Membro expulso com sucesso!` : `${emojis.error} Não foi possível expulsar o membro!`, embeds: [embedS] }).catch(() => {});
    }
  })
}

function similarity(s1: string, s2: string) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(`${longerLength}`);
}

function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}