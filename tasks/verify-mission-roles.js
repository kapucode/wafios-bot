const path = require('path')
const { saveMissions } = require('../commands/utils/saveMissions.js')

module.exports = async (client) => {
  if (client.__roleIntervalStarted) return
  client.__roleIntervalStarted = true

  const GUILD_ID = '1325972840146800660'
  const missionsPath = path.join(__dirname, '../json/missions.json')

  const runCheck = async () => {
    try {
      const missions = client.missions
      if (!missions || missions.size === 0) return

      const now = Date.now()

      const guild =
        client.guilds.cache.get(GUILD_ID) ||
        await client.guilds.fetch(GUILD_ID).catch(() => null)

      if (!guild) return

      let changed = false

      for (const mission of missions.values()) {
        if (!mission) continue

        const roleEndAt = Number(mission.roleEndAt)

        // 🔒 filtros rápidos primeiro (menos CPU)
        if (!roleEndAt) continue
        if (now < roleEndAt) continue
        if (mission.roleActive === false) continue

        try {
          // ⚡ cache primeiro, fetch só se precisar
          const member =
            guild.members.cache.get(mission.userId) ||
            await guild.members.fetch(mission.userId).catch(() => null)

          if (!member) continue

          if (mission.roleId && member.roles.cache.has(mission.roleId)) {
            await member.roles.remove(mission.roleId).catch(() => null)
          }

          mission.roleActive = false
          mission.roleExpiredAt = now

          changed = true

        } catch (e) {
          console.error('Erro ao remover cargo:', e)
        }
      }

      if (changed) {
        await saveMissions(client, missionsPath)
      }

    } catch (err) {
      console.error('Erro ao checar roles expiradas:', err)
    }
  }

  // 🚀 evita overlap de interval
  setInterval(runCheck, 60 * 1000)
}