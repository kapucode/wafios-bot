const { MessageFlags } = require('discord.js')
const { isManager } = require('../../utils/isManager.js')
const path = require('path')
const fs = require('fs')
const { getEmojis } = require('../../utils/getEmojis.js')

module.exports = {
  name: 'push.modo',
  
  async execute(interaction, client) {
    const icon = getEmojis()
    
    if (!isManager(client, interaction.user.id)) return interaction.reply({ 
      content: `${icon.error || ':x:'} **|** Você precisa ser \`MANAGER\` do bot para usar esse comando!`,
      flags: MessageFlags.Ephemeral
    })
    
    const newMode = interaction.options.getString('modo')
    const filePath = path.join(__dirname, '../../../json/pushMode.json')
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const actualMode = json.pushMode || 'off'
    
    if (newMode.toLowerCase() === actualMode.toLowerCase()) {
      let modeMsg
      switch (actualMode) {
        case 'on':
          modeMsg = '`ON (Ligado)`'
          break;
        case 'off':
          modeMsg = '`OFF (Desligado)`'
          break
      }
      
      interaction.reply({
        content: `${icon.success || ':white_check_mark:'} **|** O push já está ${modeMsg}`,
        flags: MessageFlags.Ephemeral
      })
      return
    }
    
    const msgNewMode = newMode === 'on' ? '`ON (Ligado)`' : '`OFF (Desligado)`'
    const newModeObj = { pushMode: newMode  }
    fs.writeFileSync(filePath, JSON.stringify(newModeObj, null, 2))
    interaction.reply({
      content: `${icon.success || ':white_check_mark:'} **|** Você definiu o **modo de push** como ${msgNewMode}!`,
      flags: MessageFlags.Ephemeral
    })
  }
}