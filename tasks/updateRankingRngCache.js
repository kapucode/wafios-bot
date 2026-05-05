function updateRngRanking(client) {
  const sorted = Object.entries(client.rngBrawlers || {})
    .sort((a, b) => b[1].rebirths - a[1].rebirths)

  const position = new Map()

  for (let i = 0; i < sorted.length; i++) {
    const userId = sorted[i][0]
    position.set(userId, i + 1)
  }

  client.rankingRngCache = {
    list: sorted,
    position
  }
}

module.exports = (client) => {
  setInterval(() => {
    updateRngRanking(client)
  }, 10 * 1000);
}