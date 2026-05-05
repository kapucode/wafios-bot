const Paginator = require('../../utils/Paginator.js')
const {
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'rng.ranking',

  async execute(interaction, client) {

    // 1. pegar e ordenar
    const sorted = Object.entries(client.rngBrawlers || {})
      .sort((a, b) => b[1].rebirths - a[1].rebirths)
      .slice(0, 100)

    // 2. montar páginas (strings)
    const pagesRanking = []

    for (let i = 0; i < sorted.length; i += 10) {
      const chunk = sorted.slice(i, i + 10)

      const pageText = chunk.map(([id, data], index) => {
        const position = i + index + 1
        return `${position}. <@${id}> - ${data.rebirths} rebirths`
      }).join('\n')

      pagesRanking.push(pageText)
    }
    
    const pages = pagesRanking.map((str) =>
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