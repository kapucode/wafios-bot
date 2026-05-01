const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js')
const mapas = require('../commands/slash/mapas.js')

module.exports = {
  id: 'finish-maps',
  execute: async (interaction, client) => {
    try {
      const state = mapas.states.get(interaction.message.id)
      const finishButton = new ButtonBuilder()
        .setCustomId('finish-maps')
        .setLabel('Mapas fechados')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔒')
        .setDisabled(true)
        
      const rerollButton = new ButtonBuilder()
        .setCustomId('reroll-maps')
        .setLabel('Resortear')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🔄')
        .setDisabled(true)
    
  
      const oldEmbed = interaction.message.embeds[0]
      
      const embed = EmbedBuilder.from(oldEmbed)
        .setFooter({
          text: (oldEmbed.footer?.text ?? ``) + ' | Fechado',
          iconURL: oldEmbed.footer?.iconURL
        })
      const newRow = new ActionRowBuilder().addComponents(finishButton, rerollButton)
      
      if (state) {
        mapas.states.delete(interaction.message.id)
      }
      
      await interaction.update({
        embeds: [embed],
        components: [newRow]
      })
    } catch (e) {
      console.error(e)
    }
  }
}