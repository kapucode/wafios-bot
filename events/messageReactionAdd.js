const path = require('path')
const { saveMissions } = require('../commands/utils/saveMissions')

module.exports = {
  name: 'messageReactionAdd',

  async execute(reaction, user, client) {
    client = reaction.client
    try {

      if (reaction.partial) {
        try {
          await reaction.fetch()
        } catch (err) {
          console.error('reaction fetch failed:', err)
          return
        }
      }

      if (user.bot) return
      if (!client.missions || !(client.missions instanceof Map)) return
      if (!client.missionsList || !(client.missionsList instanceof Map)) return

      // 🔥 MAP WAY (CORRETO)
      const mission = client.missions.get(user.id)
      if (!mission || mission.status !== 'in_progress') return

      const handler = client.missionsList.get(mission.type)
      if (!handler?.handleReaction) return

      const missionsPath = path.join(__dirname, '../json/missions.json')

      const updated = handler.handleReaction(reaction, user, mission)

      if (updated) {
        await saveMissions(client, missionsPath)
      }

    } catch (err) {
      console.error('❌ messageReactionAdd error:', err)
    }
  }
}