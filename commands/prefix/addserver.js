const { isManager } = require('../utils/isManager.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendServerEdit } = require('../utils/sendServerEdit.js')
const { saveAllowGuilds } = require('../utils/saveAllowGuilds.js')
const { getEmojis } = require('../utils/getEmojis.js')

const path = require('path')
const fs = require('fs')
const allowGuildsJsonPath = path.join(__dirname, '../../json/allowGuilds.json')

module.exports = {
  name: 'add.server',
  aliases: ['addserver'],
  
  async execute(msg, args) {

    if (!msg.guild) return
    if (!isManager(msg.client, msg.author.id)) return
    
    const client = msg.client
  
    const embedCorrectUse = correctUseEmbed(
      'add server',
      '&add server [id do servidor]'
    )
  
    const serverId = args[0]?.trim()
  
    if (!serverId) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (!/^\d{17,20}$/.test(serverId)) {
      return msg.reply(`${icon.error} **|** ID de servidor inválido.`).catch(console.error)
    }
  
    if (client.allowGuilds.has(serverId)) {
      return await msg.reply(
        `${icon.error} **|** O servidor já está na lista de **servidores permitidos**!`
      ).catch(() => null)
    }
  
    client.allowGuilds.set(serverId)
  
    await saveAllowGuilds(client, allowGuildsJsonPath)
  
    // sendServerEdit(msg, serverId, true)
  
    msg.reply(
      `:white_check_mark: **|** O servidor \`${serverId}\` foi adicionado à lista de **servidores permitidos**!`
    ).catch(console.error)
  }
}