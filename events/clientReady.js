const { Collection } = require('discord.js')
const { loadMissions } = require('../commands/utils/loadMissions.js')
const fs = require('fs').promises
const path = require('path')
const fsSync = require('fs') // só pra existsSync (rápido e simples)

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    console.log(`☑️ | Logged - As ${client.user.tag}`)

    // =========================
    // PARALLEL INIT (core boost)
    // =========================
    await Promise.all([
      initPresence(client),
      initSubcommands(client),
      initTasks(client),
      initMissions(client),
      initCuriosities(client)
    ])

    // =========================
    // STATES (sync cheap stuff)
    // =========================
    client.challengeState = {
      active: false,
      phrase: null,
      number: null,
      timeout: null
    }

    client.messageTimestamps = []

    client.challenge = {
      active: false,
      type: null,
      answer: null,
      channelId: null,
      timeout: null
    }

    console.log('✅ Client ready fully initialized')
  }
}

// =========================
// INIT FUNCTIONS
// =========================

async function initPresence(client) {
  client.user.setPresence({
    status: "dnd",
    activities: [{ name: 'Mafios', type: 0 }]
  })
}

async function initSubcommands(client) {
  client.subcommands = new Collection()

  const basePath = path.join(__dirname, '../commands/slash')

  const folders = (await fs.readdir(basePath, { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .map(d => d.name)

  await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(basePath, folder)

      const files = (await fs.readdir(folderPath))
        .filter(f => f.endsWith('.js'))

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file)
          const command = require(filePath)

          if (!command?.name) return

          client.subcommands.set(command.name, command)
        })
      )
    })
  )
}

async function initTasks(client) {
  const taskPath = path.join(__dirname, '../tasks')

  const taskFiles = (await fs.readdir(taskPath))
    .filter(f => f.endsWith('.js'))

  await Promise.all(
    taskFiles.map(async (file) => {
      const task = require(path.join(taskPath, file))
      if (typeof task === 'function') task(client)
    })
  )
}

async function initMissions(client) {
  const missionsPath = path.join(__dirname, '../json/missions.json')

  client.missions = new Map()

  try {
    if (fsSync.existsSync(missionsPath)) {
      const data = await fs.readFile(missionsPath, 'utf8')
      const missionsArray = JSON.parse(data)

      if (Array.isArray(missionsArray)) {
        for (const mission of missionsArray) {
          if (mission?.userId) {
            client.missions.set(mission.userId, mission)
          }
        }
      }
    }
  } catch (err) {
    console.error('Erro ao carregar missions.json:', err)
  }

  client.missionsList = await loadMissions()
}

async function initCuriosities(client) {
  try {
    const configPath = path.join(__dirname, '../json/curiosidadesConfig.json')
    const curiosityPath = path.join(__dirname, '../json/curiosidades.json')

    const [configRaw, curiositiesRaw] = await Promise.all([
      fs.readFile(configPath, 'utf8'),
      fs.readFile(curiosityPath, 'utf8')
    ])

    client.curiosityConfig = JSON.parse(configRaw || '[]')
    client.curiosities = JSON.parse(curiositiesRaw)
  } catch (err) {
    console.error('Erro ao carregar curiosities:', err)

    client.curiosityConfig = []
    client.curiosities = []
  }
}
