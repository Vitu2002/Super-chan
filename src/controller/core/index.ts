import { Controller } from '../../@types/Controller';
import { gray, magenta, green } from 'colors';
import { config } from 'dotenv';
import mainError from "../functions/mainError";
import logs from "../functions/logs";
import Logs from "../components/logs";
import Stop from "../components/stop";
import Start from "../components/start";
import Restart from "../components/restart";
import Connect from '../../database/core';
import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } from 'discord.js';
const Client = new Controller();

config();
Connect();
logs(Client);

Client.on("ready", client => {
    client.user.setPresence({ status: "idle", activities: [{ type: "PLAYING", name: "modules manager" }] })
    console.log(gray(`[${magenta("!")}]`) + green(" Sistema central ativo com sucesso!"))
})

Client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        console.log(interaction.customId)
        if (!["dashboard-start", "dashboard-restart", "dashboard-stop", "dashboard-logs"].includes(interaction.customId)) return;

        const commandName = interaction.customId;

        switch (commandName) {
            case "dashboard-logs": return Logs(Client, interaction);
            case "dashboard-stop": return Stop(Client, interaction);
            case "dashboard-start": return Start(Client, interaction);
            case "dashboard-restart": return Restart(Client, interaction);
        }
    }
})

Client.on('error', err => {
    mainError(err)
    console.error(err)
});

