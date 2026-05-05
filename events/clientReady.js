const { Collection } = require('discord.js')
const { loadMissions } = require('../commands/utils/loadMissions.js')
const { getButtons } = require('../commands/utils/getButtons.js')
const fs = require('fs')
const path = require('path')

module.exports = {
  name: "clientReady",
  once: true,

  async execute(client) {
    console.log(`☑️ | Logged - As ${client.user.tag}`)

    // =========================
    // BUTTONS
    // =========================
    await getButtons(client)

    // =========================
    // PRESENCE
    // =========================
    client.user.setPresence({
      status: "dnd",
      activities: [{ name: 'Mafios', type: 0 }]
    })

    // =========================
    // SUBCOMMANDS
    // =========================
    client.subcommands = new Collection()

    const basePath = path.join(__dirname, '../commands/slash')

    const folders = fs
      .readdirSync(basePath)
      .filter(file => fs.lstatSync(path.join(basePath, file)).isDirectory())

    for (const folder of folders) {
      const folderPath = path.join(basePath, folder)

      const files = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith('.js'))

      for (const file of files) {
        const filePath = path.join(folderPath, file)
        const command = require(filePath)

        if (!command.name) continue

        client.subcommands.set(command.name, command)
      }
    }

    // =========================
    // CHALLENGE STATE (SAFE)
    // =========================
    client.challengeState = {
      active: false,
      phrase: null,
      number: null,
      timeout: null
    }

    // =========================
    // TASKS
    // =========================
    const taskPath = path.join(__dirname, '../tasks')
    const taskFiles = fs.readdirSync(taskPath).filter(f => f.endsWith('.js'))

    for (const file of taskFiles) {
      const task = require(path.join(taskPath, file))
      await task(client)
    }

    // =========================
    // MISSIONS (MAP SAFE)
    // =========================
    const missionsPath = path.join(__dirname, '../json/missions.json')

    client.missions = new Map()

    try {
      if (fs.existsSync(missionsPath)) {
        const missionsArray = JSON.parse(
          fs.readFileSync(missionsPath, 'utf8')
        )

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

    // =========================
    // CURIOSITIES
    // =========================
    const curiosityFile = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../json/curiosidadesConfig.json'),
        'utf8'
      )
    )

    const curiosityPath = path.join(__dirname, '../json/curiosidades.json')
    const curiosities = JSON.parse(fs.readFileSync(curiosityPath, 'utf8'))

    client.curiosities = curiosities
    client.curiosityConfig = curiosityFile || []

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