module.exports = {
  name: 'rng.rebirth',
  
  async execute(interaction, client) {
    const rebirth = require('../../../buttons/rebirth-rng.js')
    
    await rebirth.execute(interaction, client)
  }
}