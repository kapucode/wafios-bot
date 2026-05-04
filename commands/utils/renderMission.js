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

  let channel
  try {
    channel = await client.channels.fetch(mission.channelId)
  } catch {
    return // canal não existe mais
  }

  let message
  try {
    message = await channel.messages.fetch(mission.messageId)
  } catch {
    return // mensagem foi deletada
  }
  
  // monta components de forma segura (sem null)
  const components = [container]

  if (mission.row && mission.row.components?.length > 0) {
    components.push(mission.row)
  }

  await message.edit({
    flags: MessageFlags.IsComponentsV2,
    components
  })
}

module.exports = { renderMission }