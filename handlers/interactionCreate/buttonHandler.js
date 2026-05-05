const { MessageFlags } = require('discord.js')
const { getEmojis } = require('../../commands/utils/getEmojis.js')

const icon = getEmojis()

module.exports = async (interaction, client) => {
  if (!interaction.isButton()) return

  const parts = interaction.customId.split(':')

  let buttonId
  let ownerId

  // 🔹 botão simples (sem owner)
  if (parts.length === 1) {
    buttonId = parts[0]
  }

  // 🔹 botão com owner (ou namespace:action:owner)
  else if (parts.length >= 2) {
    // se tiver namespace (3 partes), ignora o primeiro
    if (parts.length >= 3) {
      buttonId = parts[1]
      ownerId = parts[2]
    } else {
      buttonId = parts[0]
      ownerId = parts[1]
    }
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