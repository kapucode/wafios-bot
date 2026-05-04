const { 
EmbedBuilder,
MessageFlags } = require("discord.js");
const { isManager } = require('../../utils/isManager.js')
const fs = require('fs')
const path = require('path')
const { getEmojis } = require('../../utils/getEmojis.js')
const pushFilePath = path.join(__dirname, '../../../json/push.json')
const pushModeFilePath = path.join(__dirname, '../../../json/pushMode.json')

module.exports = {
  name: 'push.info',
  
  async execute(interaction, client) {
    const icon = getEmojis()
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    
    if (!isManager(client, interaction.user.id)) return await interaction.reply({
        content: `${icon.error || ':x:'} **|** Você precisa ser \`MANAGER\` do bot para usar esse comando.`,
        flags: MessageFlags.Ephemeral
      })
    
    const push = JSON.parse(fs.readFileSync(pushFilePath))
    const pushMode = JSON.parse(fs.readFileSync(pushModeFilePath))
    
    if (!push || !pushMode) throw new Error('SyntaxError: where is \'push.json\' or \'pushMode.json\'?')
    
    let msgMode = `${icon.success} Sim`
    
    if (pushMode.pushMode === 'off') msgMode = `${icon.error} Não`
    
    const embed = new EmbedBuilder()
      .setTitle(`${icon.prettystar} | Informações do push`)
      .setDescription(`> Informações das configurações do push:

> **Canal de push:**
<#${push.channel}> \`(${push.channel})\`

> **Cargo de push:**
<@&${push.pushRole}> \`(${push.pushRole})\`

> **Tempo de cooldown:**
\`${push.cooldown / 1000 / 60} minutos\`

> **Está ligado:**
${msgMode}`)
      .setColor(0xa143ff)
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.avatarURL({ dynamic: true })
      })
    
    await interaction.editReply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    })
  }
}