const {
  EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'rng.ajuda',
  
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`❓ | Ajuda no RNG`)
      .setDescription(`O RNG de Brawlers da Mafios é um jogo, onde você coleciona brawlers, disputa ranking e muito mais.

> **Comandos**: 
\`/rng info\` - Mostra informações do seu perfil no jogo
\`/rng rebirth\` - Dê rebirth no jogo
\`/rng inventário\` - Veja seu inventário de brawlers
\`/rng ranking\` - Veja o rankin de rebirths do jogo
\`/rng roll\` - Role um brawler no jogo
`)
  }
}