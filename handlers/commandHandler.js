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
        cmd = sliced.shift().toLowerCase()
  
        if (cmd === cmdData.name || cmdData.aliases?.includes(cmd)) {
          command = cmdData
          args = sliced
          break
        }
      }
    }
  
    if (command) break
  }

  // 🔁 se não achou comando com prefixo próprio, usa o padrão
  if (!command) {
    if (!content.startsWith(defaultPrefix)) return

    const sliced = content.slice(defaultPrefix.length).trim().split(/ +/)
    cmd = sliced.shift().toLowerCase()

    command = client.prefixCommands.get(cmd)
    args = sliced

    if (!command) return
  }

  // 🔒 comandos em teste
  if (command.test) {
    if (!client.managers?.some(m => m.id === msg.author.id)) {
      const testMsg = await msg.reply(`🛠️ **|** Esse comando está em fase de teste!`).catch(() => null)

      setTimeout(() => {
        testMsg?.delete().catch(() => null)
      }, 30000)

      return
    }
  }

  command.execute(msg, args)
}