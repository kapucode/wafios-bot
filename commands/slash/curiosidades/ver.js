const { isManager } = require('../../utils/isManager.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const {
EmbedBuilder,
MessageFlags
} = require('discord.js')

module.exports = {
  name: 'curiosidades.ver',
  
  async execute(interaction) {
    try {
      const icon = getEmojis()
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      })
      
      
      if (!interaction.client?.curiosities) interaction.client.curiosities = []
      if (interaction.client.curiosities.length === 0) return interaction.editReply({
        content: `${icon.error} **|** Não há curiosidades na minha lista! ${isManager(client, interaction.user.id) ? `Adicione uma (\`/curiosidades adicionar\`)` : ''}`
      })
      
      const id = interaction.options.getInteger('id')
      
      let curiosity

      if (id) {
        const found = interaction.client.curiosities.find(c => c.id === id)
        if (!found) {
          return interaction.editReply({
            content: `${icon.error} **|** Não existe uma curiosidade com o ID ${id}`
          })
        }
      
        curiosity = `Tema: ${found.theme}
Curiosidade: ${found.curiosity}
ID: ${found.id}`
      } else {
        curiosity = interaction.client.curiosities.map(c =>
          `Tema: ${c.theme}
Curiosidade: ${c.curiosity.length > 50 ? c.curiosity.slice(0, 50) + ' [...]' : c.curiosity}
ID: ${c.id}\n`
        ).join('\n')
      }
      
      curiosity = curiosity.length > 1900
        ? curiosity.slice(0, 1900) + '\n[Limite de caracteres excedido]...'
        : curiosity
      
      await interaction.editReply({
        content: `\`\`\`${curiosity}\`\`\``
      })
    } catch (e) {
      console.error(e)
    }
  }
}