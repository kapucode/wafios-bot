const seedrandom = require('seedrandom')

// Pseudo Random Number Generator
function PRNG({ options = [], seed }) {
  const rng = seedrandom(seed)
  return Math.floor(rng() * options.length)
}
