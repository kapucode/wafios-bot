const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MediaGalleryBuilder
} = require('discord.js')
const { getNextMidnight } = require('./getNextMidnight.js')

const image = new MediaGalleryBuilder().addItems({
  media: {
    url: 'attachment://gif.gif'
  }
})

function CV2StarDrop(msg, userStar, disabled = false) {
  let toOpenAmount = userStar.info.amountOpen + 1
  if (disabled) toOpenAmount = userStar.info.amountOpen
  
  const collectBtn = new ButtonBuilder()
    .setCustomId(`collect-stardrop:${msg.author.id}:${Date.now()}`)
    .setLabel(disabled ? 'Coletado' : 'Abrir')
    .setStyle(ButtonStyle.Success)
    .setEmoji('🪙')
    .setDisabled(disabled)

  const rowCollect = new ActionRowBuilder().addComponents(collectBtn)

  const whatIsBtn = new ButtonBuilder()
    .setCustomId(`whatis-stardrop:${msg.author.id}`)
    .setLabel('O que é')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❓')

  const rowWhatIs = new ActionRowBuilder().addComponents(whatIsBtn)

  const separator = new SeparatorBuilder()
    .setDivider(true)
    .setSpacing(SeparatorSpacingSize.Small)

  const topText = new TextDisplayBuilder()
    .setContent(`🌟 › ${msg.author}, você pode abrir seu **${toOpenAmount}° Star Drop da Mafios de hoje**!`)

  const midText = new TextDisplayBuilder()
    .setContent(`🤖 › Não quer abrir agora? Use \`/star_drop abrir\`
- Não acumula
- Expira <t:${getNextMidnight() / 1000}:R>`)

  const bottomText = new TextDisplayBuilder()
    .setContent(`❓ › Não sabe o que é isso?`)

  const container = new ContainerBuilder()
    .setAccentColor(0xffff58)
    .addTextDisplayComponents(topText)
    .addMediaGalleryComponents(image)
    .addActionRowComponents(rowCollect)
    .addSeparatorComponents(separator)
    .addTextDisplayComponents(midText)
    .addSeparatorComponents(separator)
    .addTextDisplayComponents(bottomText)
    .addActionRowComponents(rowWhatIs)

  return container
}

module.exports = { CV2StarDrop }