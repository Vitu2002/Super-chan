import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, Message } from "discord.js";
import { SuperChanTypes } from "../../types/Client";
import emojis from "../../json/emojis.json";

exports.run = async (SuperChan: SuperChanTypes, interaction: SelectMenuInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    try {
        const options = SuperChan.data.roles.default.map(c => c.options);
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const index = SuperChan.data.ordinal_options.indexOf(interaction.values[0]) - 1;
        const role = interaction.guild?.roles.cache.get(SuperChan.data.roles.default[index].roleID);
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("roles-default").setPlaceholder("Selecione o cargo desejado.").setOptions(options));
        let method: "add" | "remove" = "add";

        await (interaction.message as Message).edit({ content: `${emojis.timer} \*\*Última interação:\*\* <t:${Number((Date.now()) / 1000).toFixed()}:R>`, components: [row] });

        if (!role) {
            await interaction.editReply({ embeds: [new MessageEmbed().setColor("RED").setTitle(`${emojis.error} Falha!`).setDescription(`${emojis.info} Parece que o cargo que você selecionou não existe mais no servidor, informe aos administradores sobre o ocorrido.`)] });
            return;
        }

        if (member?.roles.cache.has(role?.id)) {
            method = "remove";
            await member?.roles.remove(role);
        } else {
            await member?.roles.add(role);
        }

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setTitle(`${emojis.success} Sucesso!`)
        .setDescription(`${emojis.pin} Pronto! O cargo <@&${role?.id}> foi ${method === "add" ? "adicionado" : "removido" } com sucesso!`)
        .setFooter(`${interaction.guild?.name}`, interaction.guild?.iconURL({ dynamic: true }) || undefined);

        await interaction.editReply({ embeds: [embed] });
    } catch (err) {
        const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Falha!`)
        .setDescription(`${emojis.info} Ocorreu um erro ao executar esta ação, informe aos administradores sobre o ocorrido.\n\n\`\`\`js\n${err}\n\`\`\``);

        await interaction.editReply({ embeds: [embed] });
    }
}