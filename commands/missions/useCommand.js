const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'useCommand',

  generate(userId) {
    const goal = randint(2, 4)

    return {
      type: 'useCommand',
      message: `Use comandos do bot Wafios ${goal} vezes! (Comandos de barra "/")`,
      userId,
      progress: 0,
      goal,
      status: 'in_progress',
      createdAt: Date.now(),
      expiresAt: getNextMidnight()
    }
  },

  handleCommand(interaction, mission, client) {
    client = interaction.client
    
    if (!mission) return false
    if (mission.status !== 'in_progress') return false
    if (!interaction.guild) return false

    if (interaction.user.id !== mission.userId) return false

    let sub = null

    try {
      sub = interaction.options.getSubcommand()
    } catch (e) {
      sub = null
    }

    // evita crash
    if (!sub) return false

    // regra de exclusão (mantida, mas segura)
    if (sub.toLowerCase() === 'diaria') return false

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
    return `${progress}/${goal} comandos usados`
  }
}