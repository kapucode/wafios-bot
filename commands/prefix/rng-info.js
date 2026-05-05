const { createRngInfo } = require('../../commands/utils/createRngInfo.js')
const { saveRngInfo } = require('../../commands/utils/saveRngInfo.js')
const { getLuckRng } = require('../../commands/utils/getLuckRng.js')

const path = require('path')
const rngJsonPath = path.join(__dirname, '../../json/rngBrawlers.json')

const { rngBrawlers } = require('../../variables/rngBrawlers.js')

const {
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'rng.info', 
  prefixes: ['+', '.', ',', '&'],
  
  async execute(msg, args) {
    try {
      const client = msg.client
      
      const arg1 = args[0]
      
      let user = 
        msg.mentions.users.first() ||
        await msg.client.users.fetch(arg1).catch(() => null)
      
      if (!user) user = msg.author
      
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
- 🎰 **Rolls**: ${userRng.totalOpen}
- ⭐ **Posição no ranking**: ${client.rankingRngCache.position.get(user.id) || 'Não encontrado'}`)
        .setColor(0x5bcddf)
      
      msg.reply({
        embeds: [embed]
      })
    } catch (err) {
      console.error(err)
    }
  }
}