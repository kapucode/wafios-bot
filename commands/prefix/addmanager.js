const path = require('path')
const fs = require('fs')
const managersJsonPath = path.join(__dirname, '../../json/botManagers.json')
const { EmbedBuilder } = require('discord.js')
const { isKapu } = require('../utils/isKapu.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { saveManagers } = require('../utils/saveManagers.js')
const { sendManagerEdit } = require('../utils/sendManagerEdit.js')
const { getEmojis } = require('../utils/getEmojis.js')

module.exports = {
  name: "add.manager",
  aliases: ['addmanager'],
  
  async execute(msg, args) {
    if (!msg.guild) return
    if (!isKapu(msg, msg.client)) return
  
    const icon = getEmojis()
    const client = msg.client
  
    const user = 
      msg.mentions.users.first() ||
      await msg.client.users.fetch(user).catch(() => null)
    const userName = args.slice(1).join(" ")
  
    const embedCorrectUse = correctUseEmbed(
      'addmanager',
      '&addmanager [usuario] [nome do usuario]'
    )
  
    if (!user || !userName) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (!user) {
      return msg.reply({ embeds: [embedCorrectUse] }).catch(console.error)
    }
  
    if (user.id === '1173408263920951356') {
      return msg.reply('🤔 **|** Ei! Esse é você, e você é o meu dono!')
    }
  
    if (client.managers.get(user.id)) {
      return msg.reply(`${icon.error || ':x:'} **|** O usuário de ID \`${user.id}\` já é \`MANAGER\`!`)
    }
  
    if (userName.length > 30) {
      return msg.reply(`${icon.error || ':x:'} **|** Não são permitidos nomes com mais de 30 caracteres.`)
    }
  
    client.managers.set(user.id, userName)
  
    await saveManagers(client, managersJsonPath)
  
    // await sendManagerEdit(msg, user, true)
  
    msg.reply(`${icon.success || ':white_check_mark:'} **|** O(a) usuário(a) de ID \`${user.id}\` foi adicionado(a) como \`MANAGER\`!`)
  }
}