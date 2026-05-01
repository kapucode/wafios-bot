const path = require('path')
const { saveMissions } = require('../commands/utils/saveMissions.js')

module.exports = {
  name: 'voiceStateUpdate',

  async execute(oldState, newState, client) {
    try {
      // =========================
      // VALIDAÇÕES
      // =========================
      if (!(client.missions instanceof Map)) return
      if (!(client.missionsList instanceof Map)) return

      const userId = newState.id

      const mission = client.missions.get(userId)
      if (!mission || mission.status !== 'in_progress') return

      // =========================
      // HANDLER (MAP CORRETO)
      // =========================
      const handler = client.missionsList.get(mission.type)
      if (!handler?.handleVoice) return

      const missionsPath = path.join(__dirname, '../json/missions.json')

      // =========================
      // EXECUTA MISSÃO
      // =========================
      const updated = await handler.handleVoice(oldState, newState, mission)

      if (updated) {
        await saveMissions(client, missionsPath)
      }

    } catch (err) {
      console.error('❌ voiceStateUpdate error:', err)
    }
  }
}