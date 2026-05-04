const { MessageFlags } = require('discord.js')

const { isAllowGuild } = require('../../commands/utils/isAllowGuild.js')
const { getEmojis } = require('../../commands/utils/getEmojis.js')

const path = require('path')
const fs = require('fs')

const managersFilePath = path.join(__dirname, '../../json/botManagers.json')

const icon = getEmojis()

module.exports = async (interaction, client) => {
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
  }
}