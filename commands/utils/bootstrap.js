const { loadMissions } = require('./loadMissions.js')

async function bootstrap(client) {
  const fs = require('fs/promises')
  const path = require('path')
  
  // ==========================
  // SAFE JSON LOAD
  // ==========================
  
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
  
  const baseJsonPath = path.join(__dirname, '../../json')
  
  // =========================
  // MANAGERS
  // =========================
  

  // =========================
  // MAINTENANCE
  // =========================
  client.maintenance = {
    mode: false
  }
  
  const maintenanceJson = await safeJSON(
    path.join(baseJsonPath, 'maintenance.json'),
    {}
  )
  client.maintenance.mode = maintenanceJson.mode ?? false
  
  // =========================
  // SUBCOMMANDS
  // =========================
  client.subcommands = new Map()

  const slashPath = path.join(__dirname, '..', 'slash')

  const items = await fs.readdir(slashPath)

  for (const item of items) {
    const itemPath = path.join(slashPath, item)
    const stat = await fs.stat(itemPath)

    // 📁 pasta
    if (stat.isDirectory()) {
      const files = await fs.readdir(itemPath)

      for (const file of files) {
        if (!file.endsWith('.js')) continue

        const command = require(path.join(itemPath, file))
        if (command?.name) {
          client.subcommands.set(command.name, command)
        }
      }
    }

    // 📄 arquivo direto
    else if (item.endsWith('.js')) {
      const command = require(itemPath)
      if (command?.name) {
        client.subcommands.set(command.name, command)
      }
    }
  }
  
  // =======================
  // DESAFIOS
  // =======================

  client.challengesConfig = await safeJSON(
    path.join(baseJsonPath, 'challengesConfig.json'),
    []
  )

  // =======================
  // CURIOSIDADES
  // =======================
  client.curiosities = await safeJSON(
    path.join(baseJsonPath, 'curiosidades.json'),
    []
  )

  client.curiosityConfig = await safeJSON(
    path.join(baseJsonPath, 'curiosidadesConfig.json'),
    []
  )

  // =========================
  // MISSIONS (USER DATA)
  // =========================
  client.missions = new Map()
  
  const missionsArray = await safeJSON(
    path.join(baseJsonPath, 'missions.json'),
    []
  )

  if (Array.isArray(missionsArray)) {
    for (const mission of missionsArray) {
      if (mission?.userId) {
        client.missions.set(mission.userId, mission)
      }
    }
  }

  // =========================
  // MISSIONS LIST (HANDLERS)
  // =========================
  client.missionsList = await loadMissions()

  if (!(client.missionsList instanceof Map)) {
    console.log('❌ missionsList não é Map:', client.missionsList)
    client.missionsList = new Map()
  }

  console.log(`📦 › Missões de usuários: ${client.missions.size}`)
  
  // =========================
  // STAR DROPS 
  // =========================
  client.starDrops = await safeJSON(
    path.join(baseJsonPath, 'starDrops.json'),
    {}
  )
  
  console.log(`🌟 › Star Drops de usuários carregados: ${Object.keys(client.starDrops).length}`)
  
  // =========================
  // RNG BRAWLERS
  // =========================
  client.rngBrawlers = await safeJSON(
    path.join(baseJsonPath, 'rngBrawlers.json'),
    {}
  )
  
  console.log(`🥷 › Brawlers de RNG de usuários carregados: ${Object.keys(client.rngBrawlers).length}`)
  
  // Last Messages
  client.lastMessages = {}
  
  // Cooldowns
  client.cooldowns = new Map()
}

module.exports = bootstrap