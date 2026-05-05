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
    const icon = getEmojis()

    let userRng = client.rngBrawlers[interaction.user.id]
    if (!userRng) return
    
    const brawlersLength = Object.values(userRng.brawlers)
      .reduce((acc, categoria) => acc + categoria.length, 0)
      
    const totalBrawlers = Object.values(rngBrawlers)
      .reduce((acc, categoria) => acc + categoria.length, 0)
    
    if (brawlersLength < totalBrawlers) {
      return ctx.reply({
        content: `${icon.error} **|** Você precisa ter todos brawlers para dar rebirth, e você tem apenas **${brawlersLength} de um total de ${totalBrawlers} brawlers**. Ganhe brawlers usando \`&rng roll\``,
        flags: MessageFlags.Ephemeral
      })
    }
    
    const newRow = new ActionRowBuilder()
      .addComponents(
        brawlersLength >= totalBrawlers 
          ? new ButtonBuilder()
            .setLabel(`Confirmado`)
            .setEmoji(icon.success)
            .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
          : new ButtonBuilder()
            .setLabel(`Brawlers insuficientes`)
            .setEmoji(icon.error)
            .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
      )

    await interaction.update({
      components: [newRow]
    })

    userRng.rebirths++
    userRng.totalOpen = 0
    userRng.brawlers = {}

    await saveRngInfo(client, rngJsonPath)

    const luck = getLuckRng(userRng)

    // 🔥 manda nova mensagem (ephemeral via followUp)
    await interaction.followUp({
      content: `${icon.success} Rebirth feito! Agora você tem **${userRng.rebirths} rebirths** e **${luck.multiplier} de sorte**`,
      flags: MessageFlags.Ephemeral
    })
  }
}