const path = require('path')
const { saveMissions } = require('../../commands/utils/saveMissions')

const saveTimeouts = new Map()

function scheduleSave(client, missionsPath, userId) {
  clearTimeout(saveTimeouts.get(userId))

  const timeout = setTimeout(() => {
    saveMissions(client, missionsPath)
    saveTimeouts.delete(userId)
  }, 2000)

  saveTimeouts.set(userId, timeout)
}

module.exports = async (msg, client) => {
  try {
    if (msg.author.bot) return

    if (!(client.missions instanceof Map)) return
    if (!(client.missionsList instanceof Map)) return

    const missionsPath = path.join(__dirname, '../../json/missions.json')

    const userMission = client.missions.get(msg.author.id)
    if (!userMission) return

    // 🔥 CORREÇÃO: Map ao invés de find
    const missionHandler = client.missionsList.get(userMission.type)
    if (!missionHandler?.handleMessage) return

    const before = userMission.progress ?? 0

    // suporta handler sync ou async
    await missionHandler.handleMessage(msg, userMission)

    client.missions.set(msg.author.id, userMission)

    const updated = userMission.progress !== before

    // 🔥 proteção de status
    if (
      userMission.progress >= userMission.goal &&
      userMission.status !== 'rewarded'
    ) {
      userMission.progress = userMission.goal
      userMission.status = 'completed'
    }

    if (updated) {
      scheduleSave(client, missionsPath, msg.author.id)
    }

  } catch (err) {
    console.error('❌ message mission error:', err)
  }
}