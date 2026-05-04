const fs = require('fs')
const path = require('path')

const allowUtilPath = path.join(__dirname, '../../json/allowGuilds.json')

module.exports = async (msg, client) => {
  let allowGuilds = []

  try {
    allowGuilds = JSON.parse(fs.readFileSync(allowUtilPath, 'utf-8'))
  } catch {
    allowGuilds = []
  }

  const isAllowed = allowGuilds.includes(msg.guild.id)

  if (isAllowed) return true

  const errorMsg = await msg.channel.send(
    '💥 **|** Espera aí, o que eu estou fazendo aqui?! Eu sou um bot da **MAFIOS**!'
  ).catch(() => null)

  setTimeout(async () => {
    await errorMsg?.delete().catch(() => {})
    await msg.guild.leave().catch(() => {})
  }, 10000)

  return false
}