const path = require('path')

function isAllowGuild(client, guildId) {
  
  return client.allowGuilds.has(guildId) || false 
}

module.exports = { isAllowGuild }