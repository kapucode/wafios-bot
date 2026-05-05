const { createRngInfo } = require('../../../commands/utils/createRngInfo.js')
const { saveRngInfo } = require('../../../commands/utils/saveRngInfo.js')
const { getLuckRng } = require('../../../commands/utils/getLuckRng.js')

const { rngBrawlers } = require('../../../variables/rngBrawlers.js')

const {
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'rng.info', 
  
  async execute(interaction, client) {
    try {
      const user = interaction.options.getUser('usuario') || interaction.user
      
      let userRng = client.rngBrawlers[user.id]
      if (!userRng) {
        userRng = createRngInfo(client, user.id)
      }
      
      const brawlersLength = Object.values(userRng.brawlers)
        .reduce((acc, categoria) => acc + categoria.length, 0)
        
      const totalBrawlers = Object.values(rngBrawlers)
        .reduce((acc, categoria) => acc + categoria.length, 0)
        
      const percent = totalBrawlers > 0 ? ((brawlersLength / totalBrawlers) * 100).toFixed(0) : 0
        
      const embed = new EmbedBuilder()
        .setTitle(`📋 | RNG Info`)
        .setDescription(`> Informações do RNG de ${user}

- 🥷 **Brawlers**: ${brawlersLength}/${totalBrawlers} | **${percent}%**
- 🍀 **Sorte**: ${getLuckRng(userRng).multiplier}
- 🎯 **Rebirths**: ${userRng.rebirths}
- 🎰 **Rolls**: ${userRng.totalOpen}`)
        .setColor(0x5bcddf)
      
      interaction.reply({
        embeds: [embed]
      })
    } catch (err) {
      console.error(err)
    }
  }
}