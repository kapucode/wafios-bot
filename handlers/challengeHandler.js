module.exports = async (msg, client) => {

  if (msg.author.bot) return

  const ch = client.challenge
  if (!ch?.active) return

  if (ch.channelId && msg.channel.id !== ch.channelId) return

  const content = msg.content.trim().toLowerCase()

  // 🔢 NÚMERO
  if (ch.type === 'number') {

    const value = Number(content)

    if (!Number.isNaN(value) && value === ch.answer) {

      ch.active = false
      ch.type = null
      ch.answer = null
      ch.channelId = null

      if (ch.timeout) clearTimeout(ch.timeout)

      return msg.reply({
        embeds: [
          {
            title: '🎉 Acerto!',
            description: 'Você acertou o número!',
            color: 0xbbffa5
          }
        ]
      })
    }
  }

  // 🧠 FRASE
  if (ch.type === 'phrase') {

    if (content === ch.answer) {

      ch.active = false
      ch.type = null
      ch.answer = null
      ch.channelId = null

      if (ch.timeout) clearTimeout(ch.timeout)

      return msg.reply({
        embeds: [
          {
            title: '🎉 Acerto!',
            description: 'Você digitou exatamente a frase correta!',
            color: 0xbbffa5
          }
        ]
      })
    }
  }
}