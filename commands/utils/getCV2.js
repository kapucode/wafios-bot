const {
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize
} = require('discord.js')

function getCV2(userMission, progressText, percent, timeLeft, msgReward, translatedStatus) {
  function safe(v, fallback = '—') {
    if (typeof v !== 'string') return fallback
    if (v.trim().length === 0) return fallback
    return v
  }
  
  function getProgressBar(percentMission, size = 10) {
    const filled = Math.round((percentMission / 100) * size)
    const empty = size - filled
  
    return '▰'.repeat(filled) + '▱'.repeat(empty)
  }
  
  const barLength = userMission.goal <= 10 ? userMission.goal : 10
  
  const bar = getProgressBar(percent, barLength)
  
  const separator = new SeparatorBuilder()
    .setDivider(true)
    .setSpacing(SeparatorSpacingSize.Small);
  
  const invSeparator = new SeparatorBuilder()
    .setDivider(false)
    .setSpacing(SeparatorSpacingSize.Small);
  
  const title = new TextDisplayBuilder()
    .setContent('## 🎯 Missão Diária')
  
  const missionMsg = new TextDisplayBuilder()
    .setContent(
      `\n📋 **› Missão de <@${userMission.userId}>**
- **Objetivo:** ${safe(userMission?.message)}`
    )
  
  const progress = new TextDisplayBuilder()
    .setContent(
      `📊 **› Progresso**
\`${safe(progressText)}\`
${bar} **${percent ?? 0}%**`
    )
  
  const expires = new TextDisplayBuilder()
    .setContent(
      `⏳ **› Expira**
${safe(timeLeft)}`
    )
  
  const status = new TextDisplayBuilder()
    .setContent(
      `📌 **› Status**
\`${safe(translatedStatus)}\``
    )
  
  const tip = new TextDisplayBuilder()
    .setContent(
      `⚡ **› Importante**
Você só pode progredir na missão ao clicar em "Iniciar missão"`
    )

  const container = new ContainerBuilder()
    .setAccentColor(0xffaaa5)
    
    // Primeiro espaço do container
    .addTextDisplayComponents(
      title
    )
    .addSeparatorComponents(invSeparator)
    
    .addTextDisplayComponents(
      missionMsg
    )
    .addSeparatorComponents(invSeparator)
    .addTextDisplayComponents(
      progress
    )
    
    
    .addSeparatorComponents(separator)
    
    
    
    // Segunda parte do container
    .addTextDisplayComponents(
      expires
    )
    .addSeparatorComponents(invSeparator)
    if (msgReward && (userMission.status ?? 'idle') === 'rewarded') {
      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `🎁 **› Recompensa**\n${msgReward}`
        )
      )
    }
    
    
    
    container.addSeparatorComponents(separator)
    
    
    
    // Terceira parte do container
    container.addTextDisplayComponents(
      status
    )
    if (userMission?.status === 'idle') {
      container.addSeparatorComponents(invSeparator)
      container.addTextDisplayComponents(
        tip
      )
    }

  return container
}

module.exports = { getCV2 }