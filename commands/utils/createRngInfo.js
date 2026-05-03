const fs = require('fs/promises');
const path = require('path');
const { saveRngInfo } = require('./saveRngInfo.js')
const { getFormattedDateBR } = require('./getFormattedDateBR.js')

async function safeJSON(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`❌ Erro ao carregar ${filePath}:`, err.message)
    return fallback
  }
}

function createRngInfo(client, userId) {
  const data = {
    brawlers: {},
    totalOpen: 0,
    rebirths: 0,
    finishGameInfo: {
      hasFinished: false,
      firstUseTimestamp: Date.now(),
      finishUseTimestamp: null
    }
  }
  
  const rngBrawlersPath = path.join(__dirname, '../../json/rngBrawlers.json');
  
  if (!client.rngBrawlers[userId]) {
    client.rngBrawlers[userId] = data
    saveRngInfo(client, rngBrawlersPath)
    return client.rngBrawlers[userId]
  }
  
  return false
}

module.exports = { createRngInfo }