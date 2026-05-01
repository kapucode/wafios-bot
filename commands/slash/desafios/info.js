const {
EmbedBuilder,
MessageFlags
} = require('discord.js')
const { isManager } = require('../../utils/isManager.js')
const { getEmojis } = require('../../utils/getEmojis.js')

module.exports = {
  name: 'desafios.info',
  
  async execute(interaction, client) {
    const icon = getEmojis()
    
    const mode = client.challengesConfig?.on === true ? 'ON (Ligado)' : 'OFF (Desligado)'
    const channelId = client.challengesConfig?.channelId || 'Não encontrado'
    
    const embed = new EmbedBuilder()
      .setTitle(`🏅 | Informações dos desafios`)
      .setDescription(`> **Informações atualizadas:**
- - Modo: \`${mode}\`
- - Canal: <#${channelId}> \`(${channelId})\``)
      .setColor(0xa143ff)
    
    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    })
  }
}