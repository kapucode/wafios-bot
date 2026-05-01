const handlePush = require('../handlers/pushHandler')
const handleChallenge = require('../handlers/challengeHandler')
const handleCommands = require('../handlers/commandHandler')
const handleGuildGuard = require('../handlers/guildGuard')
const handleMission = require('../handlers/missionHandler')
const handleStarDrop = require('../handlers/starDropDetect')

module.exports = {
  name: "messageCreate",

  async execute(msg, client) {
    try {
      if (msg.guild || !msg.author.bot || msg.channel.id === '1325972841853620339') {

        // 🔥 garante estrutura sempre válida
        if (!Array.isArray(client.messageTimestamps)) {
          client.messageTimestamps = []
        }
  
        const now = Date.now()
  
        // 🔥 mantém só mensagens dos últimos 5 minutos
        client.messageTimestamps = client.messageTimestamps.filter(
          t => now - t <= 5 * 60 * 1000
        )
  
        // 🔥 adiciona novo timestamp
        client.messageTimestamps.push(now)
  
        // 🔥 evita crescimento infinito (segurança extra)
        if (client.messageTimestamps.length > 1000) {
          client.messageTimestamps.splice(0, 200)
        }
      }

      // =========================
      // PIPELINE DO BOT
      // =========================

      await handlePush(msg, client)
      await handleChallenge(msg, client)
      await handleCommands(msg, client)
      await handleGuildGuard(msg, client)
      await handleMission(msg, client)
      await handleStarDrop(msg, client)

    } catch (err) {
      console.error('❌ messageCreate error:', err)
    }
  }
}