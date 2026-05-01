const configurarCmd = require('../commands/slash/push/configurar.js')
const {
EmbedBuilder,
MessageFlags,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle } = require('discord.js')

module.exports = {
  id: 'confirm-configpush',
  execute: async (interaction, client) => {
    try {
      const state = configurarCmd.statesConfigPush.get(interaction.user.id)
      const cmd = client.slashCommands.get('push')
      
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
      
      const embed = cmd.attConfig(state.filePath, state.channel, state.role, state.cooldown)
      await interaction.followUp({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      })
    } catch (e) {
      console.error(e)
    }
  }
}