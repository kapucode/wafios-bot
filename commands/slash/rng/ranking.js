const Paginator = require('../../utils/Paginator.js')
const {
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'rng.ranking',

  async execute(interaction, client) {

    const list = client.rankingRngCache?.list || []

    const top100 = list.slice(0, 100)
    
    const pagesTxt = []
    
    for (let i = 0; i < top100.length; i += 10) {
      const chunk = top100.slice(i, i + 10)
    
      const text = chunk.map(([id, data], index) => {
        const position = i + index + 1
        return `${position}. <@${id}> — ${data.rebirths} rebirths`
      }).join('\n')
    
      pagesTxt.push(text)
    }
    
    const pages = pagesTxt.map((str) =>
      ({ actualPage, totalPages }) =>
        new EmbedBuilder()
          .setTitle(`🎯 | Rebirth Ranking (${actualPage}/${totalPages})`)
          .setDescription(str)
          .setColor(Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'))
    )
    const disabledBtn = pagesRanking.length <= 1
    
    const paginator = new Paginator({
      pages,
      disabledBtn
    })
    await paginator.start(interaction)
  }
}