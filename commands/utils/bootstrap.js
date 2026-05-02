const { loadMissions } = require('./loadMissions.js')

async function bootstrap(client) {
  const fs = require('fs/promises')
  const path = require('path')
  
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

  // =========================
  // MAINTENANCE
  // =========================
  client.maintenance = {
    mode: false
  }
  
  const maintenanceJsonPath = path.join(__dirname, '../../json/maintenance.json')
  const maintenanceJson = await safeJSON(
    maintenanceJsonPath,
    {}
  )
  if (maintenanceJsonPath) {
    client.maintenance.mode = maintenanceJson.mode ?? false
  }
  
  // =========================
  // SUBCOMMANDS
  // =========================
  client.subcommands = new Map()

  const basePath = path.join(__dirname, '../slash')
  const items = await fs.readdir(basePath)

  for (const item of items) {
    const itemPath = path.join(basePath, item)
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

  // =========================
  // JSON SAFE LOAD
  // =========================

  const baseJsonPath = path.join(__dirname, '../../json')

  client.challengesConfig = await safeJSON(
    path.join(baseJsonPath, 'challengesConfig.json'),
    []
  )

  const missionsArray = await safeJSON(
    path.join(baseJsonPath, 'missions.json'),
    []
  )

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
  const starJsonPath = path.join(__dirname, '../../json/starDrops.json')
  const starJson = await safeJSON(
    starJsonPath,
    {}
  )
  if (starJsonPath) {
    client.starDrops = starJson ?? {}
  } else {
    client.starDrops = {}
  }
  
  console.log(`🌟 › Star Drops de usuários carregados: ${Object.keys(client.starDrops).length}`)
  
  // =========================
  // RNG BRAWLERS
  // =========================
  const rngJsonPath = path.join(__dirname, '../../json/rngBrawlers.json')
  const rngJson = await safeJSON(
    rngJsonPath,
    {}
  )
  if (rngJsonPath) {
    client.rngBrawlers = rngJson ?? {}
  } else {
    client.rngBrawlers = {}
  }
  
  console.log(`🥷 › Brawlers de RNG de usuários carregados: ${Object.keys(client.rngBrawlers).length}`)
  
  // Last Messages
  client.lastMessages = {}
}

module.exports = bootstrap