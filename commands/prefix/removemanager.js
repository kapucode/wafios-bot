const path = require('path')
const fs = require('fs')
const managersJsonPath = path.join(__dirname, '../../json/botManagers.json')
const { EmbedBuilder } = require('discord.js')
const { isKapu } = require('../utils/isKapu.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendManagerEdit } = require('../utils/sendManagerEdit.js')
const { getEmojis } = require('../utils/getEmojis.js')
const { saveManagers } = require('../utils/saveManagers.js')


module.exports = {
  name: "remove.manager",
  aliases: ['rem.manager', 'rmv.manager', 'removemanager', 'rmvmanager', 'remover.manager', 'rmv.mngr'],
  
  async execute(msg, args) {
    if (!msg.guild) return
    if (!isKapu(msg, msg.client)) return
  
    const icon = getEmojis()
    const client = msg.client
    
    const arg1 = args[0]
  
    const user =
      msg.mentions.users.first() ||
      await msg.client.users.fetch(arg1).catch(() => null)
    const reason = args.join(' ') || 'Motivo não especificado'
  
    const embedCorrectUse = correctUseEmbed(
      'remove manager',
      '&remove manager [usuario] <motivo>'
    )
  
    if (!user) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (user.id === '1173408263920951356') {
      return msg.reply('🤔 **|** Ei! Esse é você, e você é o meu dono!')
    }
  
    if (!client.managers.get(user.id)) {
      return msg.reply(
        `${icon.error || ':x:'} **|** O usuário de ID \`${user.id}\` não é \`MANAGER\`!`
      )
    }
  
    client.managers.delete(user.id)
  
    await saveManagers(client, managersJsonPath)
  
    await sendManagerEdit(msg, user, false, reason)
  
    msg.reply(
      `${icon.success || ':white_check_mark:'} **|** O usuário \`${user.id}\` não é mais \`MANAGER\`!`
    ).catch(console.error)
  }
  
}