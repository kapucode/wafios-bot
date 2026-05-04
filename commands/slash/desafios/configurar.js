const { 
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const { isManager } = require('../../utils/isManager.js')
const fs = require('fs')
const path = require('path')
const { getEmojis } = require('../../utils/getEmojis.js')

module.exports = {
  name: 'desafios.configurar',
  
  async execute(interaction, client) {
    const icon = getEmojis()

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })

    // 🔒 Permissão
    if (!isManager(client, interaction.user.id)) {
      return interaction.editReply({
        content: `${icon.error} **|** Você precisa ser \`MANAGER\` para usar esse comando!`
      })
    }

    // 📁 Caminho do arquivo
    const filePath = path.join(__dirname, '../../../json/challengesConfig.json')

    // 📥 Lê config com fallback seguro
    let challengesConfigObj = {
      on: false,
      channelId: null
    }

    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8')
        challengesConfigObj = JSON.parse(data)
      }
    } catch (err) {
      console.error('Erro ao ler config:', err)
    }

    // 📥 Argumentos
    const mode = interaction.options.getString('modo') // 'on' | 'off' | null
    let channel = interaction.options.getChannel('canal')

    // 🔁 Se não veio canal, usa o salvo
    if (!channel && challengesConfigObj.channelId) {
      channel = { id: challengesConfigObj.channelId }
    }

    // ❌ Nenhum argumento
    if (!mode && !channel) {
      return interaction.editReply({
        content: `${icon.error} **|** Você precisa passar pelo menos um argumento (\`modo\` ou \`canal\`)`
      })
    }

    // 🔄 Atualizações
    let updatedMode = false
    let updatedChannel = false

    // Atualiza modo
    if (mode) {
      if (!['on', 'off'].includes(mode)) {
        return interaction.editReply({
          content: `${icon.error} **|** Modo inválido! Use \`on\` ou \`off\`.`
        })
      }

      challengesConfigObj.on = mode === 'on'
      updatedMode = true
    }

    // Atualiza canal
    if (channel) {
      challengesConfigObj.channelId = channel.id
      updatedChannel = true
    }

    // ⚠️ Validação importante
    if (challengesConfigObj.on && !challengesConfigObj.channelId) {
      return interaction.editReply({
        content: `${icon.error} **|** Você precisa definir um canal antes de ativar os desafios!`
      })
    }

    // 💾 Salva
    try {
      fs.writeFileSync(filePath, JSON.stringify(challengesConfigObj, null, 2))
      interaction.client.challengesConfig = challengesConfigObj
    } catch (err) {
      console.error('Erro ao salvar config:', err)
      return interaction.editReply({
        content: `${icon.error} **|** Erro ao salvar a configuração.`
      })
    }

    // 🧾 Mensagem
    const modeNames = {
      on: 'ON (Ligado)',
      off: 'OFF (Desligado)'
    }

    let updatesMsg = ''

    if (updatedMode) {
      updatesMsg += `- - Modo: ${modeNames[mode]}\n`
    }

    if (updatedChannel) {
      updatesMsg += `- - Canal: <#${challengesConfigObj.channelId}>\n`
    }

    if (!updatesMsg) {
      updatesMsg = '- - Nenhuma alteração feita'
    }

    // 📦 Embed
    const embed = new EmbedBuilder()
      .setTitle(`${icon.success} | Configuração atualizada`)
      .setDescription(`Você atualizou a configuração dos desafios!

**Alterações:**
${updatesMsg}`)
      .setColor(0xa143ff)

    return interaction.editReply({
      embeds: [embed]
    })
  }
}