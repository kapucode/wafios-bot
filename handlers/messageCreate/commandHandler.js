const { isManager } = require('../../commands/utils/isManager.js')

module.exports = async (msg, client) => {
  const defaultPrefix = "&"

  if (msg.author.bot) return

  const content = msg.content

  let command, args

  const normalize = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

  // 🔍 procura comandos com prefixo custom
  for (const cmdData of client.prefixCommands.values()) {
    if (!cmdData.prefixes) continue

    const prefixes = Array.isArray(cmdData.prefixes)
      ? cmdData.prefixes
      : [cmdData.prefixes]

    for (const p of prefixes) {
      if (!content.startsWith(p)) continue

      const sliced = content.slice(p.length).trim().split(/ +/)
      if (!sliced.length) return

      const base = normalize(sliced[0])
      const possibleSub = sliced[1] ? normalize(sliced[1]) : null

      let fullCmd = base
      let isSubcommand = false

      // ✅ só usa subcomando se existir
      if (possibleSub && client.prefixCommands.has(`${base}.${possibleSub}`)) {
        fullCmd = `${base}.${possibleSub}`
        isSubcommand = true
      }

      command =
        client.prefixCommands.get(fullCmd) ||
        [...client.prefixCommands.values()].find(
          (c) => c.name === fullCmd || c.aliases?.includes(fullCmd)
        )

      if (!command) return

      // ✅ args corretos agora
      args = isSubcommand ? sliced.slice(2) : sliced.slice(1)

      break
    }

    if (command) break
  }

  // 🔁 fallback padrão
  if (!command) {
    if (!content.startsWith(defaultPrefix)) return

    const sliced = content.slice(defaultPrefix.length).trim().split(/ +/)
    if (!sliced.length) return

    const base = sliced[0].toLowerCase()
    const possibleSub = sliced[1]?.toLowerCase()

    let fullCmd = base
    let isSubcommand = false

    if (possibleSub && client.prefixCommands.has(`${base}.${possibleSub}`)) {
      fullCmd = `${base}.${possibleSub}`
      isSubcommand = true
    }

    command = client.prefixCommands.get(fullCmd)
    if (!command) return

    args = isSubcommand ? sliced.slice(2) : sliced.slice(1)
  }

  // 🔒 comandos em teste
  if (command.test) {
    if (!isManager(client, msg.author.id)) {
      const testMsg = await msg
        .reply(`🛠️ **|** Esse comando ainda não foi disponibilizado para uso!`)
        .catch(() => null)

      setTimeout(() => {
        testMsg?.delete().catch(() => null)
      }, 30000)

      return
    }
  }

  try {
    await command.execute(msg, args)
  } catch (err) {
    console.error('Erro ao executar comando:', err)
  }
}