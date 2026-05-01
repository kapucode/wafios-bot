const {
ActionRowBuilder,
ButtonBuilder,
ButtonStyle } = require('discord.js')

module.exports = {
  id: 'cancel-configpush',
  execute: async (interaction, client) => {
    try {
      const btnConfirm = new ButtonBuilder()
        .setCustomId(`confirm-configpush:${interaction.user.id}`)
        .setLabel('Confirmar')
        .setEmoji('<:confirm:1481371916429168752>')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
        
      const btnCancel = new ButtonBuilder()
        .setCustomId(`cancel-configpush:${interaction.user.id}`)
        .setLabel('Cancelar')
        .setEmoji('<:cancel:1481371978072981654>')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
      
      const row = new ActionRowBuilder()
        .addComponents(btnConfirm, btnCancel)
      
      await interaction.update({
        components: [row]
      })
    } catch (e) {
      console.error(e)
    }
  }
}