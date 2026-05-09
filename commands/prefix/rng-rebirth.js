module.exports = {
  name: 'rng.rebirth',
  prefixes: ['.', ',', '&', '+']
  
  async execute(msg) {
    const rebirth = require('../../buttons/rebirth-rng.js')
    
    await rebirth.execute(msg, msg.client)
  }
}