class Cooldown {
  constructor({
    windowMs = 60000, // janela de tempo (ex: 60s)
    maxUses = 5       // quantas vezes pode usar nessa janela
  }) {
    this.windowMs = windowMs
    this.maxUses = maxUses
    this.uses = new Map() // key => [timestamps]
  }

  check(key) {
    const now = Date.now()

    // pega os usos dessa key
    let timestamps = this.uses.get(key) || []

    // remove usos antigos (fora da janela)
    timestamps = timestamps.filter(ts => now - ts < this.windowMs)

    if (timestamps.length < this.maxUses) {
      // pode usar
      timestamps.push(now)
      this.uses.set(key, timestamps)

      return {
        allowed: true,
        remaining: 0
      }
    } else {
      // não pode usar
      const oldest = timestamps[0]
      const remaining = this.windowMs - (now - oldest)

      return {
        allowed: false,
        remaining
      }
    }
  }
}

module.exports = Cooldown