import { CommandInteraction, MessageEmbed, ApplicationCommandPermissionData, MessageSelectOptionData, ThreadChannel, MessageActionRow, MessageSelectMenu } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import OTCO from "../../utils/functions/OrdinalToCardinal";
import { SelectMenuRole, SuperChanTypes } from "../../types/Client";
import Role from "../../database/models/menuRoles";
import emojis from "../../json/emojis.json";
import updateJson from "../../utils/functions/updateJsons";

exports.run = async (SuperChan: SuperChanTypes, interaction: CommandInteraction) => {

    if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("ADMINISTRATOR")) 
        return interaction.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true})

    await interaction.deferReply();

    try {

        const method = interaction.options.getSubcommand() as "adicionar" | "remover";

        switch (method) {
            case "adicionar": {
                const selectedMenu = interaction.options.getString('select-menu') as "colors" | "roles" | "project-normal" | "project-hentai";
                const actualMenuArray = selectedMenu === "colors" ? SuperChan.data.roles?.colors : selectedMenu === "roles" ? SuperChan.data.roles?.default : selectedMenu === "project-normal" ? SuperChan.data.roles?.projects.normal : SuperChan.data.roles?.projects.hentai;
                const data: SelectMenuRole = {
                    options: {
                        label: interaction.options.getString('title', true),
                        description: interaction.options.getString('description', true),
                        emoji: interaction.options.getString('emoji') ?? emojis.pin,
                        value: SuperChan.data.ordinal_options[(actualMenuArray?.length as number) + 1 ?? 0]
                    },
                    roleID: interaction.options.getRole('role')?.id ?? "",
                    SelectMenu: selectedMenu
                };
                await new Role(data).save();
                await actualMenuArray?.push(data);
                const embed = new MessageEmbed()
                    .setColor('#8348a5')
                    .setTitle(`${emojis.success} Sucesso!`)
                    .setDescription(`${emojis.info} O cargo foi adicionado com sucesso! Ele será implementado na próxima interação do SelectMenu.\n\n> ${data.options.emoji} \*\*${data.options.label}\*\*\n> ${data.options.description}\n\n${emojis.pin} \*\*Cargo:\*\* <@&${data.roleID}>`);

                await interaction.editReply({ embeds: [embed] });
                    
                break;
            }
            case "remover": {
                const selectedMenu = interaction.options.getString('select-menu') as "colors" | "roles" | "project-normal" | "project-hentai";
                const actualMenuArray = selectedMenu === "colors" ? SuperChan.data.roles?.colors : selectedMenu === "roles" ? SuperChan.data.roles?.default : selectedMenu === "project-normal" ? SuperChan.data.roles?.projects.normal : SuperChan.data.roles?.projects.hentai;

                const label = interaction.options.getString('title', true);
                const role = await Role.findOne({ where: { options: { label } } });

                console.log(role)

                if (!role) {
                    const possibleRoles = actualMenuArray?.filter(c => similarity(c.options.label, label) > 0.5) ?? [];

                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${emojis.error} Falha!`)
                        .setDescription(`${emojis.red} Desculpe, mas parece que não há nenhum cargo com o título \`${label}\`.\n\n${possibleRoles.length !== 0 ? `${emojis.pin} \*\*Possíveis cargos:\*\* \`${possibleRoles.map(m => { return m.options.label }).join('`, `')}\`` : "" }`);

                    return interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed] });
                } else {
                    await Role.findOneAndDelete({ where: { options: { label } } });
                    
                    const index = actualMenuArray.map(m => m.options.label).indexOf(label);
                    actualMenuArray.splice(index, 1);
                    const roles = actualMenuArray.map((m, i) => { return { roleID: m.roleID, SelectMenu: m.SelectMenu, options: { label: m.options.label, description: m.options.description, emoji: m.options.emoji, value: SuperChan.data.ordinal_options[i] } } })

                    selectedMenu === "colors" ? SuperChan.data.roles.colors = roles : selectedMenu === "roles" ? SuperChan.data.roles.default = roles : selectedMenu === "project-normal" ? SuperChan.data.roles.projects.normal = roles : SuperChan.data.roles.projects.hentai = roles;

                    const embed = new MessageEmbed()
                        .setColor('#8348a5')
                        .setTitle(`${emojis.success} Sucesso!`)
                        .setDescription(`${emojis.info} O cargo foi removido com sucesso!\n\n> ${role?.options.emoji} \*\*${role?.options.label}\*\*\n> ${role?.options.description}\n\n${emojis.pin} \*\*Cargo:\*\* <@&${role?.roleID}>`);

                    await interaction.editReply({ embeds: [embed] });
                }
                break;
            }
        }
    } catch (err) {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Falha!`)
        .setDescription(`${emojis.red} O cargo não foi removido ao menu, pois ocorreu um erro!\n\n\`\`\`js\n${err}\`\`\``);

        console.log(err)

        return interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed] });
    }
}

exports.permissions = [{
    type: "ROLE",
    permission: true,
    id: "831689414483640350"
}] as ApplicationCommandPermissionData[]

exports.data = new SlashCommandBuilder()
.setName('interaction-role')
.setDescription('Adicione um cargo nos menus de seleção')
.addSubcommand(command => command
    .setName('adicionar')
    .setDescription('Adicione um cargo nos menus de seleção')
    .addStringOption(string => string
        .setName('select-menu')
        .setDescription('Selecione qual SelectMenu vai receber o seguinte cargo.')
        .setRequired(true)
        .addChoices([["Cores", "colors"], ["Cargos", "roles"], ["Obras Normais", "project-normal"], ["Obras Hentai", "project-hentai"]])
    )
    .addRoleOption(role => role
        .setName('role')
        .setDescription('Selecione o cargo que será adicionado.')
        .setRequired(true)
    )
    .addStringOption(string => string
        .setName('title')
        .setDescription('Escreva o título do cargo.')
        .setRequired(true)
    )
    .addStringOption(string => string
        .setName('description')
        .setDescription('Escreva a descrição do cargo.')
        .setRequired(true)
    )
    .addStringOption(string => string
        .setName('emoji')
        .setDescription('Escreva o emoji do cargo. O padrão é '+ emojis.pin)
    )
)
.addSubcommand(command => command
    .setName('remover')
    .setDescription('Remova um cargo nos menus de seleção')
    .addStringOption(string => string
        .setName('select-menu')
        .setDescription('Selecione de qual SelectMenu vai ser retirado o seguinte cargo.')
        .setRequired(true)
        .addChoices([["Cores", "colors"], ["Cargos", "roles"], ["Obras Normais", "project-normal"], ["Obras Hentai", "project-hentai"]])
    )
    .addStringOption(string => string
        .setName('title')
        .setDescription('Digite aqui qual é o título da opção que deseja remover.')
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