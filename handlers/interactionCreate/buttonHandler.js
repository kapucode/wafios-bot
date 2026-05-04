const { MessageFlags } = require('discord.js')

const { getEmojis } = require('../../commands/utils/getEmojis.js')

const icon = getEmojis()

module.exports = async (interaction, client) => {
  if (interaction.isButton()) {

    const [buttonId, ownerId] = interaction.customId.split(':')
  
    // 🔹 Proteção de dono
    if (interaction.user.id !== ownerId) {
      return interaction.reply({
        content: `${icon.error} **|** Você não é <@${ownerId}> (autor do comando) para usar esse botão!`,
        flags: MessageFlags.Ephemeral
      })
    }
  
    const button = client.buttons.get(buttonId)
    if (!button) return
  
    await button.execute(interaction, client)
  }
}