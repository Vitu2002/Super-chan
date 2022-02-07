import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, Message } from "discord.js";
import { CTO, OTC } from "../../functions/translateNumbers";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";

exports.run = async (Client: SuperChan, i: SelectMenuInteraction) => {
    await i.deferReply({ ephemeral: true });

    try {
        const colorRoles = Client.data.menuRoles.filter(f => f.id === "colors");
        const colorRole = colorRoles[CTO(i.values[0])];
        const role = i.guild?.roles.cache.get(colorRole.roleId);
        const member = i.guild?.members.cache.get(i.user.id);
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("roles-colors").setPlaceholder("Selecione a cor requerida.").setOptions(colorRoles.map((c, i) => { return { label: c.label, value: OTC(i), emoji: c.emoji, description: c.description } })));

        (i.message as Message).edit({ content: `${emojis.timer} \*\*Última interação:\*\* <t:${Number((Date.now()) / 1000).toFixed()}:R>`, components: [row] });

        if (!role) return await i.editReply({ embeds: [new MessageEmbed().setColor("RED").setTitle(`${emojis.error} Falha!`).setDescription(`${emojis.info} Parece que o cargo que você selecionou não existe mais no servidor, informe aos administradores sobre o ocorrido.`)] });
        if (!member) return;

        const removedRoles = member.roles.cache.map(role => {
            if (!colorRoles.some(c => c.roleId === role.id)) return ""; 

            member.roles.remove(role.id);
            return role.id;
        }).filter(f => f !== "");

        await member.roles.add(role);

        const embed = new MessageEmbed().setColor('#8348a5').setTitle(`${emojis.success} Sucesso!`).setDescription(`${emojis.pin} Pronto! O cargo <@&${role.id}> foi adicionado com sucesso!\n\n${removedRoles.length > 0 ? `${emojis.info} Os seguintes cargos foram removidos: ${removedRoles.map(r => `<@&${r}>`).join(", ")}.` : ""}`).setFooter(`${i.guild?.name}`, i.guild?.iconURL({ dynamic: true }) || undefined);

        await i.editReply({ embeds: [embed] });
    } catch (err) {
        const embed = new MessageEmbed().setColor('RED').setTitle(`${emojis.error} Falha!`).setDescription(`${emojis.info} Ocorreu um erro ao executar esta ação, informe aos administradores sobre o ocorrido.\n\n\`\`\`js\n${err}\n\`\`\``);

        await i.editReply({ embeds: [embed] });
    }
}