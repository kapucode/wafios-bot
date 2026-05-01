const path = require('path')
const filePath = path.join(__dirname, '../../json/allowGuilds.json')

function isAllowGuild(guildId) {
  let allowGuilds = require(filePath)
  return allowGuilds.includes(guildId)
}

module.exports = { isAllowGuild }