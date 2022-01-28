import { ButtonInteraction, MessageActionRow, MessageSelectMenu, MessageAttachment, ThreadChannel, MessageEmbed, Message, SelectMenuInteraction } from "discord.js";
import { UsersCaptcha, UsersCaptchaTypes } from "../../database/models/users-captcha";
import OTC from "../../utils/functions/OrdinalToCardinal";
import CTO from "../../utils/functions/CardinalToOrdinal";
import { SuperChanTypes } from "../../types/Client";
import { Captcha } from "captcha-canvas";
import emojis from "../../json/emojis.json";

const UsersInCaptcha = new Set()

exports.run = async (SuperChan: SuperChanTypes, interaction: ButtonInteraction) => {
    const msg = await interaction.deferReply({ ephemeral: true, fetchReply: true });

    if (UsersInCaptcha.has(interaction.user.id)) {
        return interaction.editReply({ content: `${emojis.error} Hey! Termine o captcha ativo promeiro.`})
    }

    UsersInCaptcha.add(interaction.user.id)

    const UserTimestamp = await (SuperChan.users.cache.get(interaction.user.id)?.createdTimestamp as number / 1000);
    const MemberTimestamp = await (interaction.guild?.members.cache.get(interaction.user.id)?.joinedTimestamp as number / 1000);
    const filterUserI = (i: SelectMenuInteraction) => { return i.user.id === interaction.user.id };
    const captchaI = Math.floor(Math.random() * 5);
    const captcha = new Captcha();
    captcha.async = false;
    captcha.addDecoy({total: 20});
    captcha.drawTrace();
    captcha.drawCaptcha();
    
    let User = await UsersCaptcha.findOne({ id: interaction.user.id });
    if (!User) {
        User = new UsersCaptcha({ id: interaction.user.id });
        await User.save();
    }

    const captchaImage = new MessageAttachment(await captcha.png, `captcha-do-${interaction.user.id}.png`)
    const options = await Options(captcha.text, captchaI);
    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('captcha')
        .setPlaceholder('Selecione a opção correta.')
        .addOptions(options)
    )

    await interaction.editReply({ content: `${emojis.user_card} <@!${interaction.user.id}>\n${emojis.info} \*\*ATENÇÃO:\*\* \`Você tem \`\*\*\`60\`\*\*\` segundos para responder, ou o captcha será cancelado!\``, components: [row], files: [captchaImage] });
    const collector = (msg as Message).createMessageComponentCollector({ componentType: "SELECT_MENU", filter: filterUserI, max: 1, time: 60000 });
    let alreadyReply = false;

    collector.on('collect', async (i: SelectMenuInteraction) => {
    alreadyReply = true;
    await interaction.editReply({ content: '\u200B', components: [], files: [], embeds: []});
        UsersInCaptcha.delete(interaction.user.id);

        const selected = await options[await CTO(i.values[0])].label as string || "Falha";

        if (selected === captcha.text) {
            const embedSuccess = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${emojis.success} Resposta correta!`)
            .setDescription(`${emojis.info} Parabéns, você passou pelo nosso captcha com sucesso!\n\n${emojis.timer} O restante do servidor será liberado em 5 segundos, aguarde.`)

            await interaction.followUp({ embeds: [embedSuccess], ephemeral: true });
            setTimeout(() => { interaction.guild?.members.cache.get(i.user.id)?.roles.remove('899430178973949992') }, 5000)

            const embedStaff = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${emojis.success} Membro aprovado!`)
            .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Tempo de conta:\*\* <t:${MemberTimestamp.toFixed()}:R>\n${emojis.timer} \*\*Data de entrada:\*\* <t:${MemberTimestamp.toFixed()}:R>\n${emojis.info} Tentativas: \`${User.errors.length}\`\n${User.errors.length == 0 ? "" : User.errors.map((erro: any) => { return `${emojis.success} Correto: \`${erro.correct}\`\n${emojis.error} Selecionado: \`${erro.selected}\`\n${emojis.timer} Data: <t:${Number(erro.timestamp).toFixed()}:R>`}).join('\n\n')}`)

            const channel = await interaction.guild?.channels.cache.get('900452257848492062');

            await (channel as ThreadChannel).send({ embeds: [embedStaff] });
            return;
        }

        await UsersCaptcha.updateOne({ id: interaction.user.id }, { $push: { errors: { correct: captcha.text, selected: selected, timestamp: (Date.now() / 1000).toFixed() } } })
        User = await UsersCaptcha.findOne({ id: interaction.user.id });

        if (User.errors.length >= 3) {

            const embedEU = new MessageEmbed()
            .setColor('#8348a5')
            .setAuthor('SuperScans', `${interaction.guild?.iconURL({ dynamic: true })}`, 'https://superscans.site')
            .setTitle(`${emojis.error} Ops!`)
            .setDescription(`${emojis.info} Parece que você errou o nosso captcha mais de 3 vezes, e por isso foi banido do nosso servidor.\n\n${emojis.peoples} Caso você queira ser desbanido de nosso servidor, e poder fazer o captcha novamente, entre neste servidor -> [Requisitar desbanimento](https://discord.gg/jKbBYU3kHN).`)
            .setFooter('Atenciosamente, Super-chan', `${SuperChan.user?.displayAvatarURL()}`);

            const embedES = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`, 'https://superscans.site')
            .setTitle(`${emojis.info} Membro Banido!`)
            .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Tempo de conta:\*\* <t:${UserTimestamp.toFixed()}:R>\n${emojis.timer} \*\*Data de entrada:\*\* \`<t:${MemberTimestamp.toFixed()}:R>\`\n\n${emojis.file} Tentativas: \n${User.errors.map((erro: any) => { return `${emojis.success} Correto: \`${erro.correct}\`\n${emojis.error} Selecionado: ${erro.selected}\n${emojis.timer} Data: <t:${Number(erro.timestamp).toFixed()}:R>` }).join('\n\n')}`);

            try {
                await interaction.user.send({ embeds: [embedEU] });
                await interaction.guild?.members.cache.get(interaction.user.id)?.ban({ reason: 'Captcha errado mais de 3 vezes.' });
            } catch (err) {
                await interaction.followUp({ content: `${emojis.timer} Você será banido em 2 minutos.`, embeds: [embedEU], ephemeral: true });
                setTimeout(async () => { await interaction.guild?.members.cache.get(interaction.user.id)?.ban({ reason: 'Captcha errado mais de 3 vezes.' }); }, 120000);
            }

            const channel = await interaction.guild?.channels.cache.get('900452257848492062');

            await (channel as ThreadChannel).send({ embeds: [embedES] });

            return;
        }

        if (User.errors.length <= 3) {
        const embedEU = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Resposta incorreta!`)
        .setDescription(`${emojis.info} Cuidado, você só tem mais ${3 - Number(User.errors.length)} tentativas restante!`)

        const embedStaff = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle(`${emojis.error} Resposta rejeitada!`)
        .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} Tempo de conta: <t:${UserTimestamp.toFixed()}:R>\n\n${emojis.green} Resposta: \`${captcha.text}\`\n${emojis.red} Selecionado: \`${selected}\`\n${emojis.timer} \*\*Data:\*\* <t:${(Date.now() / 1000).toFixed()}:R>`);

        await interaction.followUp({ embeds: [embedEU], ephemeral: true });
        await (interaction.guild?.channels.cache.get('900452257848492062') as ThreadChannel).send({ embeds: [embedStaff] });

        return;
        }
    })

    collector.on('end', async () => {
    console.log('6')
    console.log(alreadyReply)
    if (alreadyReply) {
        console.log("capturado")
            UsersInCaptcha.delete(interaction.user.id);
            return
        }

        console.log("passou")
            
        UsersInCaptcha.delete(interaction.user.id);

        await UsersCaptcha.updateOne({ id: interaction.user.id }, { $push: { errors: { correct: captcha.text, selected: "Nenhum", timestamp: (Date.now() / 1000).toFixed() } } })
        User = await UsersCaptcha.findOne({ id: interaction.user.id });

        if (User.errors.length >= 3) {
            const embedEU = new MessageEmbed()
            .setColor('#8348a5')
            .setAuthor('SuperScans', `${interaction.guild?.iconURL({ dynamic: true })}`, 'https://superscans.site')
            .setTitle(`${emojis.error} Ops!`)
            .setDescription(`${emojis.info} Parece que você errou o nosso captcha mais de 3 vezes, e por isso foi banido do nosso servidor.\n\n${emojis.peoples} Caso você queira ser desbanido de nosso servidor, e poder fazer o captcha novamente, entre neste servidor -> [Requisitar desbanimento](https://discord.gg/jKbBYU3kHN).`)
            .setFooter('Atenciosamente, Super-chan', `${SuperChan.user?.displayAvatarURL()}`);

            const embedES = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`, 'https://superscans.site')
            .setTitle(`${emojis.info} Membro Banido!`)
            .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Data de entrada:\*\* <t:${MemberTimestamp.toFixed()}:R>\n\n${emojis.file} Tentativas: \n${User.errors.map((erro: any) => { return `${emojis.success} Correto: \`${erro.correct}\`\n${emojis.error} Selecionado: \`${erro.selected}\`\n${emojis.timer} Data: <t:${Number(erro.timestamp).toFixed()}:R>` }).join('\n\n')}`);

            try {
                await interaction.user.send({ embeds: [embedEU] });
                await interaction.guild?.members.cache.get(interaction.user.id)?.ban({ reason: 'Captcha errado mais de 3 vezes.' });
            } catch (err) {
                await interaction.editReply({ content: `${emojis.timer} Você será banido em 2 minutos.`, components: [], files: [], embeds: [embedEU] });
                setTimeout(async () => { await interaction.guild?.members.cache.get(interaction.user.id)?.ban({ reason: 'Captcha errado mais de 3 vezes.' }); }, 120000);
            }

            const channel = await interaction.guild?.channels.cache.get('900452257848492062');

            await (channel as ThreadChannel).send({ embeds: [embedES] });

            return;
        }

        const embedEU = new MessageEmbed()
        .setColor('RED')
        .setTitle(`${emojis.error} Resposta incorreta!`)
        .setDescription(`${emojis.info} Cuidado, você só tem mais ${3 - Number(User.errors.length)} tentativas restante!`)

        const embedStaff = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle(`${emojis.error} Resposta rejeitada!`)
        .setDescription(`${emojis.user_card} \*\*Membro:\*\* \`${interaction.user.tag} - ${interaction.user.id}\`\n${emojis.timer} \*\*Tempo de conta\*\*: <t:${UserTimestamp.toFixed()}:R>\n\n${emojis.green} \*\*Resposta:\*\* \`${captcha.text}\`\n${emojis.red} \*\*Selecionado:\*\* \`Nenhum\`\n${emojis.timer} \*\*Data:\*\* <t:${(Date.now() / 1000).toFixed()}:R>`);

        await interaction.editReply({ content: `${interaction.user.id}`, files: [], components: [], embeds: [embedEU] });
        await (interaction.guild?.channels.cache.get('900452257848492062') as ThreadChannel).send({ embeds: [embedStaff] });

        return;
    })
}

async function Options(captcha: string, captchaIndex: number) {
    let arr: any[] = [];

    for (let i = 0; i < 5; i++) {
        const char = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        const wrong = `${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}${char[Math.floor(Math.random() * char.length)]}`;
        
        arr.push({ 
            label: i == captchaIndex ? captcha : wrong,
            emoji: emojis.pin,
            description: `• Clique aqui caso acredite que ${i == captchaIndex ? captcha : wrong} seja o correto.`,
            value: OTC[i]
        });
    }

    return arr
}