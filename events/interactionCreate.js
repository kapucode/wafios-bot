const { isAllowGuild } = require('../commands/utils/isAllowGuild.js')
const { saveMissions } = require('../commands/utils/saveMissions')
const { MessageFlags } = require('discord.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const path = require('path')
const fs = require('fs')

const managersFilePath = path.join(__dirname, '../json/botManagers.json')

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const icon = getEmojis()

    try {

      // =========================
      // SLASH COMMANDS
      // =========================
      if (interaction.isChatInputCommand()) {

        // 🔹 Bloqueia DM
        if (!interaction.guild) {
          return interaction.reply({
            content: `${icon.error} **|** Não pode usar em DM!`,
            flags: MessageFlags.Ephemeral
          })
        }

        // 🔹 Guild permitida
        if (!isAllowGuild(interaction.guild.id)) {
          return interaction.reply({
            content: `${icon.error} **|** Esse não é meu servidor!`,
            flags: MessageFlags.Ephemeral
          })
        }

        const command = client.slashCommands.get(interaction.commandName)
        if (!command) return

        // 🔹 Comando em teste
        if (command.test) {
          let managers = []

          try {
            const raw = fs.readFileSync(managersFilePath, 'utf8')
            managers = raw ? JSON.parse(raw) : []
          } catch (err) {
            console.error('Erro ao carregar botManagers.json:', err)
          }

          if (!managers.some(m => m.id === interaction.user.id)) {
            return interaction.reply({
              content: `🛠️ **|** Comando em teste!`,
              flags: MessageFlags.Ephemeral
            })
          }
        }

        // 🔹 Executa comando
        await command.execute(interaction, client)

        // =========================
        // MISSÕES (MAP CORRETO)
        // =========================

        if (!(client.missions instanceof Map)) return
        if (!(client.missionsList instanceof Map)) return

        const userMission = client.missions.get(interaction.user.id)
        if (!userMission) return

        const handler = client.missionsList.get(userMission.type)
        if (!handler?.handleCommand) return

        const updated = await handler.handleCommand(interaction, userMission)

        if (updated) {
          const missionsPath = path.join(__dirname, '../json/missions.json')
          await saveMissions(client, missionsPath)
        }
      }

      // =========================
      // BOTÕES
      // =========================
      if (interaction.isButton()) {

        const [buttonId, ownerId] = interaction.customId.split(':')

        // 🔹 Proteção de dono
        if (interaction.user.id !== ownerId) {
          return interaction.reply({
            content: `:x: **|** Só <@${ownerId}> pode usar isso!`,
            flags: MessageFlags.Ephemeral
          })
        }

        const button = client.buttons.get(buttonId)
        if (!button) return

        await button.execute(interaction, client)
      }

    } catch (err) {
      console.error('❌ interactionCreate error:', err)
    }
  }
}