const {
  SlashCommandBuilder
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rng')
    .setDescription('Comando geral de RNG')
    .addSubcommand(sub =>
      sub
        .setName('roll')
        .setDescription('「 Diversão 」Rola um brawler aleatório no estilo RNG')
    )
    .addSubcommand(sub =>
      sub
        .setName('inventario')
        .setNameLocalizations({
          'pt-BR': 'inventário' // aqui você pode mudar se quiser acento
        })
        .setDescription('「 Diversão 」Ver seu inventário de Brawlers no RNG do servidor')
    )
    .addSubcommand(sub =>
      sub
        .setName('info')
        .setDescription('「 Diversão 」Ver informações do jogo RNG de alguém')
        .addUserOption(option =>
          option
            .setName('usuario')
            .setDescription('Usuário que você quer ver as informações')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('rebirth')
        .setDescription('「 Diversão 」Dar rebirth no seu RNG')
    )
    .addSubcommand(sub =>
      sub
        .setName('ranking')
        .setDescription('「 Diversão 」Ver o ranking de rebirths do RNG')
    ),
    
  test: true,
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const subcommand = interaction.client.subcommands.get(`rng.${sub}`)
    if (!subcommand) return
    
    await subcommand.execute(interaction, interaction.client)
  }
}