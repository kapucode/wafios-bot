const { EmbedBuilder } = require('discord.js')
const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { isManager } = require('../utils/isManager.js')
const { isKapu } = require('../utils/isKapu.js')

module.exports = {
  name: 'cum',
  prefix: ['+', '&'],
  aliases: ['gozar', 'gozo'],
  async execute(msg, args) {
    // if (!isManager(msg.author.id)) return
    
    const embedCorrectUse = correctUseEmbed(
      'cum',
      '+cum [pessoa]'
    )
    
    const client = msg.client
    
    const user = msg?.mentions.users.first() ||
    client.users.cache.get(args[0]) ||
    await client.users.fetch(args[0]).catch(() => null)
  
    if (!user) {
      return msg.reply({
        embeds: [embedCorrectUse]
      })
    }
    
    const dateExpires = new Date(2026, 4, 3) // 3 de maio
    const timestampExpires = dateExpires.getTime()
    const timestampSec = Math.floor(dateExpires.getTime() / 1000)
    if (timestampExpires <= Date.now()) {
      return
    } 
    
    const embed = new EmbedBuilder()
      .setDescription(`💦 ${msg.author} **gozou em** ${user}!`)
      .setImage("https://c.tenor.com/JYhT7w8MhfgAAAAd/tenor.gif")
      .setColor(0xd2bbbb)
    
    if (user === client.user) {
      embed.setDescription(`😡 ${msg.author} **tentou gozar em mim! Como ousa?!**`)
      embed.setImage('https://media.tenor.com/HK1S9-yv-XAAAAAi/puppy-day.gif')
      embed.setColor(0xab0000)
    }
    
    msg.reply({
      embeds: [embed]
    })
    
    const msgWillExpire = await msg.reply(`⚠️ › Esse comando será deletado <t:${timestampSec}:R>! Aproveite os últimos dias de uso.`)
    setTimeout(async () => {
      await msgWillExpire.delete().catch(() => {})
    }, 5000);
  }
}