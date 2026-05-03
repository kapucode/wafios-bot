module.exports = async (msg, client) => {
  const defaultPrefix = "&"

  if (msg.author.bot) return

  const content = msg.content

  let command, args, cmd

  // 🔍 tenta encontrar comando com prefixo próprio primeiro
  for (const cmdData of client.prefixCommands.values()) {
    if (!cmdData.prefix) continue

    const prefixes = Array.isArray(cmdData.prefix)
      ? cmdData.prefix
      : [cmdData.prefix]

    for (const p of prefixes) {
      if (content.startsWith(p)) {
        const sliced = content.slice(p.length).trim().split(/ +/)
        
        const normalize = (str) =>
          str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        const base = normalize(sliced.shift())
        const sub = normalize(sliced[0])
        
        const fullCmd = sub ? `${base}.${sub}` : base

        cmd = fullCmd

        if (cmd === cmdData.name || cmdData.aliases?.includes(cmd)) {
          command = cmdData
          args = sliced.slice(1) // remove subcmd se existir
          break
        }
      }
    }

    if (command) break
  }

  // 🔁 fallback padrão
  if (!command) {
    if (!content.startsWith(defaultPrefix)) return

    const sliced = content.slice(defaultPrefix.length).trim().split(/ +/)
    const base = sliced.shift().toLowerCase()
    const sub = sliced[0]?.toLowerCase()

    const fullCmd = sub ? `${base}.${sub}` : base

    command = client.prefixCommands.get(fullCmd)

    if (!command) return

    args = sliced.slice(1)
  }

  // 🔒 comandos em teste
  if (command.test) {
    if (!client.managers?.some(m => m.id === msg.author.id)) {
      const testMsg = await msg
        .reply(`🛠️ **|** Esse comando está em fase de teste!`)
        .catch(() => null)

      setTimeout(() => {
        testMsg?.delete().catch(() => null)
      }, 30000)

      return
    }
  }

  command.execute(msg, args)
}