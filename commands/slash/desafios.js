const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('desafios')
    .setDescription('Comando geral de desafios')
    .addSubcommand(sub => 
      sub
        .setName('configurar')
        .setDescription("「 ADM 」Configurações para os desafios de chat!")
        .addStringOption(option =>
          option
            .setName('modo')
            .setDescription('Ligar ou desligar')
            .setRequired(false)
            .addChoices(
              { name: 'ON (Ligado)', value: 'on' },
              { name: 'OFF (Desligado)', value: 'off' }
            )
        )
        .addChannelOption(option =>
          option
            .setName('canal')
            .setDescription('Canal de desafios')
            .setRequired(false)
        )
    )
    .addSubcommand(sub => 
      sub
        .setName('info')
        .setDescription("「 ADM 」Informações dos desafios de chat!")
    ),
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const subcommand = interaction.client.subcommands.get(`desafios.${sub}`)
    if (!subcommand) return
    
    await subcommand.execute(interaction, interaction.client)
  }
}