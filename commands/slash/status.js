const {
SlashCommandBuilder,
MessageFlags
} = require('discord.js')
const { getEmojis } = require('../utils/getEmojis.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('「 Auxílio 」Mostra o status atual do bot'),
  
  async execute(interaction) {
    const icon = getEmojis()
    interaction.reply({
      content: `${icon.success} **|** Estou ligado! *Quando estou desligado, o bot não responde essa mensagem.*`,
      flags: MessageFlags.Ephemeral
    })
  }
}