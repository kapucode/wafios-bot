const { isManager } = require('../utils/isManager.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendServerEdit } = require('../utils/sendServerEdit.js')
const path = require('path')
const fs = require('fs')
const { getEmojis } = require('../utils/getEmojis.js')

const filePath = path.join(__dirname, '../../json/allowGuilds.json')

module.exports = {
  name: 'removeserver',
  
  async execute(msg, args) {

    if (!msg.guild) return
    if (!isManager(msg.client, msg.author.id)) return

    const icon = getEmojis()

    const serverId = args[0]?.trim()

    const embedCorrectUse = correctUseEmbed(
      'removeserver',
      '&removeserver [id do servidor]'
    )

    if (!serverId) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }

    if (!/^\d{17,20}$/.test(serverId)) {
      return msg.reply(`${icon.error || ':x:'} **|** ID de servidor inválido.`)
    }

    let allowGuilds = []

    try {
      allowGuilds = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch {
      allowGuilds = []
    }

    if (!Array.isArray(allowGuilds)) allowGuilds = []

    const exists = allowGuilds.some(id => String(id).trim() === serverId)

    if (!exists) {

      const errorMsg = await msg.reply(
        `${icon.error || ':x:'} **|** O servidor não está na lista de **servidores permitidos**!`
      ).catch(() => null)

      if (errorMsg) {
        setTimeout(() => {
          errorMsg.delete().catch(() => {})
        }, 30000)
      }

      return
    }

    allowGuilds = allowGuilds.filter(id => String(id).trim() !== serverId)

    fs.writeFileSync(filePath, JSON.stringify(allowGuilds, null, 2))

    sendServerEdit(msg, serverId, false)

    msg.channel.send(
      `${icon.success || ':white_check_mark:'} **|** O servidor \`${serverId}\` foi retirado da lista de **servidores permitidos**!`
    ).catch(console.error)

  }
}