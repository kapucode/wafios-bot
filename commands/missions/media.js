const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'media',

  generate(userId) {
    const amount = [2, 3, 4]
    const chosen = amount[randint(0, amount.length - 1)]

    return {
      type: 'media',
      message: `Envie ${chosen} mídias no canal <#1335762346601218148>`,
      userId,
      progress: 0,
      goal: chosen,
      status: 'idle',
      createdAt: Date.now(),
      expiresAt: getNextMidnight(),

      // segurança anti-bug futuro
      lastMessageId: null
    }
  },

  handleMessage(msg, mission, client) {
    client = msg.client
    
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (msg.channel.id !== '1335762346601218148') return false

    if (!msg.attachments || msg.attachments.size === 0) return false

    // anti-duplicação simples (evita double count em retry/cache bug)
    if (mission.lastMessageId === msg.id) return false
    mission.lastMessageId = msg.id

    const amount = msg.attachments.size

    // atualiza progresso com segurança
    mission.progress = Math.min(mission.progress + amount, mission.goal)

    // finaliza missão
    if (mission.progress >= mission.goal) {
      mission.progress = mission.goal
      mission.status = 'completed'
    }
    return true
  },

  formatProgress(progress, goal) {
    return `${progress}/${goal} mídias enviadas`
  }
}