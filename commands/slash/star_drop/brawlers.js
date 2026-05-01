const { dataBrawlers, categoryDisplay, categoryChances } = require('../../../variables/dataBrawlers.js')

const {
  MessageFlags,
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'star_drop.brawlers',
  
  async execute(interaction, client) {
    let msgBrawlersInfo = ''
    
    
    for (const category in dataBrawlers) {
      const brawlersList = dataBrawlers[category]
      msgBrawlersInfo += `# 🌟 ${categoryDisplay[category]}\n`
      msgBrawlersInfo += `- **Chance de brawler**: ${categoryChances[category]}%\n\n`
      
      for (const brawler of brawlersList) {
        msgBrawlersInfo += `<@&${brawler.roleId}> (${brawler.name})
**O que dá:** ${brawler.gives}\n\n`
      }
    }
    
    const embed = new EmbedBuilder()
      .setDescription(msgBrawlersInfo)
      .setColor(0x5db1ff)
    
    interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    })
  }
}