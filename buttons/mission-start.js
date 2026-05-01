const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

const { saveMissions } = require('../commands/utils/saveMissions.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const path = require('path')

// importa tua função CV2 original
const { getCV2 } = require('../commands/utils/getCV2.js')

module.exports = {
  id: 'mission-start',

  execute: async (interaction, client) => {
    try {
      const icon = getEmojis()
      const missionsPath = path.join(__dirname, '../json/missions.json')

      if (!client.missions) client.missions = new Map()

      const userMission = client.missions.get(interaction.user.id)

      if (!userMission) {
        return interaction.reply({
          content: `${icon.error} | Missão não encontrada.`,
          flags: MessageFlags.Ephemeral
        })
      }

      if (userMission.status !== 'idle') {
        return interaction.reply({
          content: `${icon.error} | Você já iniciou ou completou essa missão.`,
          flags: MessageFlags.Ephemeral
        })
      }

      // update state
      userMission.status = 'in_progress'
      await saveMissions(client, missionsPath)

      // recalcula dados
      const progress = userMission.progress ?? 0
      const goal = userMission.goal ?? 1
      const percent = goal > 0 ? ((progress / goal) * 100).toFixed(0) : 0

      const timeLeft = `<t:${Math.floor(userMission.expiresAt / 1000)}:R>`

      const statusMap = {
        idle: 'Não iniciada',
        in_progress: 'Em andamento',
        completed: 'Concluída',
        rewarded: 'Recompensa recebida'
      }

      const translatedStatus = statusMap[userMission.status] || 'Desconhecido'

      const missionHandler =
        client.missionsList?.get(userMission.type)

      const progressText = missionHandler?.formatProgress
        ? missionHandler.formatProgress(progress, goal)
        : `${progress}/${goal}`

      const msgReward = '' // mantém simples aqui (ou recria se quiser)

      // 🔥 IMPORTANTE: RECRIA CV2 INTEIRO
      const container = require('../commands/slash/missao/diaria.js')
        .getCV2(
          userMission,
          progressText,
          percent,
          timeLeft,
          msgReward,
          translatedStatus
        )
        
      let styleRewardBtn = userMission.status === 'completed'
        ? ButtonStyle.Success
        : ButtonStyle.Danger
      
      let emojiRewardBtn = userMission.status === 'completed'
        ? icon.success
        : icon.error
      
      let styleStartBtn = ButtonStyle.Danger
      let labelStartBtn = 'Iniciar missão'
      
      if (['in_progress', 'completed', 'rewarded'].includes(userMission.status)) {
        styleStartBtn = ButtonStyle.Success
        labelStartBtn =
          userMission.status === 'completed'
            ? 'Missão completa'
            : userMission.status === 'rewarded'
            ? 'Missão resgatada'
            : 'Em progresso'
      }
      
      const btnStart = new ButtonBuilder()
        .setCustomId(`mission-start:${interaction.user.id}`)
        .setLabel(labelStartBtn)
        .setStyle(styleStartBtn)
        .setDisabled(userMission.status !== 'idle')
      
      const btnReward = new ButtonBuilder()
        .setCustomId(`mission-reward:${interaction.user.id}`)
        .setLabel('Resgatar recompensa')
        .setEmoji(emojiRewardBtn)
        .setStyle(styleRewardBtn)
        .setDisabled(userMission.status !== 'completed')
      
      const row = new ActionRowBuilder().addComponents(btnStart)
      
      if (userMission.status !== 'rewarded') {
        row.addComponents(btnReward)
      }

      await interaction.update({
        flags: MessageFlags.IsComponentsV2,
        components: [container, row]
      })

    } catch (e) {
      console.error(e)
    }
  }
}