const Cooldown = rrquire('../utils/Cooldown.js')

module.exports = {
  'rng.roll': new Cooldown({
    windowMs: 60000,
    maxUses: 10
  })
}