const { randint } = require('../utils/randint.js')
const { getNextMidnight } = require('../utils/getNextMidnight.js')
const { setMissionState } = require('../utils/missionState.js')
const { renderMission } = require('../utils/renderMission.js')
const { scheduleRender } = require('../utils/renderQueueMission.js')

module.exports = {
  name: 'call',

  generate(userId) {
    const minutes = [20, 25, 30]
    const chosen = minutes[randint(0, minutes.length - 1)]

    return {
      type: 'call',
      message: `Fique ${chosen} minutos em call`,
      userId,
      progress: 0,
      goal: chosen * 60,
      status: 'idle',
      createdAt: Date.now(),
      expiresAt: getNextMidnight(),
      joinedAt: null
    }
  },
  formatProgress(progress, goal) {
    const progressMin = Math.floor(progress / 60)
    const goalMin = Math.floor(goal / 60)
    return `${progressMin}/${goalMin} minutos`
  },
  handleVoice(oldState, newState, mission) {
    try {
      const client = oldState.client
      
      if (!oldState.guild) return
      if (oldState.guild.id !== '1325972840146800660') return
      
      // entrou
      if (!oldState.channelId && newState.channelId) {
        mission.joinedAt = Date.now()
        return true
      }
  
      // saiu ou trocou
      if (
        (oldState.channelId && !newState.channelId) ||
        (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId)
      ) {
        if (!mission.joinedAt) return false
  
        const timeSpent = Math.floor((Date.now() - mission.joinedAt) / 1000)
  
        mission.progress += timeSpent
        mission.joinedAt = newState.channelId ? Date.now() : null
  
        if (mission.progress >= mission.goal) {
          mission.progress = mission.goal
          mission.status = 'completed'
        }
        
        scheduleRender(client, mission.userId)
  
        return true
      }
  
      return false
    } catch (e) {
      console.error(e)
    }
  }
}