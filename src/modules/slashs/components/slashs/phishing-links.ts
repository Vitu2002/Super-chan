import { CommandInteraction, MessageEmbed, ButtonInteraction, Message, MessageActionRow, MessageButton, User } from "discord.js";
import Link from "../../../../database/models/BannedLinks";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";
import BannedLinksSchema from "../../../../database/types/BannedLinks";
import BannedLinks from "../../../../database/models/BannedLinks";
import { UpdateLinks } from "../../../anti-phishing/core";

exports.run = async (Client: SuperChan, i: CommandInteraction) => {

    if (!i.guild?.members.cache.get(i.user.id)?.permissions.has("ADMINISTRATOR")) 
        return i.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true})

    const msg = await i.deferReply({ fetchReply: true });

    try {

        const method = i.options.getString("função", true) as "add" | "rem" | "ver";

        switch (method) {
            case "add": {
                const link = i.options.getString("link");

                if (!link) return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Você deve inserir um \`link\` para executar esta função.`)]})

                if (!link.toLowerCase().startsWith("https://" || "http://"))
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Você deve inserir um link que comesse com \`https://\` ou \`http://\`.`)] });

                const url = new URL(link);

                if (!url)
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** O link inserido é inválido.`)] });

                const LinkDB = await BannedLinks.findOne({ link: url.hostname });

                if (LinkDB)
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Este link já existe no banco de dados.`)] });
                
                await new BannedLinks({ link: url.hostname, date: (Date.now() / 1000), staff: i.user.id }).save();
                await UpdateLinks();
                await i.editReply({ embeds: [new MessageEmbed().setColor("#8348a5").setTitle(`${emojis.success} Sucesso!`).setDescription(`${emojis.info} Link adicionado com sucesso!\n\n${emojis.pin} \*\*Link:\*\* ${link}`)] });

                break;
            }
            case "rem": {
                const link = i.options.getString("link");

                if (!link) return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Você deve inserir um \`link\` para executar esta função.`)]})

                if (!link.toLowerCase().startsWith("https://" || "http://"))
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Você deve inserir um link que comesse com \`https://\` ou \`http://\`.`)] });

                const url = new URL(link);

                if (!url)
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** O link inserido é inválido.`)] });

                const LinkDB = await BannedLinks.findOne({ link: url.hostname });

                if (!LinkDB)
                    return i.editReply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`**${emojis.error} Ops!** Este link não existe no banco de dados.`)] });
                
                await LinkDB.delete();
                await UpdateLinks();
                await i.editReply({ embeds: [new MessageEmbed().setColor("#8348a5").setTitle(`${emojis.success} Sucesso!`).setDescription(`${emojis.info} Link removido!\n\n${emojis.pin} \*\*Link:\*\* ${link}`)] });

                break;
            }
            case "ver": {
                const row = new MessageActionRow().addComponents(new MessageButton().setCustomId("phishing-links-prev").setLabel("Anterior").setStyle("PRIMARY"), new MessageButton().setCustomId("phishing-links-next").setLabel("Próximo").setStyle("PRIMARY"));
                const links = Client.data.phishingLinks;
                let index = 0;


                await i.editReply({ content: `<@!${i.user.id}>`, embeds: [viewEmbed(links, index, i.user)], components: [row] });
                const collector = (msg as Message).createMessageComponentCollector({ componentType: "BUTTON", filter: (f: ButtonInteraction) => { return f.user.id === i.user.id }, time: 600000 });

                collector.on("collect", async (f: ButtonInteraction) => {
                    f.reply(emojis.loading)
                    switch (f.customId) {
                        case "phishing-links-prev": {
                            if (index > 0) {
                                index--;
                            } else {
                                index = Math.floor(links.length / 10);
                            }

                            await i.editReply({ embeds: [viewEmbed(links, index, i.user)] });
                            await f.deleteReply();
                            break;
                        }
                        case "phishing-links-next": {
                            if (index < Math.floor(links.length / 10)) {
                                index++;
                            } else {
                                index = 0;
                            }

                            await i.editReply({ embeds: [viewEmbed(links, index, i.user)] });
                            await f.deleteReply();
                            break;
                        }
                    }
                });
                break;
            }
        }
    } catch (err) {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Falha!`)
        .setDescription(`${emojis.red} Ops! ocorreu um erro!\n\n\`\`\`js\n${err}\`\`\``);

        console.log(err)

        return i.editReply({ content: `<@!${i.user.id}>`, embeds: [embed] });
    }
}

exports.data = new SlashCommandBuilder()
.setName('phishing-links')
.setDescription('Adicione ou remova um link de phishing para o bot.')
.addStringOption(string =>  string
    .setName("função")
    .setDescription("Qual função deve ser executada?")
    .setRequired(true)
    .addChoice("adicionar", "add")
    .addChoice("remover", "rem")
    .addChoice("listar", "ver")
)
.addStringOption(string => string
    .setName("link")
    .setDescription("Qual link deve ser adicionado/removido da database?")
)


function viewEmbed(data: BannedLinksSchema[], index: number, user: User) {
    const current = data[index];

    return new MessageEmbed().setColor("#8348a5").setFooter(`Página [${index + 1}] de [${data.length}]`).setTitle(`${emojis.search} Links Banidos`).setDescription(`${emojis.info} \*\*Link:\*\* \`https://${current.link}/\`\n${emojis.user_card} \*\*Adicionado por:\*\* <@!${current.staff}>\n${emojis.timer} \*\*Adicionado:\*\* <t:${current.date}:R>`).setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }));
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