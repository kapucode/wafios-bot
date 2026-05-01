const { dataBrawlers, categoryDisplay, categoryChances } = require('../../../variables/dataBrawlers.js')

const {
  MessageFlags,
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'star_drop.brawlers',
  
  async execute(interaction, client) {
    let msgBrawlersInfo = []
    
    
    for (const category in dataBrawlers) {
      const brawlersList = dataBrawlers[category]
      const objData = { title: '', text: '' }
      objData.title = `🌟 ${categoryDisplay[category]}\n`
      objData.text += `- **Chance de brawler**: ${categoryChances[category]}%\n\n`
      
      for (const brawler of brawlersList) {
        objData.text += `<@&${brawler.roleId}> (${brawler.name})
**O que dá:** ${brawler.gives}\n\n`
      }
      
      msgBrawlersInfo.push(objData)
    }
    
    let embeds = []
    for (const objData of msgBrawlersInfo) {
      embeds.push(
        new EmbedBuilder()
          .setTitle(objData.title)
          .setDescription(objData.text)
          .setColor(0xbf97ff)
      )
    }
    
    interaction.reply({
      embeds: embeds,
      flags: MessageFlags.Ephemeral
    })
  }
}