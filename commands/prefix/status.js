const { getEmojis } = require('../utils/getEmojis.js')

module.exports = {
  name: 'status',
  aliases: ['stts'],
  
  async execute(msg) {
    const icon = getEmojis()
    msg.reply(`${icon.success} **|** Estou online!`)
  }
}