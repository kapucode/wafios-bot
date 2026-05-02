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
      new EmbedBuilder()
        .setDescription('teste'),
      new EmbedBuilder()
        .setDescription('outro teste')
    ]
    
    const paginator = new Paginator({ pages })
    await paginator.start(interaction)
  }
}