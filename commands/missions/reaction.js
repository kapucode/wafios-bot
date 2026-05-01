const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'reaction',

  generate(userId) {
    const chosen = randint(5, 25)

    return {
      type: 'reaction',
      message: `Reaja a ${chosen} mensagens de outros membros no servidor`,
      userId,
      progress: 0,
      goal: chosen,
      status: 'in_progress',
      createdAt: Date.now(),
      expiresAt: getNextMidnight(),

      // anti-farm seguro
      reactedMessages: new Set()
    }
  },

  handleReaction(reaction, user, mission, client) {
    client = reaction.client
    
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (!reaction.message || !reaction.message.guild) return false

    // só conta o dono da missão
    if (user.id !== mission.userId) return false

    // não pode reagir na própria mensagem
    if (reaction.message.author?.id === user.id) return false

    const messageId = reaction.message.id

    // 🔥 anti duplicação REAL (Set é mais rápido e seguro)
    if (mission.reactedMessages.has(messageId)) return false

    mission.reactedMessages.add(messageId)

    mission.progress = Math.min(mission.progress + 1, mission.goal)

    if (mission.progress >= mission.goal) {
      mission.progress = mission.goal
      mission.status = 'completed'
    }

    // 🔥 render controlado (NUNCA direto)
    scheduleRender(client, mission.userId)

    return true
  },

  formatProgress(progress, goal) {
    return `${progress}/${goal} reações`
  }
}