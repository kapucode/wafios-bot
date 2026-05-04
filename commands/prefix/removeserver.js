const { isManager } = require('../utils/isManager.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendServerEdit } = require('../utils/sendServerEdit.js')
const path = require('path')
const fs = require('fs')
const { getEmojis } = require('../utils/getEmojis.js')
const { saveAllowGuilds } = require('../utils/saveAllowGuilds.js')

const allowGuildsJsonPath = path.join(__dirname, '../../json/allowGuilds.json')

module.exports = {
  name: 'remove.server',
  aliases: ['removeserver', 'rem.server', 'rmv.server', 'remover.server', 'removerserver', 'rmv.sv', 'remover.sv', 'remove.sv', 'removesv'],
  
  async execute(msg, args) {

    if (!msg.guild) return
    if (!isManager(msg.client, msg.author.id)) return

    const icon = getEmojis()
    const client = msg.client

    const serverId = args[0]?.trim()

    const embedCorrectUse = correctUseEmbed(
      'remove server',
      '&remove server [id do servidor]'
    )

    if (!serverId) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }

    if (!/^\d{17,20}$/.test(serverId)) {
      return msg.reply(`${icon.error || ':x:'} **|** ID de servidor inválido.`)
    }
    
    if (!client.allowGuilds.has(serverId)) {
      return await msg.reply(
        `${icon.error || ':x:'} **|** O servidor não está na lista de **servidores permitidos**!`
      ).catch(() => null)
    }

    client.allowGuilds.delete(serverId)

    await saveAllowGuilds(client, allowGuildsJsonPath)

    // await sendServerEdit(msg, serverId, false)

    msg.channel.send(
      `${icon.success || ':white_check_mark:'} **|** O servidor \`${serverId}\` foi retirado da lista de **servidores permitidos**!`
    ).catch(console.error)

  }
}