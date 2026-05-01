const {
SlashCommandBuilder,
EmbedBuilder,
MessageFlags
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('missao')
    .setNameLocalizations({
      'pt-BR': 'missão'
    })
    .setDescription('Comando geral de missão')
    .addSubcommand(sub =>
      sub
        .setName('cargos')
        .setDescription('「 Diversão 」Ver cargos que você pode receber nas missões')
    )
    .addSubcommand(sub =>
      sub
        .setName('diaria')
        .setDescription('「 Diversão 」Ver sua missão diária')
        .setNameLocalizations({
          'pt-BR': 'diária' // aqui você pode mudar se quiser acento
        })
        .addUserOption(option =>
          option
            .setName('usuario')
            .setDescription('Usuário que você quer ver a missão')
            .setRequired(false) // opcional (igual você queria)
        )
    ),
  
  async execute(interaction) {
    const sub = interaction.options.getSubcommand()
    const subcommand = interaction.client.subcommands.get(`missao.${sub}`)
    if (!subcommand) return
    
    await subcommand.execute(interaction, interaction.client)
  }
}