const path = require('path')
const fs = require('fs')
const fileJSONPath = path.join(__dirname, '../../json/botManagers.json')
const { EmbedBuilder } = require('discord.js')
const { isKapu } = require('../utils/isKapu.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { sendManagerEdit } = require('../utils/sendManagerEdit.js')
const { getEmojis } = require('../utils/getEmojis.js')

module.exports = {
  name: "addmanager",
  
  async execute(msg, args) {
    if (!msg.guild) return
    if (!isKapu(msg, msg.client)) return
  
    const icon = getEmojis()
  
    const user = args[0]
    const userName = args.slice(1).join(" ")
  
    const embedCorrectUse = correctUseEmbed(
      'addmanager',
      '&addmanager [usuario] [nome do usuario]'
    )
  
    if (!user || !userName) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    const userObj =
      msg.mentions.users.first() ||
      await msg.client.users.fetch(user).catch(() => null)
  
    if (!userObj) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (userObj.id === '1173408263920951356') {
      return msg.reply('🤔 **|** Ei! Esse é você, e você é o meu dono!')
    }
  
    let botManagers = []
  
    try {
      botManagers = JSON.parse(fs.readFileSync(fileJSONPath, "utf8"))
    } catch {
      botManagers = []
    }
  
    if (!Array.isArray(botManagers)) botManagers = []
  
    if (botManagers.some(manager => manager.id === userObj.id)) {
      return msg.reply(`${icon.error || ':x:'} **|** O usuário de ID \`${userObj.id}\` já é \`MANAGER\`!`)
    }
  
    if (userName.length > 30) {
      return msg.reply(`${icon.error || ':x:'} **|** Nome muito grande.`)
    }
  
    botManagers.push({
      name: userName,
      id: userObj.id
    })
  
    fs.writeFileSync(fileJSONPath, JSON.stringify(botManagers, null, 2))
  
    sendManagerEdit(msg, userObj, true)
  
    msg.reply(`${icon.success || ':white_check_mark:'} **|** O(a) usuário(a) de ID \`${userObj.id}\` foi adicionado(a) como \`MANAGER\`!`)
  }
}