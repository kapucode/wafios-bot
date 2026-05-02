const {
  SlashCommandBuilder
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stardrop')
    .setDescription('Comando geral de Star Drop')
    .addSubcommand(sub =>
      sub
        .setName('abrir')
        .setDescription('「 Diversão 」Abrir um Star Drop Mafios')
    )
    .addSubcommand(sub =>
      sub
        .setName('brawlers')
        .setDescription('「 Diversão 」Ver os Brawlers dos Star Drops Mafios')
    ),
  
  test: true
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const subcommand = interaction.client.subcommands.get(`star_drop.${sub}`)
    if (!subcommand) return
    
    await subcommand.execute(interaction, interaction.client)
  }
}