import { ButtonInteraction, MessageActionRow, MessageSelectMenu, MessageAttachment, ThreadChannel, MessageEmbed, Message, SelectMenuInteraction, User } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";
import emojis from "../../../../json/emojis.json";
import { CTO, OTC } from "../../functions/translateNumbers";
import { Captcha } from "captcha-canvas";
import CaptchaUsers from "../../../../database/models/CaptchaUsers";

const UsersInCaptcha = new Set<string>();

exports.run = async (Client: SuperChan, interaction: ButtonInteraction) => {

    const msg = await interaction.deferReply({ ephemeral: true, fetchReply: true });
    if (UsersInCaptcha.has(interaction.user.id)) { return interaction.editReply({ content: `${emojis.error} Hey! Termine o captcha ativo promeiro.`}); };

    UsersInCaptcha.add(interaction.user.id);

    const captcha = createCaptcha();
    const correctCaptchaIndex = Math.floor(Math.random() * 5);
    const attachment = new MessageAttachment(await captcha.png, "captcha.png");
    const options = [1,2,3,4,5].map((_, i) => { if (i === correctCaptchaIndex) { return { label: captcha.text, value: OTC(i), emoji: emojis.pin }} else { return { label: createWrongOption(), value: OTC(i), emoji: emojis.pin } } });
    const row = new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder("Selecione a opção correta.").setCustomId("captcha").setOptions(options))
    let user = await CaptchaUsers.findOne({ id: interaction.user.id });
    if (!user) { user = await new CaptchaUsers({ id: interaction.user.id }).save(); };

    await interaction.editReply({ content: `${emojis.user_card} <@!${interaction.user.id}>\n${emojis.info} \*\*ATENÇÃO:\*\* \`Você tem \`\*\*\`60\`\*\*\` segundos para responder, ou o captcha será cancelado!\``, components: [row], files: [attachment] });
    const collector = (msg as Message).createMessageComponentCollector({ componentType: "SELECT_MENU", filter: (i: SelectMenuInteraction) => { return i.user.id === interaction.user.id }, max: 1, time: 60000 });
    let alreadyReply = false;

    collector.on("collect", async (i) => {
        alreadyReply = true;
        UsersInCaptcha.delete(interaction.user.id);
        await interaction.editReply({ content: '\u200B', components: [], files: [], embeds: []});

        if (captcha.text !== options[CTO(i.values[0])].value) {
            await hasError(true);
            return;
        }

        const embedSU = new MessageEmbed().setColor('GREEN').setTitle(`${emojis.success} Resposta correta!`).setDescription(`${emojis.info} Parabéns, você passou pelo nosso captcha com sucesso!\n\n${emojis.timer} O restante do servidor será liberado em 5 segundos, aguarde.`);
        const embedSS = new MessageEmbed().setColor('GREEN').setTitle(`${emojis.success} Membro aprovado!`).setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Tempo de conta:\*\* <t:${((interaction.guild?.members.cache.get(interaction.user.id)?.user.createdTimestamp as number) / 1000).toFixed()}:R>\n${emojis.timer} \*\*Data de entrada:\*\* <t:${((interaction.guild?.members.cache.get(interaction.user.id)?.joinedTimestamp as number) / 1000).toFixed()}:R>\n${emojis.info} Tentativas: \`${user?.fails.length}\`\n${user?.fails.length == 0 ? "" : user?.fails.map((erro: any) => { return `${emojis.success} Correto: \`${erro.correct}\`\n${emojis.error} Selecionado: \`${erro.selected}\`\n${emojis.timer} Data: <t:${Number(erro.timestamp).toFixed()}:R>`}).join('\n\n')}`);

        await interaction.followUp({ embeds: [embedSU], ephemeral: true });
        setTimeout(() => { interaction.guild?.members.cache.get(i.user.id)?.roles.remove('899430178973949992') }, 5000);

        (interaction.guild?.channels.cache.get('900452257848492062') as ThreadChannel).send({ embeds: [embedSS]});

        return;
    })

    collector.on("end", async () => {
        await hasError(false);
        return;
    })

    async function hasError(ignoreAlreadyReply: boolean) {
        UsersInCaptcha.delete(interaction.user.id);
        if (ignoreAlreadyReply && alreadyReply) return;

        user = await user?.updateOne({ id: interaction.user.id }, { $push: { fails: { correct: captcha.text, selected: "Nenhum", timestamp: (Date.now() / 1000).toFixed() } }})

        if ((user?.fails?.length as number) >= 3) {
            const embedEU = new MessageEmbed().setColor('#8348a5').setAuthor('SuperScans', `${interaction.guild?.iconURL({ dynamic: true })}`, 'https://superscans.site').setTitle(`${emojis.error} Ops!`).setDescription(`${emojis.info} Parece que você errou o nosso captcha mais de 3 vezes, e por isso foi banido do nosso servidor.\n\n${emojis.peoples} Caso você queira ser desbanido de nosso servidor, e poder fazer o captcha novamente, entre neste servidor -> [Requisitar desbanimento](https://discord.gg/jKbBYU3kHN).`).setFooter('Atenciosamente, Super-chan', `${Client.user?.displayAvatarURL()}`);
            const embedES = new MessageEmbed().setColor('RED').setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`, 'https://superscans.site').setTitle(`${emojis.info} Membro Banido!`).setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Data de entrada:\*\* <t:${((interaction.guild?.members.cache.get(interaction.user.id)?.joinedTimestamp as number) / 1000).toFixed()}:R>\n\n${emojis.file} Tentativas: \n${user?.fails.map((erro) => { return `${emojis.success} Correto: \`${erro.correct}\`\n${emojis.error} Selecionado: \`${erro.selected}\`\n${emojis.timer} Data: <t:${Number(erro.timestamp).toFixed()}:R>` }).join('\n\n')}`);
            const member = interaction.guild?.members.cache.get(interaction.user.id);

            member?.send({ embeds: [embedEU] }).then(async () => {
               member.ban({ days: 7, reason: 'Captcha errado mais de 3 vezes.' }) 
            }).catch(async () => {
                await interaction.followUp({ ephemeral: true, content: `${emojis.timer} Você será banido em 60 segundos.`, embeds: [embedEU] });
                setTimeout(() => { member?.ban({ days: 7, reason: 'Captcha errado mais de 3 vezes.' }); }, 60000);
            });

            (interaction.guild?.channels.cache.get('900452257848492062') as ThreadChannel).send({ embeds: [embedES] });
            return;
        }

        const embedEU = new MessageEmbed().setColor('RED').setTitle(`${emojis.error} Resposta incorreta!`).setDescription(`${emojis.info} Cuidado, você só tem mais ${3 - Number(user?.fails.length)} tentativas restante!`)
        const embedES = new MessageEmbed().setColor('ORANGE').setTitle(`${emojis.error} Resposta rejeitada!`).setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Tempo de conta\*\*: <t:${((interaction.guild?.members.cache.get(interaction.user.id)?.user.createdTimestamp as number) / 1000).toFixed()}:R>\n\n${emojis.green} \*\*Resposta:\*\* \`${captcha.text}\`\n${emojis.red} \*\*Selecionado:\*\* \`Nenhum\`\n${emojis.timer} \*\*Data:\*\* <t:${(Date.now() / 1000).toFixed()}:R>`);

        await interaction.editReply({ content: `${interaction.user.id}`, files: [], components: [], embeds: [embedEU] });
        await (interaction.guild?.channels.cache.get('900452257848492062') as ThreadChannel).send({ embeds: [embedES] });

        return;
    }
}

function createCaptcha() {
    const captcha = new Captcha();
    captcha.async = false;
    captcha.addDecoy({total: 20});
    captcha.drawTrace();
    captcha.drawCaptcha();

    return captcha
}

function createWrongOption() {
    const char = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const wrong = `${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}`;

    return wrong
}