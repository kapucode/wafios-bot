const fs = require('fs/promises');
const path = require('path');
const { saveStarDrops } = require('./saveStarDrops.js')
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

function createStarInfo(client, userId) {
  const data = {
    actual: null,
    info: {
      messages: 1,
      goal: 100,
      date: getFormattedDateBR(),
      amountOpen: 0,
      notified: false,
      collected: false
    },
    totalOpen: 0
  }
  
  const starJsonPath = path.join(__dirname, '../../json/starDrops.json');
  
  if (!client.starDrops[userId]) {
    client.starDrops[userId] = data
    saveStarDrops(client, starJsonPath)
    return client.starDrops[userId]
  }
  
  return false
}

module.exports = { createStarInfo }