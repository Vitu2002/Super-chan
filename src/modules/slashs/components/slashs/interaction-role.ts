import { CommandInteraction, MessageEmbed, ApplicationCommandPermissionData, User } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";
import MenuRolesSchema from "../../../../database/types/MenuRoles";
import MenuRoles from "../../../../database/models/MenuRoles";
import { UpdateMenuRoles } from "../../../roles/core/index"

exports.run = async (SuperChan: SuperChan, interaction: CommandInteraction) => {

  if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("ADMINISTRATOR"))
    return interaction.reply({ content: `${emojis.error} Você não tem permissão para usar isso!`, ephemeral: true })

  await interaction.deferReply();

  try {

    const data = await new MenuRoles({
      roleId: interaction.options.getRole("role", true).id,
      label: interaction.options.getString("title", true),
      id: interaction.options.getString("select-menu", true),
      description: interaction.options.getString("description"),
      emoji: interaction.options.getString("emoji")
    }).save();

    await UpdateMenuRoles()

    interaction.editReply({ content: `${emojis.success} Cargo adicionado com sucesso!` });

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
    )
    .addStringOption(string => string
      .setName('emoji')
      .setDescription('Escreva o emoji do cargo. O padrão é ' + emojis.pin)
    )
  )



function viewEmbed(data: MenuRolesSchema[], index: number, user: User, select: string) {
  const current = data[index];

  return new MessageEmbed().setColor("#8348a5").setTitle(`${emojis.search} Cargos \`${current.id}\``).setDescription(`${emojis.user_card} \*\*Cargo\*\*: <@&${current.roleId}>\n\n> ${current.emoji ? `${current.emoji}` : `${emojis.pin}`} **\`${current.label}\`**\n> \`${current.description}\``).setFooter(`Página [${index + 1}] de [${data.length}]`).setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }));
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