const { missionState } = require('./missionState')
const { getCV2 } = require('../../commands/utils/getCV2.js')
const { MessageFlags } = require('discord.js')

async function renderMission(client, userId) {
  const mission = missionState.get(userId)
  if (!mission) return

  const missionHandler = client.missionsList.get(mission.type)

  const progressText = missionHandler?.formatProgress
    ? missionHandler.formatProgress(mission.progress, mission.goal)
    : `${mission.progress}/${mission.goal}`

  const percent = mission.goal > 0
    ? Math.floor((mission.progress / mission.goal) * 100)
    : 0

  const timeLeft = `<t:${Math.floor(mission.expiresAt / 1000)}:R>`

  const container = getCV2(
    mission,
    progressText,
    percent,
    timeLeft,
    mission.msgReward || '**Nada**',
    mission.translatedStatus || 'Desconhecido'
  )

  // monta components de forma segura
  const components = [container]

  if (mission.row && mission.row.components?.length > 0) {
    components.push(mission.row)
  }

  // 🔎 busca canal
  let channel
  try {
    channel = await client.channels.fetch(mission.channelId)
  } catch (err) {
    console.log('⚠️ Canal não encontrado, abortando missão')
    return
  }

  // 🔎 tenta buscar mensagem
  let message = null
  try {
    message = await channel.messages.fetch(mission.messageId)
  } catch {
    // mensagem não existe mais
  }

  // 📌 se não existe, cria nova
  if (!message) {
    try {
      const newMsg = await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components
      })

      mission.messageId = newMsg.id
      return
    } catch (err) {
      console.error('❌ Erro ao criar nova mensagem:', err)
      return
    }
  }

  // ✏️ tenta editar
  try {
    await message.edit({
      flags: MessageFlags.IsComponentsV2,
      components
    })
  } catch (err) {
    if (err.code === 10008) {
      // mensagem sumiu ENTRE fetch e edit → recria
      try {
        const newMsg = await channel.send({
          flags: MessageFlags.IsComponentsV2,
          components
        })

        mission.messageId = newMsg.id
        return
      } catch (err2) {
        console.error('❌ Erro ao recriar mensagem:', err2)
        return
      }
    }

    console.error('❌ Erro ao editar missão:', err)
  }
}

module.exports = { renderMission }