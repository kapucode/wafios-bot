const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'messageWordCount',

  generate(userId) {
    const amountWords = randint(5, 25)
    const amountTimes = randint(1, 5)

    return {
      type: 'messageWordCount',
      message: `Envie ${amountTimes} mensagem(ns) com exatamente ${amountWords} palavras`,
      userId,
      progress: 0,
      goal: amountTimes,
      wordsAmount: amountWords,
      status: 'in_progress',
      createdAt: Date.now(),
      expiresAt: getNextMidnight()
    }
  },

  handleMessage(message, mission, client) {
    client = message.client
    
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (!message.guild) return false

    // normaliza texto
    const words = message.content.trim().split(/\s+/)

    if (words.length !== mission.wordsAmount) return false

    mission.progress = Math.min(mission.progress + 1, mission.goal)

    if (mission.progress >= mission.goal) {
      mission.progress = mission.goal
      mission.status = 'completed'
    }

    // 🔥 render controlado (IMPORTANTE)
    scheduleRender(client, mission.userId)

    return true
  },

  formatProgress(progress, goal) {
    return `${progress}/${goal} mensagens`
  }
}