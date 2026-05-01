const { renderQueue } = require('./renderQueue')
const { renderMission } = require('./renderMission')

function scheduleRender(client, userId) {
  // cancela render antigo
  clearTimeout(renderQueue.get(userId))

  // cria novo delay
  const timeout = setTimeout(() => {
    renderQueue.delete(userId)
    renderMission(client, userId)
  }, 1000) // 1 segundo

  renderQueue.set(userId, timeout)
}

module.exports = { scheduleRender }