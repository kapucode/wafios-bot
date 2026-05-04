const { saveMissions } = require('../../commands/utils/saveMissions')
const path = require('path')

module.exports = async (interaction, client) => {
  // =========================
  // MISSÕES (MAP CORRETO)
  // =========================

  if (!(client.missions instanceof Map)) return
  if (!(client.missionsList instanceof Map)) return

  const userMission = client.missions.get(interaction.user.id)
  if (!userMission) return

  const handler = client.missionsList.get(userMission.type)
  if (!handler?.handleCommand) return

  const updated = await handler.handleCommand(interaction, userMission)

  if (updated) {
    const missionsPath = path.join(__dirname, '../../json/missions.json')
    await saveMissions(client, missionsPath)
  }
}