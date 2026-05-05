const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  EmbedBuilder
} = require('discord.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const { getLuckRng } = require('../commands/utils/getLuckRng.js')
const { createRngInfo } = require('../commands/utils/createRngInfo.js')
const { rngBrawlers } = require('../variables/rngBrawlers.js')

module.exports = {
  id: 'rebirth-rng',
  
  execute: async (ctx, client) => {
    const icon = getEmojis()
    
    const user = ctx?.user || ctx?.author
    
    let userRng = client.rngBrawlers[user.id]
    if (!userRng) {
      userRng = createRngInfo(client, user.id)
    }
    
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
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Confirmar`)
          .setEmoji(icon.success)
          .setCustomId(`confirm-rebirth-rng:${interaction.user.id}`)
          .setStyle(ButtonStyle.Success)
      )
    
    const embed = new EmbedBuilder()
      .setColor(0xdf815b)
      .setDescription(`> ⚠️ Você tem certeza que deseja dar rebirth? Isso reiniciará todo o seu progresso de brawlers.

- 🎯 Quantidade de rebirths atualmente: **${userRng.rebirths}**

> 💫 Bônus de rebirth:
- ${getLuckRng(userRng).multiplier + 1} sorte
- Cargos exclusivos
- Chance de entrar no ranking (\`/rng rebirth ranking\`)`)
    
    await ctx.reply({
      embeds: [embed],
      components: [row],
      flags: MessageFlags.Ephemeral
    })
  }
}
