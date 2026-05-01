const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('curiosidades')
    .setDescription('Comando geral de curiosidades')
    .addSubcommand(sub => 
      sub
        .setName('configurar')
        .setDescription("「 ADM 」Configurações para as curiosidades de chat!")
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
        .setDescription("「 ADM 」Informações das curiosidades de chat!")
    )
    .addSubcommand(sub =>
      sub
        .setName('adicionar')
        .setDescription("「 ADM 」Adicionar curiosidades de chat!")
        .addStringOption(option =>
          option
            .setName('tema')
            .setDescription('Tema da curiosidade')
            .setRequired(true)
            .setMaxLength(25)
        )
        .addStringOption(option =>
          option
            .setName('curiosidade')
            .setRequired(true)
            .setDescription('A sua curiosidade')
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('ver')
        .setDescription("「 ADM 」Ver as curiosidades!")
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('ID da curiosidade')
            .setMinValue(1)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('remover')
        .setDescription("「 ADM 」Remova uma curiosidade por ID!")
        .addIntegerOption(option =>
          option
            .setName('id')
            .setDescription('ID da curiosidade')
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()

    if (!interaction.client?.subcommands) {
      console.error('Subcommands não carregados')
      return interaction.reply({
        content: 'Erro interno (subcommands).',
        ephemeral: true
      })
    }
    
    const subcommand = interaction.client.subcommands.get(`curiosidades.${sub}`)

    if (!subcommand) {
      console.error(`Subcommand não encontrada: curiosidades.${sub}`)
      return interaction.reply({
        content: `Subcomando não encontrado: ${sub}`,
        flags: MessageFlags.Ephemeral
      })
    }
    
    await subcommand.execute(interaction, interaction.client)
    
  }
}