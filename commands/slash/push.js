const { 
SlashCommandBuilder,
EmbedBuilder,
MessageFlags } = require("discord.js");
const { isManager } = require('../utils/isManager.js')
const fs = require('fs')
const path = require('path')
const { getEmojis } = require('../utils/getEmojis.js')
const pushFilePath = path.join(__dirname, '../../json/push.json')
const pushModeFilePath = path.join(__dirname, '../../json/pushMode.json')

function attConfig(filePath, channel, role, cooldown=5) {
  if (!filePath || !channel || !role) throw new Error('SyntaxError: you forgot pass some argument \'attConfig()\'?')
  
  const embed = new EmbedBuilder()
    .setTitle('🏆 » Configuração atualizada')
    .setDescription(`Você configurou o push do servidor!\n\n> **Atualizações:**\n- Novo canal de push: ${channel}\n- Novo cargo de push: ${role}\n- Novo cooldown: ${cooldown} minutos`)
    .setColor(0xb6ff06)
  
  // Atualizando JSON
  const object = {
    channel: channel.id,
    pushRole: role.id,
    cooldown: cooldown * 60 * 1000
  }
  fs.writeFileSync(filePath, JSON.stringify(object, null, 2))
  
  return embed
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('push')
    .setDescription('Comando principal da área de push')
    .addSubcommand(sub => 
      sub
        .setName('info')
        .setDescription("「 ADM 」Informações do comando de push!")
    )
    .addSubcommand(sub => 
      sub
        .setName('configurar')
        .setDescription("「 ADM 」Configurações para o push!")
        .addChannelOption(option => 
          option
            .setName('canal')
            .setDescription('Canal de push')
            .setRequired(true)
        )
        .addRoleOption(option => 
          option
            .setName('cargo_push')
            .setDescription('O cargo de push')
            .setRequired(true)
        )
        .addIntegerOption(option => 
          option
            .setName('cooldown')
            .setDescription('Tempo de espera entre chamadas (em minutos)')
            .setMinValue(3)
            .setMaxValue(10)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('modo')
        .setDescription('「 ADM 」Ligue ou desligue a chamada de push!')
        .addStringOption(option =>
          option
            .setName('modo')
            .setDescription('Ligar ou desligar')
            .setRequired(true)
            .addChoices(
              { name: 'ON (Ligado)', value: 'on' },
              { name: 'OFF (Desligado)', value: 'off' }
            )
        )
    ),
  
  async execute(interaction) {
    const icon = getEmojis()
    const sub = interaction.options.getSubcommand()
    
    if (!interaction.client.subcommands) {
      console.error('Subcommands não carregados')
      return interaction.reply({
        content: 'Erro interno (subcommands).',
        flags: MessageFlags.Ephemeral
      })
    }
    const commandName = interaction.commandName
    const fullName = `${commandName}.${sub}`
    
    const subcommand = interaction.client.subcommands.get(fullName)
    
    if (!subcommand) {
      console.error('Subcommand não encontrada:', {
        fullName,
        disponíveis: [...interaction.client.subcommands.keys()]
      })
    
      return interaction.reply({
        content: `Subcomando não encontrado: ${fullName}`,
        flags: MessageFlags.Ephemeral
      })
    }
    
    await subcommand.execute(interaction, interaction.client)
    
  
  },
  
  attConfig
}