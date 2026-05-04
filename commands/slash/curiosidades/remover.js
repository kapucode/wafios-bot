const { isManager } = require('../../utils/isManager.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const {
EmbedBuilder,
MessageFlags
} = require('discord.js')
const path = require('path')
const fs = require('fs')

module.exports = {
  name: 'curiosidades.remover',
  
  async execute(interaction) {
    try {
      const icon = getEmojis()
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      })
      
      if (!isManager(client, interaction.user.id)) return interaction.editReply({
        content: `${icon.error} **|** Você precisa ser \`MANAGER\` para usar esse comando!`
      })
      if (!interaction.client.curiosities) interaction.client.curiosities = []
      if (interaction.client.curiosities.length === 0) return interaction.editReply({
        content: `${icon.error} **|** Não há curiosidades para retirar na minha lista!`
      })
      
      const id = interaction.options.getInteger('id')

      const before = interaction.client.curiosities.length
      
      const deleted = interaction.client.curiosities.find(c => c.id == id)
      interaction.client.curiosities = interaction.client.curiosities.filter(c => c.id != id)
      
      const after = interaction.client.curiosities.length
      
      if (before === after) {
        return interaction.editReply({
          content: `${icon.error} **|** Não existe curiosidade com o ID ${id}!`
        })
      }
      
      const embed = new EmbedBuilder()
        .setTitle(`${icon.success} | Curiosidade removida`)
        .setDescription(`A curiosidade de ID ${id} foi removida com sucesso!

> Informações:
- **Tema:** ${deleted?.theme}
- **Curiosidade:** ${deleted?.curiosity}
- **ID da curiosidade**: ${deleted?.id}`)
        .setColor(0xc1ffba)
      
      const curiosityPath = path.join(__dirname, '../../../json/curiosidades.json')
      fs.writeFileSync(curiosityPath, JSON.stringify(interaction.client.curiosities, null, 2))
      await interaction.editReply({
        embeds: [embed]
      })
    } catch (e) {
      console.error(e)
    }
  }
}