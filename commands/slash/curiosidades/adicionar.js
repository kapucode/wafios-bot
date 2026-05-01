const { isManager } = require('../../utils/isManager.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const {
EmbedBuilder,
MessageFlags
} = require('discord.js')
const path = require('path')
const fs = require('fs')

module.exports = {
  name: 'curiosidades.adicionar',
  
  async execute(interaction) {
    try {
      const icon = getEmojis()
      const curiosityPath = path.join(__dirname, '../../../json/curiosidades.json')
      
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      })
      
      if (!isManager(interaction.user.id)) return interaction.editReply({
        content: `${icon.error} **|** Você precisa ser \`MANAGER\` para usar esse comando!`
      })
      if (!interaction.client.curiosities) {
        interaction.client.curiosities = []
      }
      
      const theme = interaction.options.getString('tema')
      const curiosity = interaction.options.getString('curiosidade')
      const ids = interaction.client.curiosities.map(c => Number(c.id) || 0)
      const maxId = ids.length ? Math.max(...ids) : 0
      
      const id = maxId + 1
      
      interaction.client.curiosities.push({
        theme,
        curiosity,
        id
      })
      
      const embed = new EmbedBuilder()
        .setTitle(`${icon.success} | Curiosidade adicionada`)
        .setDescription(`Sua curiosidade foi adicionada com sucesso! Informações dela abaixo.
  
> 📋 Informações:
- **Tema**: \`${theme}\`
- **Curiosidade**: \`${curiosity}\`
- **ID da curiosidade**: \`${id}\``)
        .setColor(0xa143ff);
      
      fs.writeFileSync(curiosityPath, JSON.stringify(interaction.client.curiosities, null, 2));
      await interaction.editReply({
        embeds: [embed]
      })
    } catch (e) {
      console.error(e)
    }
  }
}