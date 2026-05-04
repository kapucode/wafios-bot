const buttonHandler = require('../handlers/interactionCreate/buttonHandler')
const commandHandler = require('../handlers/interactionCreate/commandHandler.js')
const missionHandler = require('../handlers/interactionCreate/missionHandler.js')

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const icon = getEmojis()

    try {
      await commandHandler(interaction, client)
      await buttonHandler(interaction, client)
      await missionHandler(interaction, client)
    } catch (err) {
      console.error('❌ interactionCreate error:', err)
    }
  }
}