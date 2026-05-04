const fs = require('fs')
const path = require('path')

const { isAllowGuild } = require('../../commands/utils/isAllowGuild.js')
const { getEmojis } = require('../../commands/utils/getEmojis.js')

module.exports = async (msg, client) => {
  const icon = getEmojis()
  
  if (isAllowGuild(client, msg.guild.id)) return true

  await msg.reply(
    `${icon.error} **|** Meus comandos só podem ser usados na **Mafios**!`
  ).catch(() => null)

  return false
}