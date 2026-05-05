function getLuckRng(userRng) {
  const rebirths = userRng.rebirths || 0

  const baseLuck = 1
  const rebirthBonus = rebirths * 1

  const totalLuck = baseLuck + rebirthBonus

  return {
    score: totalLuck,
    multiplier: totalLuck + "x",
    rebirths
  }
}

module.exports = { getLuckRng }