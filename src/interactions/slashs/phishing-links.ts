import { CommandInteraction, MessageEmbed, ApplicationCommandPermissionData, ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SelectMenuRole, SuperChanTypes } from "../../types/Client";
import Link from "../../database/models/BannedLinks";
import emojis from "../../json/emojis.json";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {

    if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("ADMINISTRATOR")) 
        return interaction.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true})

    const msg = await interaction.deferReply({ fetchReply: true });

    try {

        const method = interaction.options.getSubcommand() as "adicionar" | "remover" | "ver";

        switch (method) {
            case "adicionar": {
                const link = interaction.options.getString("link", true);

                if (!link.toLowerCase().startsWith("https://"))
                    return interaction.editReply({ content: `${emojis.error} Link inválido! \`Tente iniciá-lo com https://\`` });

                const url = new URL(link);

                if (!url)
                    return interaction.editReply({ content: `${emojis.error} Link inválido!` });

                if (SuperChan.data.bannedLinks.map(m => m.link).includes(url.hostname))
                    return interaction.editReply({ content: `${emojis.error} Este link já foi adicionado!` });
                
                const data = { link: url.hostname, staff: interaction.user.id, date: Number(Number((Date.now()) / 1000).toFixed()) }
                await SuperChan.data.bannedLinks.push(data);
                await new Link(data).save();

                const embed = new MessageEmbed()
                .setColor("#8348a5")
                .setTitle(`${emojis.success} Sucesso!`)
                .setDescription(`${emojis.info} Link adicionado como phishing!\n\n${emojis.pin} \*\*Link:\*\* ${link}`)

                await interaction.editReply({ embeds: [embed] });

                break;
            }
            case "remover": {
                const link = interaction.options.getString("link", true);

                if (!link.toLowerCase().startsWith("https://"))
                    return interaction.editReply({ content: `${emojis.error} Link inválido! \`Tente iniciá-lo com https://\`` });

                const url = new URL(link);

                if (!url)
                    return interaction.editReply({ content: `${emojis.error} Link inválido!` });

                if (!SuperChan.data.bannedLinks.map(m => m.link).includes(url.hostname))
                    return interaction.editReply({ content: `${emojis.error} Este link não existe no banco de dados!` });
                
                await Link.findOneAndDelete({ link: url.hostname });
                SuperChan.data.bannedLinks.splice(SuperChan.data.bannedLinks.map(m => m.link).indexOf(url.hostname), 1);

                const embed = new MessageEmbed()
                .setColor("#8348a5")
                .setTitle(`${emojis.success} Sucesso!`)
                .setDescription(`${emojis.info} Link removido!\n\n${emojis.pin} \*\*Link:\*\* ${link}`)

                await interaction.editReply({ embeds: [embed] });

                break;
            }
            case "ver": {
                const links = SuperChan.data.bannedLinks;
                let index = 0;
                let currentFirstIndex = 0;

                console.log(links)

                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setCustomId("phishing-links-prev")
                    .setLabel("Anterior")
                    .setStyle("PRIMARY"),

                    new MessageButton()
                    .setCustomId("phishing-links-next")
                    .setLabel("Próximo")
                    .setStyle("PRIMARY")
                );

                await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [await embed(links.slice(currentFirstIndex, (currentFirstIndex + 9)))], components: [row] });
                const collector = await (msg as Message).createMessageComponentCollector({ componentType: "BUTTON", filter: (f: ButtonInteraction) => { return f.user.id === interaction.user.id }, time: 600000 });

                collector.on("collect", async (f: ButtonInteraction) => {
                    f.reply(emojis.loading)
                    switch (f.customId) {
                        case "phishing-links-prev": {
                            if (index > 0) {
                                index--;
                                currentFirstIndex = Number(index + "0");
                            } else {
                                index = Math.floor(links.length / 10);
                                currentFirstIndex = Number(index + "9");
                            }
                            console.log(links.slice(currentFirstIndex, currentFirstIndex + 9))
                            await interaction.editReply({ embeds: [await embed(links.slice(Number(index + "0") * index, Number(index + "9") * index))] })
                            await f.deleteReply();
                            break;
                        }
                        case "phishing-links-next": {
                            if (index < Math.floor(links.length / 10)) {
                                index++;
                                currentFirstIndex = Number(index + "0");
                            } else {
                                index = 0;
                                currentFirstIndex = Number(index + "9");
                            }

                            console.log(links.slice(currentFirstIndex, currentFirstIndex + 9))
                            await interaction.editReply({ embeds: [await embed(links.slice(Number(index + "0") * index, Number(index + "9") * index))] })
                            await f.deleteReply();
                            break;
                        }
                    }
                })

                async function embed(links: { link: string, staff: string, date: number }[]): Promise<MessageEmbed> {
                    const embed = new MessageEmbed()
                    .setColor("#8348a5")
                    .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }), "https://superscans.site")
                    .setTitle(`${emojis.search} Links Banidos`)
                    .setDescription(links.map(m => `${emojis.info} \*\*Link:\*\* \`https://${m.link}/\`\n${emojis.user_card} \*\*Adicionado por:\*\* <@!${m.staff}>\n${emojis.timer} \*\*Adicionado:\*\* <t:${m.date}:R>`).join("\n\n"))
                    .setFooter(`Página ${index + 1} de ${Math.floor(SuperChan.data.bannedLinks.length / 10) + 1}`);

                    return embed;
                }
                break;
            }
        }
    } catch (err) {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Falha!`)
        .setDescription(`${emojis.red} Ops! ocorreu um erro!\n\n\`\`\`js\n${err}\`\`\``);

        console.log(err)

        return interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed] });
    }
}

exports.data = new SlashCommandBuilder()
.setName('phishing-links')
.setDescription('Adicione ou remova um link de phishing para o bot.')
.addSubcommand(command => command
    .setName('adicionar')
    .setDescription('Adicione um link no banco de dados.')
    .addStringOption(string => string
        .setName('link')
        .setDescription('Digite o link que deseja adicionar.')
        .setRequired(true)
    )
)
.addSubcommand(command => command
    .setName('ver')
    .setDescription('Ver os links de phishing.')
)
.addSubcommand(command => command
    .setName('remover')
    .setDescription('Remova um cargo nos menus de seleção')
    .addStringOption(string => string
        .setName('link')
        .setDescription('Digite o link que deseja remover.')
        .setRequired(true)
    )
)





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