const path = require('path')
const { saveMissions } = require('../commands/utils/saveMissions.js')

module.exports = async (client) => {

  setInterval(async () => {

    if (!client.missions || client.missions.size === 0) return

    const missionsPath = path.join(__dirname, '../json/missions.json')

    let shouldSave = false

    for (const mission of client.missions.values()) {

      if (
        mission.type !== 'call' ||
        mission.status !== 'in_progress' ||
        !mission.joinedAt
      ) continue

      const now = Date.now()
      const timeSpent = Math.floor((now - mission.joinedAt) / 1000)

      if (timeSpent <= 0) continue

      mission.progress += timeSpent
      mission.joinedAt = now

      // completa missão
      if (mission.progress >= mission.goal) {
        mission.progress = mission.goal
        mission.status = 'completed'
      }

      shouldSave = true
    }

    // 🔥 salva se QUALQUER progresso mudou
    if (shouldSave) {
      try {
        await saveMissions(client, missionsPath)
      } catch (err) {
        console.error('Erro ao salvar missões:', err)
      }
    }

  }, 30000)
}