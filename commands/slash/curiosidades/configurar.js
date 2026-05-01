const { 
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const { isManager } = require('../../utils/isManager.js')
const fs = require('fs')
const path = require('path')
const { getEmojis } = require('../../utils/getEmojis.js')

module.exports = {
  name: 'curiosidades.configurar',
  
  async execute(interaction) {
    const icon = getEmojis()

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })

    if (!isManager(interaction.user.id)) {
      return interaction.editReply({
        content: `${icon.error} **|** Você precisa ser \`MANAGER\` para usar esse comando!`
      })
    }

    const filePath = path.join(__dirname, '../../../json/curiosidadesConfig.json')

    let curiosityConfigObj = {}
    try {
      curiosityConfigObj = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
      curiosityConfigObj = { on: false, channelId: null }
    }

    const mode = interaction.options.getString('modo')
    let channel = interaction.options.getChannel('canal')

    if (channel && !channel.isTextBased()) {
      return interaction.editReply({
        content: `${icon.error} **|** Canal inválido! Escolha um canal de texto.`
      })
    }

    if (!mode && !channel) {
      return interaction.editReply({
        content: `${icon.error} **|** Você precisa passar \`modo\` e/ou \`canal\``
      })
    }

    if (mode) {
      curiosityConfigObj.on = mode.toLowerCase() === 'on'
    }

    if (channel) {
      curiosityConfigObj.channelId = channel.id
    }

    if (mode === 'on' && !curiosityConfigObj.channelId) {
      return interaction.editReply({
        content: `${icon.error} **|** Defina um canal antes de ativar!`
      })
    }
    
    interaction.client.curiosityConfig = curiosityConfigObj
    fs.writeFileSync(filePath, JSON.stringify(curiosityConfigObj, null, 2))

    const modeNames = {
      on: 'ON (Ligado)',
      off: 'OFF (Desligado)'
    }

    let updatesMsg = ''
    if (mode) updatesMsg += `- - Modo: ${modeNames[mode]}\n`
    if (channel && curiosityConfigObj.on) updatesMsg += `- - Canal: <#${channel.id}>`

    const embed = new EmbedBuilder()
      .setTitle(`${icon.success} | Nova configuração`)
      .setDescription(`Configuração atualizada:\n\n${updatesMsg}`)
      .setColor(0xa143ff)

    await interaction.editReply({
      embeds: [embed]
    })
  }
}