/*
(async () => {
    const guild = await Client.guilds.fetch("831638879094308935");
    const channel = await guild.channels.fetch("868572012426194994") as TextChannel;
    //const message = await channel?.messages.fetch("899159050862882816");

    const embed = new MessageEmbed()
    .setDescription("> <:sE_Pin:931742787148337193> • `Conteúdo Adulto`\n> • Liberar canais de conteúdo adulto, somente para maiores de idade.\n> <:sE_Pin:931742787148337193> • `Promoções`\n> • Receber notificações de promoções e jogos gratuitos.\n> <:sE_Pin:931742787148337193> • `Sorteios`\n> • Ser notificado de sorteios que acontecerão.\n> <:sE_Pin:931742787148337193> • `Eventos`\n> • Notificações de eventos com recompensas.\n> <:sE_Pin:931742787148337193> • `Jogos`\n> • Ter acesso a canais de jogos, como Mudae e outros.\n> <:sE_Pin:931742787148337193> • `Novas Obras`\n> • Novas obras da equipe, chegaram em primeira mão para você.\n> <:sE_Pin:931742787148337193> • `Obras Adultas`\n> • Notificações de obras adultos, para maiores de idade.\n> <:sE_Pin:931742787148337193> • `Obras Normais`\n> • Notificações de obras comuns.\n> <:sE_Pin:931742787148337193> • `Todas Obras`\n> • Ser notificado para todas as obras que lançamos.\n> <:sE_Pin:931742787148337193> • `Obras Parceiras`\n> • Notificações de obras de parceiros da SuperScans.\n> \n> <:sE_Info:931714165876342834> • **Clique no sistema abaixo para adicionar**")
    .setFooter("• Em caso de 'falha na interação', contate suporte.", "https://media.discordapp.net/attachments/879139551984099408/929894663425515540/20220109_212840.jpg")
    .setColor(8603813);

    const embed1 = new MessageEmbed()
    .setDescription("> <:sE_Hashtag:938292149806579712> • **`Níveis por experiência`**\n> \n> • `Como subir de nível` Simples, sendo ativo nos **principais** canais do servidor, principalmente canais de interação, evite canais de **jogos** e conteúdos específicos, eles não contribuirão com sua experiência no **servidor**.\n> \n> • `Oque eu ganho com isso?` Cada nível tem seus **benefícios,** em um canal de comandos utilize o comando `+infoxp`, e possivelmente suas **dúvidas** estarão respondidas, se não foi o suficiente, procure **suporte**.\n\n> <:sE_Hashtag:938292149806579712> • **`Cargos da Equipe`**\n> \n> • `Quem é a equipe?` Os responsáveis pela realização do servidor e tudo oque envolve, a **SuperScans** como um todo.\n> \n> • `Quais são os cargos?` A parte administrativa do servidor é feita pelos **Gerentes**, **Administradores** e **Moderadores**, a **Gerência** é o cargo mais alto da hierarquia, sendo os **fundadores**. a **Administração** são os próximos, logo após a moderação, e se encerra a parte administrativa, cada um dessa categoria tem uma função perante a equipe, e a parte mais técnica do site, são os **Desenvolvedores**, agora na parte da **SuperScans**, os cargos dos que fazem todo o trabalho são os **Supervisores**, **Tradutores**, **Editores**, **Editores de Artes Visuais**, **Desenhistas**, **Revisores** e pequenas ramificações que fazem trabalhos específicos, tão importantes quanto a parte administrativa.\n\n> <:sE_Hashtag:938292149806579712> • **`Outros cargos`**\n> \n> • `Oque são?` **Cargos** que não entram em uma categoria mas merecem seu destaque, como o **Caçador** cargo para aqueles que contribuem com o canal de ajuda ao procurar conteúdo, nossos queridos **parceiros**, afiliados a **SuperScans** de outros servidores, as **Integrações** que são classificadas em musicais e administrativas, responsáveis **por automatizar** o servidor, os **Membros Especiais**, membros que estão com nós a tanto tempo que merecem um cargo especial para eles, cargos mais específicos como de **obras, notificações, utilidades, padrinhos e apoiadores**, cada um tem seu canal específico explicando sua função.")
    .setColor(8603813)
    .setFooter("• Se não achou oque queria, contate um moderador.", "https://media.discordapp.net/attachments/879139551984099408/929894663425515540/20220109_212840.jpg");
    
    const embed3 = new MessageEmbed()
    .setDescription("> <:sE_Translatr:938297205545111562> • `Tradução`\n> • **Tradução** é para aqueles que tem conhecimento em alguma língua estrangeira, nas quais as mais utilizadas são **Inglês, Coreano, Chinês, Japonês e Espanhol**. É claro que você não precisa ser fluente, basta ter um bom **entendimento** sobre expressões e interpretação de fala.\n> \n> <:sE_Editor:938297233764413480> • `Edição`\n> • Na **edição**, você pode aprender na prática, diferente da **tradução** que é na teoria (estudo de códigos e linguagens). Esse cargo se encaixa em quem sabe editar, ou quem possui interesse e quer **aprender**. Porém, se você já sabe editar, pode contatar a equipe **Administrativa** contando sua experiência como editor em alguma outra **comunidade** ou profissionalmente. Mas, caso você não saiba e possui **tempo e dedicação** para aprender, nossa equipe te dará apoio com ensino gratuito com os **melhores editores.**\n\n> <:sE_Reviewer:938297259932651600> • `Revisão`\n> • **Tradutores** podem esquecer algo durante a tradução, o trabalho da **revisão** é consertar erros gramaticais, e o formato utilizado na raiz do texto, além de fazer **adaptações** no contexto da obra.\n\n> <:sE_Draww:938300818963202088> • `Redesenho`\n> • **Redesenhar** é a parte que mais afeta a frequência das obras, pois exige tempo, e pessoas **inexperientes** perdem horas nisso, por isso, recomendamos que seja feito **separadamente** por alguém que sabe o que está **fazendo.**\n\n> <:sE_Designner:938300763694858300> • `Artes Visuais`\n> • **Artes Visuais**, ou comumente chamado de **'design'**, é tomar frente aos projetos de capas e todas as artes que o servidor e a equipe **necessitar**.\n\n> <:sE_Qcc:938301008113729576> • `Checagem de Qualidade`\n> • **Checar** a qualidade e o **resultado final** do trabalho dos outros da **equipe**, verificar edição e corrigir **possíveis erros**, adicionar marcas d'água, personalizar capas e adicionar páginas **extras**.\n\n> <:sE_Uupload:938300954988666890> • `Postagem`\n> • **Postagem**, para você entrar para a equipe de postagem, diferente dos outros métodos, não existe teste, você precisa de experiência em **Upload** em leitores online, como exemplo do** MangaLivre, TsukiMangas, MangaDex** e outros. Além disso, é bom você saber checar a qualidade, pois terá situações onde você terá que verificar **formatos, capas, covers e outros**. É importante para manter o padrão de qualidade. além de quê algo bom a se saber, é juntar e separar imagens. Nós podemos te ensinar. Se interessou? Chame algum **administrador** e conte sobre sua experiência.")
    .addFields([
        {
          "name": "> <:sE_Hashtag:938292149806579712> • `Contate Eri#0012`",
          "value": "> Para recrutamento em tradução. Que também estará disponível para tirar dúvidas de quaisquer idiomas, dentro do possível.",
          "inline": true
        },
        {
          "name": "> <:sE_Hashtag:938292149806579712> •  `Contate Lozz#9999`",
          "value": "> Para recrutamento em edição, Redesenho, Artes visuais, Checagem de Qualidade e Postagem.",
          "inline": true
        }
      ])
    .setColor(8603813)
    .setImage("https://cdn.discordapp.com/attachments/879139551984099408/937180899039137802/20220130_000149.jpg");

    const embed4 = new MessageEmbed()
    .setDescription("> <:sE_Info:931714165876342834> • **`Quem nós somos?`**\n> Olá, nós somos a **SuperScans**, um grupo de tradução que se uniu após a queda dos sites **SuperHentais** e **SuperMangás**, para continuar com o nosso objetivo de traduzir **mangás**, **manhwas**, **doujins** e afins. Caso você queira nos ajudar nessa jornada e contribuir com toda a comunidade, você pode doar alguma quantia. Mais informações sobre doação no canal <#868380017321717800>. Se você entender sobre o assunto, poderá entrar na equipe de **editores**, **revisores** e **tradutores**, ou até mesmo subir na hierarquia e alcançar grandes cargos. Acesse o nosso servidor, e entre em <#868572012426194994> e leia a mensagem presente nela.\n\n> <:sE_Pin:931742787148337193> • `Acesse nossas redes sociais`\n> <:sE_Site:937165162320887860> • **__<https://superscans.site>__**\n> <:sE_Discordd:937184919971586058> • **__<https://discord.gg/BdduAfz4vw>__**\n> <:sE_Twitter:937165137205411840> • **__<https://twitter.com/super_scans>__**")
    .addFields([{ "name": "<:sE_Hashtag:938292149806579712> • `Nos apoie`", "value": "<#868380017321717800>", "inline": true }, { "name": "<:sE_Hashtag:938292149806579712> • `Entre para equipe`", "value": "<#868572012426194994>", "inline": true }, { "name": "<:sE_Hashtag:938292149806579712> • `Venha interagir `", "value": "<#925114252371578920>", "inline": true }])
    .setImage("https://cdn.discordapp.com/attachments/879139551984099408/937180899039137802/20220130_000149.jpg")
    .setColor(8603813);

    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu().setCustomId("roles-general").setPlaceholder("Selecione aqui o seu cargo desejado.").setOptions([{label: "teste", value: "first_option"}]),
    )
        
    const row2 = new MessageActionRow().addComponents(
        new MessageButton()
        .setStyle("LINK")
        .setURL("https://cdn.discordapp.com/attachments/879139673094627328/938619013934747648/SuperScans_-_Guia_de_Edicao.pdf")
        .setEmoji("931742787148337193")
        .setLabel("Guia de Edição")
    )

    channel.send({ embeds: [embed3], components: [row2] });
})();
*/

Client.login(process.env.DISCORD_TOKEN)