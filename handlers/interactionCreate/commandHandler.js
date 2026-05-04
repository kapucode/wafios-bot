const { MessageFlags } = require('discord.js')

const { isAllowGuild } = require('../../commands/utils/isAllowGuild.js')
const { isManager } = require('../../commands/utils/isManager.js')
const { getEmojis } = require('../../commands/utils/getEmojis.js')

const path = require('path')
const fs = require('fs')

const managersFilePath = path.join(__dirname, '../../json/botManagers.json')

const icon = getEmojis()

module.exports = async (interaction, client) => {
  if (interaction.isChatInputCommand()) {
    
    const guildId = interaction?.guild?.id || ''
  
    // 🔹 Guild permitida
    if (!isAllowGuild(client, interaction.guild.id)) {
      return interaction.reply({
        content: `${icon.error} **|** Meus comandos só podem ser usados na **Mafios**!`,
        flags: MessageFlags.Ephemeral
      })
    }
  
    const command = client.slashCommands.get(interaction.commandName)
    if (!command) return
  
    // 🔹 Comando em teste
    if (command.test) {
      if (!isManager(interaction.user.id)) {
        return interaction.reply({
          content: `🛠️ **|** O comando ainda não foi disponibilizado para uso dos membros!`,
          flags: MessageFlags.Ephemeral
        })
      }
    }
  
    // 🔹 Executa comando
    await command.execute(interaction, client)
  }
}