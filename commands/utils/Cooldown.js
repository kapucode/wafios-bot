class Cooldown {
  constructor({
    cooldown = 5,
    usesPerMin = 1
  }) {
    this.usesPerMin = usesPerMin
    this.cooldown = cooldown / 1000 >= 1 // Se for '1000'
      ? cooldown 
      : cooldown * 1000
  }
  
  set(client, key) {
    client.cooldowns.set(key, Date.now())
    
    this.timeout = setTimeout(() => {
      client.cooldowns.delete(key)
    }, this.cooldown);
  }
  
  check(client, key) {
    if (!client.cooldowns) client.cooldowns = new Map()
    
    const now = Date.now()
    const lastUse = client.cooldowns.get(key) || 0
    
    if (now - lastUse >= this.cooldown) {
      this.set(client, key)
      clearTimeout(this.timeout);
      return {
        allowed: true,
        remaining: 0
      }
    } else {
      return {
        allowed: false,
        remaining: this.cooldown - (now - lastUse)
      }
    }
  }
}

module.exports = Cooldown