const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

const { randint } = require('../../utils/randint.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const { saveMissions } = require('../../utils/saveMissions.js')
const { getNextMidnight } = require('../../utils/getNextMidnight.js')
const { setMissionState } = require('../../utils/missionState.js')
const { renderMission } = require('../../utils/renderMission.js')
const { getCV2 } = require('../../utils/getCV2.js')
const path = require('path')

// ------------------ FUNÇÃO DE MISSÃO ------------------

async function mission(client, targetUserId) {
  if (!client.missions) client.missions = new Map()
  if (!(client.missionsList instanceof Map)) {
    throw new Error('missionsList não carregada corretamente')
  }

  const missionsPath = path.join(__dirname, '../../../json/missions.json')

  let existing = client.missions.get(targetUserId)

  if (existing) {
    existing.progress ??= 0
    existing.goal ??= 1
    existing.status ??= 'idle'
    existing.createdAt ??= Date.now()
    existing.expiresAt ??= getNextMidnight()
    existing.ultraPity ??= 0

    if (existing.progress >= existing.goal && existing.status !== 'rewarded') {
      existing.progress = existing.goal
      existing.status = 'completed'
      await saveMissions(client, missionsPath)
    }

    if (Date.now() < existing.expiresAt) {
      await saveMissions(client, missionsPath)
      return existing
    }

    client.missions.delete(targetUserId)
  }

  const missionsList = client.missionsList

  if (missionsList.size === 0) {
    throw new Error('Nenhuma missão encontrada')
  }

  const missionsArray = Array.from(missionsList.values())
  const random = missionsArray[randint(0, missionsArray.length - 1)]

  const chosenMission = random.generate(targetUserId)

  if (!chosenMission) throw new Error('Erro ao gerar missão')

  client.missions.set(targetUserId, chosenMission)

  await saveMissions(client, missionsPath)

  return chosenMission
}

// ------------------ COMANDO ------------------

module.exports = {
  name: 'missao.diaria',

  async execute(interaction, client) {
    try {
      const icon = getEmojis()
      const missionsPath = path.join(__dirname, '../../../json/missions.json')

      if (!client.missions) client.missions = new Map()

      await interaction.deferReply()

      // 🔥 usuário alvo
      const targetUser = interaction.options.getUser('usuario') || interaction.user
      const targetUserId = targetUser.id

      const isSelf = targetUserId === interaction.user.id
      
      if (targetUser.bot) {
        return interaction.editReply({
          content: `😅 **|** Você tentou verificar a missão de ${targetUser}, mas... Ele(a) é um(a) bot!`,
          flags: MessageFlags.Ephemeral
        })
      }

      const userMission = await mission(client, targetUserId)

      if (!userMission) {
        return interaction.editReply({
          content: `${icon.error} | Falha ao carregar missão`,
          flags: MessageFlags.Ephemeral
        })
      }

      const progress = userMission.progress ?? 0
      const goal = userMission.goal ?? 1
      const expiresAt = userMission.expiresAt ?? Date.now()
      const status = userMission.status ?? 'idle'

      // 🎁 recompensa
      let msgReward = '**Nada**'
      if (status === 'rewarded') {
        if (userMission.rewardType === 'role') {
          const timestampRoleEndAt = Math.floor(userMission?.roleEndAt / 1000)
          let msgTimestamp = `(acaba <t:${timestampRoleEndAt}:R>)`

          if (Date.now() > userMission.roleEndAt) {
            msgTimestamp = `(acabou <t:${timestampRoleEndAt}:R>)`
          }

          msgReward = userMission.roleId
            ? `<@&${userMission.roleId}> ${msgTimestamp}`
            : userMission.rewardName || '**Cargo desconhecido**'

        } else if (userMission.rewardType === 'punishment') {
          msgReward = '**Castigo**'
        }
      }

      const missionHandler = client.missionsList.get(userMission.type)

      const progressText = missionHandler?.formatProgress
        ? missionHandler.formatProgress(progress, goal)
        : `${progress}/${goal}`

      // botões
      let styleRewardBtn = status === 'completed' ? ButtonStyle.Success : ButtonStyle.Danger
      let emojiRewardBtn = status === 'completed' ? icon.success : icon.error
      let styleStartBtn = ButtonStyle.Danger
      let labelStartBtn = 'Iniciar missão'

      if (['in_progress', 'completed', 'rewarded'].includes(status)) {
        styleStartBtn = ButtonStyle.Success
        labelStartBtn =
          status === 'completed'
            ? 'Missão completa'
            : status === 'rewarded'
            ? 'Missão resgatada'
            : 'Em progresso'
      }

      if (status === 'idle') {
        styleRewardBtn = ButtonStyle.Secondary
        emojiRewardBtn = '📋'
      }

      const percent = goal > 0 ? ((progress / goal) * 100).toFixed(0) : 0
      const timeLeft = `<t:${Math.floor(expiresAt / 1000)}:R>`

      const translatedStatus = {
        idle: 'Não iniciada',
        in_progress: 'Em andamento',
        completed: 'Concluída',
        rewarded: 'Recompensa recebida'
      }[status] || 'Desconhecido'

      // ⚠️ botões só pro dono
      let row = null
      let buttonsToSave = []

      if (isSelf) {
        const btnStart = new ButtonBuilder()
          .setCustomId(`mission-start:${interaction.user.id}`)
          .setLabel(labelStartBtn)
          .setStyle(styleStartBtn)
          .setDisabled(status !== 'idle')

        const btnReward = new ButtonBuilder()
          .setCustomId(`mission-reward:${interaction.user.id}`)
          .setLabel('Resgatar recompensa')
          .setEmoji(emojiRewardBtn)
          .setStyle(styleRewardBtn)
          .setDisabled(status !== 'completed')

        row = new ActionRowBuilder().addComponents(btnStart)
        buttonsToSave.push(btnStart)

        if (status !== 'rewarded') {
          row.addComponents(btnReward)
          buttonsToSave.push(btnReward)
        }
      }

      const container = getCV2(
        userMission,
        progressText,
        percent,
        timeLeft,
        msgReward,
        translatedStatus
      )

      const components = row ? [container, row] : [container]

      const sentMessage = await interaction.editReply({
        flags: MessageFlags.IsComponentsV2,
        components
      })

      const updatedMission = {
        ...client.missions.get(targetUserId),
        messageId: sentMessage.id,
        channelId: interaction.channel.id,
        row,
        msgReward,
        translatedStatus
      }

      setMissionState(
        targetUserId,
        updatedMission,
        (userId) => renderMission(client, userId)
      )


    } catch (e) {
      console.error(e)
    }
  },

  getCV2
}  