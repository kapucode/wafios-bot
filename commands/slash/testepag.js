const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js')
const Paginator = require ('../utils/Paginator.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testepag')
    .setDescription('Teste de Paginator'),
  
  test: true,
  
  async execute(interaction) {
    const pages = [
      ({ actualPage, totalPages }) => 
        new EmbedBuilder()
          .setTitle(`Página: ${actualPage}/${totalPages}`)
          .setDescription(`sla teste aksksk1`),
      ({ actualPage, totalPages }) => 
        new EmbedBuilder()
          .setTitle(`Página: ${actualPage}/${totalPages}`)
          .setDescription(`sla teste 2ksjwj`),
      ({ actualPage, totalPages }) => 
        new EmbedBuilder()
          .setTitle(`Página: ${actualPage}/${totalPages}`)
          .setDescription(`sla teste 38383`)
    ]
    
    const paginator = new Paginator({ pages })
    await paginator.start(interaction)
  }
}