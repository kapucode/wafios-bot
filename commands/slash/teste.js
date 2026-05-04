const {
  SlashCommandBuilder
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teste')
    .setDescription('Comando geral de teste')
    .addSubcommand(sub =>
      sub
        .setName('testando')
        .setDescription('「 tezte 」teste')
    ),
  teste:true,
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const subcommand = interaction.client.subcommands.get(`rng.${sub}`)
    if (!subcommand) return
    
    await subcommand.execute(interaction, interaction.client)
  }
}