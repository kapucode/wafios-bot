const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags
} = require('discord.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const { getLuckRng } = require('../commands/utils/getLuckRng.js')

module.exports = {
  id: 'rebirth-rng',
  
  execute: async (interaction, client) => {
    const icon = getEmojis()
    
    const userRng = client.rngBrawlers[interaction.user.id]
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Confirmar`)
          .setEmoji(icon.success)
          .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
          .setStyle(ButtonStyle.Success)
      )
    
    await interaction.reply({
      content: `> ⚠️ Você tem certeza que deseja dar rebirth? Isso reiniciará todo o seu progresso de brawlers.

- 🎯 Quantidade de rebirths atualmente: **${userRng.rebirths}**

> 💫 Bônus de rebirth:
- ${getLuckRng(userRng).multiplier} sorte
- Cargos exclusivos
- Chance de entrar no ranking (\`/rng rebirth ranking\`)`,
      components: [row],
      flags: MessageFlags.Ephemeral
    })
  }
}
