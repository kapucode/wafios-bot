function getLuckRng(userRng, future) {
  let rebirths = userRng.rebirths || 0
  if (future) rebirths++

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