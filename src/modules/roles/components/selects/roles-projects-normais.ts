import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, Message } from "discord.js";
import { CTO, OTC } from "../../functions/translateNumbers";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";

exports.run = async (Client: SuperChan, i: SelectMenuInteraction) => {
    await i.deferReply({ ephemeral: true });

    try {
        const possibleRoles = Client.data.menuRoles.filter(f => f.id === "project-normal");
        const selectedRole = possibleRoles[CTO(i.values[0].replace(/-/g, "_"))];
        const role = i.guild?.roles.cache.get(selectedRole.roleId);
        const member = i.guild?.members.cache.get(i.user.id);
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("roles-projects-hentais").setPlaceholder("Selecione aqui a obra +18 desejado.").setOptions(Client.data.menuRoles.filter(f => f.id === "project-hentai").map((c, i) => { return { label: c.label, value: OTC(i) } })));
        const row2 = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("roles-projects-normais").setPlaceholder("Selecione aqui a obra -18 desejado.").setOptions(Client.data.menuRoles.filter(f => f.id === "project-normal").map((c, i) => { return { label: c.label, value: OTC(i) } })));

        (i.message as Message).edit({ content: `${emojis.timer} \*\*Última interação:\*\* <t:${Number((Date.now()) / 1000).toFixed()}:R>`, components: [row, row2] });

        if (!role) return await i.editReply({ embeds: [new MessageEmbed().setColor("RED").setTitle(`${emojis.error} Falha!`).setDescription(`${emojis.info} Parece que o cargo que você selecionou não existe mais no servidor, informe aos administradores sobre o ocorrido.`)] });
        if (!member) return;

        const isToAdd = !member.roles.cache.has(role.id);

        isToAdd ? member.roles.add(role) : member.roles.remove(role);

        const embed = new MessageEmbed().setColor('#8348a5').setTitle(`${emojis.success} Sucesso!`).setDescription(`${emojis.pin} Pronto! O cargo <@&${role?.id}> foi ${isToAdd ? "adicionado" : "removido"} com sucesso!`).setFooter(`${i.guild?.name}`, `${i.guild?.iconURL({ dynamic: true })}`);

        await i.editReply({ embeds: [embed] });
    } catch (err) {
        const embed = new MessageEmbed().setColor('RED').setTitle(`${emojis.error} Falha!`).setDescription(`${emojis.info} Ocorreu um erro ao executar esta ação, informe aos administradores sobre o ocorrido.\n\n\`\`\`js\n${err}\n\`\`\``);

        await i.editReply({ embeds: [embed] });
    }
};