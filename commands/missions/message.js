const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'message',

  generate(userId) {
    const amounts = [50, 60, 67, 70]
    const chosen = amounts[randint(0, amounts.length - 1)]

    return {
      type: 'message',
      message: `Envie ${chosen} mensagens no servidor`,
      userId,
      progress: 0,
      goal: chosen,
      status: 'idle',
      createdAt: Date.now(),
      expiresAt: getNextMidnight(),

      // anti-bug futuro
      lastMessageId: null
    }
  },

  handleMessage(msg, mission, client) {
    client = msg.client
    
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (!msg.guild) return false

    // evita contar DM ou lixo externo
    if (!msg.channel) return false

    // evita duplicação de evento
    if (mission.lastMessageId === msg.id) return false
    mission.lastMessageId = msg.id

    // incremento seguro
    mission.progress = Math.min(mission.progress + 1, mission.goal)

    // finaliza missão
    if (mission.progress >= mission.goal) {
      mission.progress = mission.goal
      mission.status = 'completed'
    }

    // 🔥 render controlado (NUNCA direto)
    scheduleRender(client, mission.userId)

    return true
  },

  formatProgress(progress, goal) {
    return `${progress}/${goal} mensagens enviadas`
  }
}