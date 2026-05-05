const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags
} = require('discord.js')
const { saveRngInfo } = require('../commands/utils/saveRngInfo.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const { getLuckRng } = require('../commands/utils/getLuckRng.js')

const path = require('path')
const rngJsonPath = path.join(__dirname, '../json/rngBrawlers.json')

module.exports = {
  id: 'confirm-rebirth-rng',
  
  execute: async (interaction, client) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })
    
    const icon = getEmojis()
    
    const prevMsg = interaction.message
    const newRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Confirmar`)
          .setEmoji(icon.success)
          .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
      )
    
    await prevMsg.update({
      components: [newRow]
    })
    
    
    let userRng = client.rngBrawlers[interaction.user.id]
    
    userRng.rebirths++
    userRng.totalOpen = 0
    userRng.brawlers = {}
    await saveRngInfo(client, rngJsonPath)
    
    interaction.reply(`${icon.success} Você deu rebirth! Agora você possui **${userRng.rebirths}** e **${getLuckRng(userRng).multiplier} sorte**`)
  }
}