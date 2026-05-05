const { MessageFlags } = require('discord.js')
const { getEmojis } = require('../../commands/utils/getEmojis.js')

const icon = getEmojis()

module.exports = async (interaction, client) => {
  if (!interaction.isButton()) return

  const parts = interaction.customId.split(':')

  let buttonId
  let ownerId
  
  if (parts.length === 3) {
    // namespace:action:owner
    buttonId = parts[1]
    ownerId = parts[2]
  } else if (parts.length === 2) {
    // action:owner
    buttonId = parts[0]
    ownerId = parts[1]
  } else {
    // só action
    buttonId = parts[0]
  }

  // 🔥 botão não registrado → ignora
  if (!client.buttons.has(buttonId)) return

  // 🔹 proteção de dono (se existir ownerId)
  if (ownerId && interaction.user.id !== ownerId) {
    return interaction.reply({
      content: `${icon.error} **|** Esse botão não é seu.`,
      flags: MessageFlags.Ephemeral
    })
  }

  const button = client.buttons.get(buttonId)
  await button.execute(interaction, client)
}