const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MediaGalleryBuilder
} = require('discord.js')

module.exports = {
  id: 'whatis-stardrop',
  
  execute: async (interaction, client) => {
    const separator = new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small);
    
    const title = new TextDisplayBuilder()
      .setContent(`**# ❓ › Star Drops Mafios?**`)
    const text1 = new TextDisplayBuilder()
      .setContent(`> A Mafios (esse servidor) possui os próprios Star Drops, onde os mesmos podem dar **Brawlers**, que são cargos com recompensas **permanentes**.\n\n`)
      
    const title2 = new TextDisplayBuilder()
      .setContent(`## Como conseguir?`)
    const text2 = new TextDisplayBuilder()
      .setContent(`> Para abrir um Star Drop Mafios você precisa enviar uma meta de mensagens, que inicialmente é **100**, e cada Star Drop aberto, é somado 100 mensagens à meta.
> Quando você atinge a meta, nosso bot próprio (Wafios) envia uma mensagem avisando que você pode abrir um Star Drop, mas se você quiser abrir em outro momento, há o comando \`/stardrop abrir\`.\n\n`)
    
    const title3 = new TextDisplayBuilder()
      .setContent(`## Há um limite diário?`)
    const text3 = new TextDisplayBuilder()
      .setContent(`> Sim. O limite diário de Star Drops abertos é **5 por pessoa**.\n\n`)
      
    const title4 = new TextDisplayBuilder()
      .setContent(`## Como são sorteados os brawlers?`)
    const text4 = new TextDisplayBuilder()
      .setContent(`> Utilizamos um sistema totalmente aleatório para sortear os brawlers, e cada um é sorteado de acordo com a chance da categoria dos brawlers. Use \`/stardrop brawlers\` para ver suas chances.
> Quer saber mais? Fale com <@1173408263920951356>\n\n`)
    
    const title5 = new TextDisplayBuilder()
      .setContent(`## Como vejo quantos Star Drops já abri?`)
    const text5 = new TextDisplayBuilder()
      .setContent(`Use \`/perfil\` para ver várias informações sobre seu perfil na Mafios.\n\n`)
      
    const text6 = new TextDisplayBuilder()
      .setContent(`Ainda possui dúvidas? Abra um ticket ou fale com <@1173408263920951356>.`)
    
    const container = new ContainerBuilder()
      .setAccentColor(0xffeaac)
      .addTextDisplayComponents(
        title,
        text1,
        title2,
        text2,
        title3,
        text3,
        title4,
        text4,
        title5,
        text5
      )
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        text6
      )
    
    interaction.reply({
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      components: [container]
    })
  }
}