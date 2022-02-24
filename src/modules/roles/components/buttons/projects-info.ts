import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js";
import { SuperChan } from "../../../../@types/SuperChan";
import { OTC } from "../../functions/translateNumbers";

exports.run = async (Client: SuperChan, i: ButtonInteraction) => {
    try {
        await i.deferReply({ ephemeral: true });

        const embeds = [
            new MessageEmbed().setColor(8603813)
                .setTitle("<:sE_Lists:936711033286979614> \*\*\`Cargos Gerais\`\*\*")
                .setDescription("> <:sE_Hashtag:938292149806579712> • Os cargos gerais, são aqueles que tem uma função específica, porém ficam todos juntos para manter uma melhor organização no servidor. E eles são:\n\n> <:sE_Pin:931742787148337193> • `Conteúdo Adulto`\n> • Liberar canais de conteúdo adulto, somente para maiores de idade.\n> <:sE_Pin:931742787148337193> • `Promoções`\n> • Receber notificações de promoções e jogos gratuitos.\n> <:sE_Pin:931742787148337193> • `Sorteios`\n> • Ser notificado de sorteios que acontecerão.\n> <:sE_Pin:931742787148337193> • `Eventos`\n> • Notificações de eventos com recompensas.\n> <:sE_Pin:931742787148337193> • `Jogos`\n> • Ter acesso a canais de jogos, como Mudae e outros.\n> <:sE_Pin:931742787148337193> • `Novas Obras`\n> • Novas obras da equipe, chegaram em primeira mão para você.\n> <:sE_Pin:931742787148337193> • `Obras Adultas`\n> • Notificações de obras adultos, para maiores de idade.\n> <:sE_Pin:931742787148337193> • `Obras Normais`\n> • Notificações de obras comuns.\n> <:sE_Pin:931742787148337193> • `Todas Obras`\n> • Ser notificado para todas as obras que lançamos.\n> <:sE_Pin:931742787148337193> • `Obras Parceiras`\n> • Notificações de obras de parceiros da SuperScans."),

            new MessageEmbed().setColor(8603813)
                .setDescription("> <:sE_Hashtag:938292149806579712> • **`Níveis por experiência`**\n> \n> • `Como subir de nível` Simples, sendo ativo nos **principais** canais do servidor, principalmente canais de interação, evite canais de **jogos** e conteúdos específicos, eles não contribuirão com sua experiência no **servidor**.\n> \n> • `Oque eu ganho com isso?` Cada nível tem seus **benefícios,** em um canal de comandos utilize o comando `+infoxp`, e possivelmente suas **dúvidas** estarão respondidas, se não foi o suficiente, procure **suporte**.\n\n> <:sE_Hashtag:938292149806579712> • **`Cargos da Equipe`**\n> \n> • `Quem é a equipe?` Os responsáveis pela realização do servidor e tudo oque envolve, a **SuperScans** como um todo.\n> \n> • `Quais são os cargos?` A parte administrativa do servidor é feita pelos **Gerentes**, **Administradores** e **Moderadores**, a **Gerência** é o cargo mais alto da hierarquia, sendo os **fundadores**. a **Administração** são os próximos, logo após a moderação, e se encerra a parte administrativa, cada um dessa categoria tem uma função perante a equipe, e a parte mais técnica do site, são os **Desenvolvedores**, agora na parte da **SuperScans**, os cargos dos que fazem todo o trabalho são os **Supervisores**, **Tradutores**, **Editores**, **Editores de Artes Visuais**, **Desenhistas**, **Revisores** e pequenas ramificações que fazem trabalhos específicos, tão importantes quanto a parte administrativa.\n\n> <:sE_Hashtag:938292149806579712> • **`Outros cargos`**\n> \n> • `Oque são?` **Cargos** que não entram em uma categoria mas merecem seu destaque, como o **Caçador** cargo para aqueles que contribuem com o canal de ajuda ao procurar conteúdo, nossos queridos **parceiros**, afiliados a **SuperScans** de outros servidores, as **Integrações** que são classificadas em musicais e administrativas, responsáveis **por automatizar** o servidor, os **Membros Especiais**, membros que estão com nós a tanto tempo que merecem um cargo especial para eles, cargos mais específicos como de **obras, notificações, utilidades, padrinhos e apoiadores**, cada um tem seu canal específico explicando sua função.")
                .setFooter("• Se não achou oque queria, contate um moderador.", "https://media.discordapp.net/attachments/879139551984099408/929894663425515540/20220109_212840.jpg")
        ];

        const possibleRoles = Client.data.menuRoles.filter(f => f.id === "roles")

        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("roles-default").setPlaceholder("Selecione aqui o seu cargo desejado.").setOptions(possibleRoles.map((c, i) => { return { label: c.label, value: OTC(i), emoji: c.emoji, description: c.description } })));
        const row1 = new MessageActionRow().addComponents(new MessageButton().setLabel("• Clique aqui para ver mais informações sobre os cargos.").setEmoji("931714165876342834").setCustomId("roles-info").setStyle("SECONDARY"));


        (i.message as Message).edit({ content: `> <:timer:738377157243306015> **Última interação:** <t:${(Date.now() / 1000).toFixed()}:R>`, components: [row, row1] });

        return await i.editReply({ embeds: embeds });
    } catch (err) {
        console.error(err)
    }
}