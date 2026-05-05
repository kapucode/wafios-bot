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

    // 🔥 desativa botão primeiro (feedback visual imediato)
    const newRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Confirmado`)
          .setEmoji(icon.success)
          .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
      )

    await interaction.update({
      components: [newRow]
    })

    let userRng = client.rngBrawlers[interaction.user.id]

    if (!userRng) return

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