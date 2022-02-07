import { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Message, ButtonInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Roles from "../../../../../src_old/database/models/customRoles";
import emojis from "../../../../json/emojis.json";
import moment from 'moment';
import { SuperChan } from "../../../../@types/SuperChan";
moment.locale('pt-br');

exports.run = async (SuperChan: SuperChan, interaction: CommandInteraction) => {

    return interaction.reply({ ephemeral: true, content: `> ${emojis.info} Infelizmente o sistema está sendo refeito, em breve ele irá entrar em modo BETA novamente, aguarde um retorno da gerência.` });
    
    /*
    const permitedRoles = [
        '831689414483640350', // Gerência
        '858214046355554324', // Administração
        '878407000562753608', // SuperServer
        '831689560463114240', // Moderação
        '861881806542077983', // Desenvolvedor
        '876985044927926313', // Patrocinador
        '875555236285128775', // SuperPadrinho
        '875555064108961792', // Padrinho III
        //'875554790837456897', // Padrinho II
        //'833768625675567194', // Impulsionadores
        //'867194886477316126', // Membros especiais
    ]; 
    const msg = await interaction.deferReply({ fetchReply: true });

    try {
    const filterUserI = (i: any) => { if (i.user.id === interaction.user.id) { return true } else { i.reply({ content: `${emojis.error} Hey, esses botões não foram feitos para você, boboca!`, ephemeral: true }); return false } }
    const filterUserM = (m: any) => { return m.author.id === interaction.user.id }
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const Role = await Roles.findOne({ userID: interaction.user.id })
    const role = interaction.guild?.roles.cache.get(Role?.id)
    const hasPermission = member?.roles.cache.some(role => permitedRoles.includes(role.id))
    const hasIconPermission = member?.roles.cache.some(role => ["831689414483640350", "858214046355554324", "875555236285128775"].includes(role.id))

    if (!Role && !hasPermission) {
        // não é doador, impulsionador, patrocinador ou staff e não tem cargo registrado

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('Doador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),

            new MessageButton()
            .setLabel('Patrocinador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),

            new MessageButton()
            .setLabel('Impulsionador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),
        )

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(`${interaction.guild?.name}`, `${interaction.guild?.iconURL({ dynamic: true})}`, "https://supercans.site")
        .setTitle(`${emojis.error} Ops!...`)
        .setDescription(`
${emojis.info} Então, eu sei que isso é chato, mas infelizmente você não tem permissão de usar este comando.

${emojis.pin} Os cargos personalizados são exclusivos para os \*\*Doadores (Apenas <@&875554790837456897>+)\*\*, \*\*Patrocinadores\*\*, \*\*Impulsionadores\*\* e \*\*Staffs\*\*.
${emojis.pin} Como temos custos para manter o site, servidor, domínios, hosts e entre outras coisas, mantemos os cargos personalizados como privilégio para aqueles que nos ajudam a sustentar este projeto.
${emojis.pin} Para mais informações sobre como ser um doador, patrocinador ou impulsionador, utilize os botões abaixo.
`)
        .setFooter(`Atenciosamente, Super-chan`, interaction.user.displayAvatarURL())

        return await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed], components: [row] });
    }

    if (!Role && hasPermission) {
        // é doador, impulsionador, patrocinador ou staff, mas não tem cargo customizado

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setEmoji(emojis.green)
            .setLabel('Criar um cargo')
            .setStyle('SUCCESS')
            .setCustomId('custom-roles-create'),

            new MessageButton()
            .setEmoji(emojis.blue)
            .setLabel('Salvar um cargo')
            .setStyle('PRIMARY')
            .setCustomId('custom-roles-save'),

            new MessageButton()
            .setEmoji(emojis.red)
            .setLabel('Cancelar')
            .setStyle('DANGER')
            .setCustomId('custom-roles-cancel')
        )

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(`${interaction.guild?.name}`, `${interaction.guild?.iconURL({ dynamic: true })}`, "https://superscans.site")
        .setTitle(`${emojis.error} Uhm?...`)
        .setDescription(`
${emojis.info} Bem, parece que você não tem um cargo personalizado salvo nos meus dados...

${emojis.pin} Você gostaria de:
${emojis.green} Criar um novo cargo e salvá-lo na database;
${emojis.blue} Salvar um cargo já existente, na database; (Você precisa estar com o cargo)
${emojis.red} Cancelar.

${emojis.info} **ATENÇÃO**: Se você já tiver um cargo personalizado que apenas não está salvo na database, e selecionar a opção \*\*${emojis.green} Criar um novo cargo\*\*, você será punido com a incapacitação de ter um cargo personalizado e de usar este comando.
        `)
        .setFooter('Atenciosamente, Super-chan', interaction.user.displayAvatarURL())


        await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed], components: [row] })

        const collector = await (msg as Message).createMessageComponentCollector({ filter: filterUserI, componentType: "BUTTON", time: 600000 })

        collector?.on('collect', async (i: ButtonInteraction) => {
            switch (i.customId) {
                case "custom-roles-cancel": {
                    const newComponents = await (msg as Message).components[0].components.reverse().splice(0, 2)[0].setDisabled(true);
                    await (msg as Message).edit({ content: `Interação cancelada.`, components: [new MessageActionRow().addComponents(newComponents)] });
                    i.reply({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente.`})
                    break;
                }
                case "custom-roles-save": {
                    await i.reply({ content: `${emojis.info} Ok <@!${interaction.user.id}>, agora eu preciso que você me diga qual é o ID do seu cargo personalizado.` });
                    const newComponents = await (msg as Message).components[0].components.reverse().splice(1, 2)[0].setDisabled(true);
                    await (msg as Message).edit({ components: [new MessageActionRow().addComponents(newComponents)] });
                    await (msg as Message).channel?.awaitMessages({ filter: filterUserM, time: 600000, max: 1 }).then(async collected => {
                        const id = collected.first()?.content
                        const roleToGive = i.guild?.roles.cache.get(id as string)
                        const upRole = await i.guild?.roles.cache.get("875952088469864511")
                        const dwRole = await i.guild?.roles.cache.get("910983950820864060")
                        if (roleToGive === undefined) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`ID fornecido (${id}) não se refere a nenhum cargo.\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        }

                        if (!i.guild?.members.cache.get(i.user.id)?.roles.cache.has(id as string)) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`ID fornecido não confere com nenhum de seus cargos\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        }

                        if (roleToGive.members.map(m => m).length !== 1) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`O cargo fornecido é possuído por mais de uma pessoa.\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        }

                        if (await Roles.findOne({ id: id })) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`O cargo já está registrado na database.\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        }

                        if (roleToGive.position > (upRole?.position as number) || roleToGive.position < (dwRole?.position as number)) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`O cargo fornecido não está na posição correta.\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        }

                        await new Roles({ id: id, userID: interaction.user.id }).save()

                        await i.editReply({ content: `${emojis.success} Pronto <@!${interaction.user.id}>, o seu cargo personalizado foi salvo com sucesso, agora você pode usar o comando novamente e gerenciá-lo por lá.` })
                        return await (msg as Message).edit({ content: `${emojis.success} Feito! Cargo salvo com sucesso!` })
                    })
                    .catch(async () => {
                        await i.editReply({ content: `${emojis.error} Interação cancelada.` })
                        await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente.` })
                    })
                    break;
                }
                case "custom-roles-create": {
                    //910983950820864060
                    await i.reply({ content: `${emojis.info} Ok <@!${interaction.user.id}>, então me diga, qual nome você quer colocar no seu cargo? (no máximo 25 caracteres)` });
                    const newComponents = await (msg as Message).components[0].components.reverse()[2].setDisabled(true);
                    await (msg as Message).edit({ components: [new MessageActionRow().addComponents(newComponents)] });
                    await (msg as Message).channel?.awaitMessages({ filter: filterUserM, time: 600000, max: 1 }).then(async collected => {
                        const roleName = `${collected.first()?.content}`;

                        if (roleName?.length > 25) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Nome fornecido é muito longo.\`` })
                            return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                        } 

                        await i.editReply({ content: `${emojis.info} Ok <@!${interaction.user.id}>, agora me diga, qual é o código hex da cor do seu cargo? (exemplos: \`#8348a5\` ou \`ff3662\`)` })
                        await (msg as Message).channel?.awaitMessages({ filter: filterUserM, time: 600000, max: 1 }).then(async collected => {
                            const roleColor = `${collected.first()?.content}`;
                            const baseRole = i.guild?.roles.cache.get('910983950820864060')
                            const lastPosition: number = baseRole?.position || 0;

                            if (roleColor?.replace(/#/g, "")?.length > 6) {
                                await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Um HEX tem no máximo 6 ou 7 caracteres.\`` })
                                return await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente e fornecer dados válidos.` })
                            }

                            const createdRole = await interaction.guild?.roles.create({ name: roleName, color: (roleColor as any), mentionable: false, position: lastPosition +1 });
                            
                            await interaction.guild?.members.cache.get(interaction.user.id)?.roles.add(`${createdRole?.id}`);
                            await new Roles({ id: createdRole?.id, userID: interaction.user.id }).save()

                            await i.editReply({ content: `${emojis.success} Pronto ${interaction.user.id}, o seu cargo personalizado foi criado com sucesso, agora você pode usar o comando novamente e gerenciá-lo por lá.` })
                            return await (msg as Message).edit({ content: `${emojis.success} Feito! Cargo criado com sucesso!` })
                        })
                        .catch(async () => {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.` })
                            await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente.` })
                        })
                    })
                    .catch(async () => {
                        await i.editReply({ content: `${emojis.error} Interação cancelada.` })
                        await (msg as Message).edit({ content: `${emojis.error} Ok! Caso queira criar o seu cargo no futuro, basta utilizar este comando novamente.` })
                    })
                }
            }
        })
    }

    if (Role && !hasPermission) {
        // não é doador, impulsionador, patrocinador ou staff mas tem um cargo registrado

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('Doador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),

            new MessageButton()
            .setLabel('Patrocinador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),

            new MessageButton()
            .setLabel('Impulsionador')
            .setStyle('LINK')
            .setURL('https://discord.com/channels/831638879094308935/831688757664546866/910920534211035157'),
        )

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(`${interaction.guild?.name}`, `${interaction.guild?.iconURL({ dynamic: true})}`, "https://supercans.site")
        .setTitle(`${emojis.error} Ops!...`)
        .setDescription(`
${emojis.info} Então, eu sei que isso é chato, mas infelizmente você não tem mais permissão de usar este comando.

${emojis.pin} Ví aqui que você já teve um cargo registrado, mas infelizmente não pode mais utilizá-lo por não fazer mais parte de um dos grupos com tais benefícios, se você não voltar a fazer parte de um destes grupos, em breve o seu registro será deletado, junto ao seu cargo.
`)
.setFooter(`Atenciosamente, Super-chan`, interaction.user.displayAvatarURL())

        return await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed], components: [row] });
    }

    if (Role && !role) {
        // tem o cargo salvo na database, mas ele não existe atualmente

        const embed = new MessageEmbed()
        .setColor('#8348a5')
        .setAuthor(`${interaction.guild?.name}`, `${interaction.guild?.iconURL({ dynamic: true})}`, "https://supercans.site")
        .setTitle(`${emojis.error} Ops!...`)
        .setDescription(`
${emojis.info} Então, parece que o cargo que você está tentando gerenciar não existe mais no servidor.

${emojis.pin} Eu tomei liberdade e excluí os registros do cargo, agora você pode executar esse comando novamente e criar um novo cargo personalizado.
`)
        .setFooter(`Atenciosamente, Super-chan`, interaction.user.displayAvatarURL())

        await Roles.findOneAndDelete({ id: Role.id });

        return await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed] });
    }

    if (Role && role) {
        // tem cargo, ele existe e o membro tem perm de usar

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('custom-roles-info')
        .setStyle('SUCCESS')
        .setLabel('Informações')
        .setDisabled(true),

        new MessageButton()
        .setCustomId('custom-roles-edit')
        .setStyle('PRIMARY')
        .setLabel('Editar')
        .setDisabled(false),

        new MessageButton()
        .setCustomId('custom-roles-delete')
        .setStyle('DANGER')
        .setLabel('Deletar')
        .setDisabled(false),
    )

    const rowE = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('custom-roles-edit-name')
        .setStyle('PRIMARY')
        .setLabel('Editar nome')
        .setEmoji(emojis.blue),

        new MessageButton()
        .setCustomId('custom-roles-edit-color')
        .setStyle('SECONDARY')
        .setLabel('Editar cor')
        .setEmoji(emojis.black),

        new MessageButton()
        .setCustomId('custom-roles-edit-icon')
        .setStyle('SUCCESS')
        .setLabel('Editar icone')
        .setEmoji(emojis.green)
        .setDisabled(hasIconPermission ? false : true),

        new MessageButton()
        .setCustomId('custom-roles-edit-cancel')
        .setStyle('DANGER')
        .setLabel('Cancelar')
        .setEmoji(emojis.red)
    )

    

        await interaction.editReply({ embeds: [await infoEmbed(role?.id)], components: [row] })
        const collector = await (msg as Message).createMessageComponentCollector({ filter: filterUserI, componentType: "BUTTON", time: 60000 })

        collector?.on('collect', async (i: ButtonInteraction) => {
            switch (i.customId) {
                case "custom-roles-info": {
                    await i.reply({ content: emojis.loading })
                    await interaction.editReply({ embeds: [await infoEmbed(role?.id)], components: [row] })
                    await i.deleteReply()
                    break;
                }
                case "custom-roles-delete": {
                    await i.reply({ content: emojis.loading })
                    const deleteRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId('custom-roles-delete-confirm')
                        .setStyle('SUCCESS')
                        .setLabel('Confirmar')
                        .setEmoji(emojis.success),
                        
                        new MessageButton()
                        .setCustomId('custom-roles-delete-cancel')
                        .setStyle('DANGER')
                        .setLabel('Cancelar')
                        .setEmoji(emojis.error)
                        )
                        
                        await interaction.editReply({ embeds: [await deleteEmbed(role?.id)], components: [deleteRow] })
                        await i.deleteReply()
                        break;
                }
                case "custom-roles-delete-cancel": {
                    await i.reply({ content: emojis.loading })
                    await interaction.editReply({ embeds: [await infoEmbed(role?.id)], components: [row] })
                    await i.deleteReply()
                    break;
                }
                case "custom-roles-delete-confirm": {
                    await i.reply({ content: emojis.loading })
                    await Roles.findOneAndDelete({ id: role?.id });
                    await role.delete();
                    
                    const confirmEmbed = new MessageEmbed()
                    .setColor('#8348a5')
                    .setAuthor(`${interaction.guild?.name}`, `${interaction.guild?.iconURL({ dynamic: true})}`, "https://supercans.site")
                    .setTitle(`${emojis.success} Sucesso!`)
                    .setDescription(`${emojis.pin} Pronto! O seu cargo foi deletado dos registros e do servidor.`)
                    .setFooter(`Atenciosamente, Super-chan`, interaction.user.displayAvatarURL())

                    await interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [confirmEmbed] })
                    i.deleteReply();
                    break;
                }
                case "custom-roles-edit": {
                    await i.reply({ content: emojis.loading })
                    await interaction.editReply({ embeds: [await editEmbed(role?.id)], components: [rowE] })
                    await i.deleteReply()
                    break;
                }
                case "custom-roles-edit-cancel": {
                    await i.reply({ content: emojis.loading })
                    await interaction.editReply({ embeds: [await infoEmbed(role?.id)], components: [row] })
                    await i.deleteReply()
                    break;
                }
                case "custom-roles-edit-name": {
                    await i.reply({ content: `${emojis.loading} Ok <@!${i.user.id}>, Qual nome você quer colocar no seu cargo? (até 25 caracteres)\n${emojis.info} Atualmente o nome é: \`${role?.name}\`` })
                    await (msg as Message).channel?.awaitMessages({ filter: filterUserM, max: 1, time: 60000 }).then(async (collected) => {
                        i.editReply({ content: emojis.loading })
                        const name = `${collected.first()?.content}`;

                        if (name.length > 25) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Nome fornecido é muito longo.\`` });
                            setTimeout(async () => { await i.deleteReply() }, 8000);
                            return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                        }

                        await role.setName(name);
                        await i.editReply({ content: `${emojis.success} Pronto! O nome do seu cargo foi alterado para \`${name}\`` });
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });

                    }).catch(async () => {
                        i.editReply({ content: `${emojis.error} Interação cancelada.` })
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                    })
                    break;
                }
                case "custom-roles-edit-color": {
                    await i.reply({ content: `${emojis.loading} Ok <@!${i.user.id}>, Qual é o código HEX da cor você quer colocar no seu cargo? (exemplos: \`#8348a5\` ou \`ff3662\`)\n${emojis.info} Atualmente o nome é: \`${role?.name}\`` })
                    await (msg as Message).channel?.awaitMessages({ filter: filterUserM, max: 1, time: 60000 }).then(async (collected) => {
                        i.editReply({ content: emojis.loading })
                        const color = `${collected.first()?.content}`;

                        if (color?.replace(/#/g, "")?.length > 6) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Um HEX tem no máximo 6 ou 7 caracteres.\`` })
                            setTimeout(async () => { await i.deleteReply() }, 8000);
                            return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                        }

                        await role.setColor(color as any);
                        await i.editReply({ content: `${emojis.success} Pronto! O cor do seu cargo foi alterado para \`${color}\`` });
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });

                    }).catch(async () => {
                        i.editReply({ content: `${emojis.error} Interação cancelada.` })
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                    })
                    break;
                }
                case "custom-roles-edit-icon": {
                    await i.reply({ content: `${emojis.loading} Ok <@!${i.user.id}>, Envie uma imagem em forma de anexo, ou link, que será a sua nova imagem de cargo.` });
                    await (msg as Message).channel?.awaitMessages({ filter: filterUserM, max: 1, time: 60000 }).then(async (collected) => {
                        i.editReply({ content: emojis.loading })
                        const icon = collected.first()?.attachments.first()?.url ? collected.first()?.attachments.first()?.url : collected.first()?.content;

                        if (!icon) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Não foi possível encontrar a imagem.\`` })
                            setTimeout(async () => { await i.deleteReply() }, 8000);
                            return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                        }

                        const newRole = await role.setIcon(icon)

                        if (!newRole.icon) {
                            await i.editReply({ content: `${emojis.error} Interação cancelada.\n${emojis.info} Motivo: \`Não foi possível definir a imagem no cargo, tente usar um outra imagem com até 256kb.\`` })
                            setTimeout(async () => { await i.deleteReply() }, 8000);
                            return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                        }

                        await i.editReply({ content: `${emojis.success} Pronto! A imagem do seu cargo foi alterada para \`${icon}\`` });
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                    }).catch(async () => {
                        i.editReply({ content: `${emojis.error} Interação cancelada.` })
                        setTimeout(async () => { await i.deleteReply() }, 8000);
                        return await (msg as Message).edit({ content: `<@!${interaction.user.id}>`, embeds: [await editEmbed(role?.id)], components: [rowE] });
                    })
                    break;
                }
            }
         })
    }



    async function infoEmbed(id: string): Promise<MessageEmbed> {
        const role = await interaction.guild?.roles.cache.get(id)

        const embed = new MessageEmbed()
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL(), "https://superscans.site")
        .setTitle(`${emojis.info} Dados do seu cargo personalizado`)
        .setColor(role?.hexColor || '#8348a5')
        .setDescription(`
${emojis.search} \*\*Nome\*\*: \`${role?.name}\`
${emojis.info} \*\*ID\*\*: \`${role?.id}\`
${emojis.black} \*\*Cor HEX\*\*: \`${role?.hexColor}\`
${emojis.timer} \*\*Criado em\*\*: <t:${(Number(role?.createdTimestamp) / 1000).toFixed()}:R>
`);
role?.iconURL() ? embed.setThumbnail(`${role?.iconURL()}`) : null;

        return embed;
    }

    async function editEmbed(id: string): Promise<MessageEmbed> {

        const role = await interaction.guild?.roles.cache.get(id)

        const embed = new MessageEmbed()
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL(), "https://superscans.site")
        .setTitle(`${emojis.file} Editar seu cargo personalizado`)
        .setColor(role?.hexColor || '#8348a5')
        .setDescription(`
${emojis.blue} \*\*Editar nome\*\*
${emojis.black} \*\*Editar Cor\*\*
${emojis.green} \*\*Editar Imagem\*\*
${emojis.red} \*\*Cancelar\*\* (Voltar a home)
`);
role?.iconURL() ? embed.setThumbnail(`${role?.iconURL()}`) : null;

        return embed;
    }

    async function deleteEmbed(id: string): Promise<MessageEmbed> {

        const role = await interaction.guild?.roles.cache.get(id)

        const embed = new MessageEmbed()
        .setAuthor(interaction.user.username, interaction.user.displayAvatarURL(), "https://superscans.site")
        .setTitle(`${emojis.info} Deletar seu cargo personalizado`)
        .setColor(role?.hexColor || '#8348a5')
        .setDescription(`
${emojis.info} Você tem certeza que deseja \*\*DELETAR\*\* o seu cargo do servidor?

${emojis.success} \*\*Confirmar\*\* (o cargo será deletado)
${emojis.error} \*\*Cancelar\*\* (Voltar a home)
`);

        return embed;
    }
} catch (err) {

    const embed = new MessageEmbed()
    .setColor('RED')
    .setTitle(`${emojis.error} Falha!`)
    .setDescription(`${emojis.red} Ocorreu um erro no comando!\n\n\`\`\`js\n${err}\`\`\``);

    return interaction.editReply({ content: `<@!${interaction.user.id}>`, embeds: [embed] });
}
*/
}

exports.data = new SlashCommandBuilder()
.setName('cargo')
.setDescription('Crie, Verifique, Edite ou Exclua um cargo customizado')