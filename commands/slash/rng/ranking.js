module.exports = {
  name: 'rng.ranking',
  
  async execute(interaction, client) {
    const sortedRng = client.rngBrawlers.sort((a, b) => b[1].rebirths - a[1].rebirths)
    const top10 = array.slice(0, 10)
    const ranking = top10.map(([id, data], i) => {
      return `${i + 1}. <@${id}> - ${data.xp} XP`
    }).join('\n')
    
    console.log(ranking)
  }
}