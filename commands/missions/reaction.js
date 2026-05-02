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
      reactedMessages: []
    }
  },

  handleReaction(reaction, user, mission, client) {
    client = reaction.client
  
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (!reaction.message || !reaction.message.guild) return false
  
    if (user.id !== mission.userId) return false
    if (reaction.message.author?.id === user.id) return false
  
    const messageId = reaction.message.id
  
    // garantir array
    const reacted = new Set(mission.reactedMessages || [])
  
    if (reacted.has(messageId)) return false
  
    reacted.add(messageId)
    mission.reactedMessages = [...reacted]
  
    mission.progress = Math.min(mission.progress + 1, mission.goal)
  
    if (mission.progress >= mission.goal) {
      mission.progress = mission.goal
      mission.status = 'completed'
    }
  
    scheduleRender(client, mission.userId)
  
    return true
  },

  formatProgress(progress, goal) {
    return `${progress}/${goal} reações`
  }
}