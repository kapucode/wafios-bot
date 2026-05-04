const { isManager } = require('../utils/isManager.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendServerEdit } = require('../utils/sendServerEdit.js')
const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../json/allowGuilds.json')

module.exports = {
  name: 'addserver',
  async execute(msg, args) {

    if (!msg.guild) return
    if (!isManager(msg.client, msg.author.id)) return
  
    const embedCorrectUse = correctUseEmbed(
      'addserver',
      '&addserver [id do servidor]'
    )
  
    const serverId = args[0]?.trim()
  
    if (!serverId) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (!/^\d{17,20}$/.test(serverId)) {
      return msg.reply(':x: **|** ID de servidor inválido.').catch(console.error)
    }
  
    let allowGuilds = []
  
    try {
      allowGuilds = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      allowGuilds = []
    }
  
    if (!Array.isArray(allowGuilds)) allowGuilds = []
  
    if (allowGuilds.includes(serverId)) {
      const errorMsg = await msg.reply(
        ':x: **|** O servidor já está na lista de **servidores permitidos**!'
      ).catch(() => null)
  
      if (errorMsg) {
        setTimeout(() => {
          errorMsg.delete().catch(() => {})
        }, 30000)
      }
  
      return
    }
  
    allowGuilds.push(serverId)
  
    fs.writeFileSync(filePath, JSON.stringify(allowGuilds, null, 2))
  
    sendServerEdit(msg, serverId, true)
  
    msg.reply(
      `:white_check_mark: **|** O servidor \`${serverId}\` foi adicionado à lista de **servidores permitidos**!`
    ).catch(console.error)
  }
}