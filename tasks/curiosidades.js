const path = require('path')
const fs = require('fs')
const { randint } = require('../commands/utils/randint.js')
const {
  EmbedBuilder
} = require('discord.js')

module.exports = async (client) => {
  setInterval(async () => {
    const agora = new Date()
    const horaBR = (agora.getUTCHours() - 3 + 24) % 24
    const minutos = agora.getUTCMinutes()
    const totalMin = horaBR * 60 + minutos
    const offHourInterval = totalMin >= 22 * 60 || totalMin < 9 * 60
    
    const agoraMs = Date.now()
    
    const channel = client.channels.cache.get(client.curiosityConfig?.channelId)
    
    if (!client?.messageTimestamps) client.messageTimestamps = []
    
    client.messageTimestamps = client.messageTimestamps.filter(
      (timestamp) => agoraMs - timestamp <= 10 * 60 * 1000
      )

    if (offHourInterval) return
    if (!client?.curiosityConfig) return
    if (!client.curiosityConfig?.on) return
    if (client.messageTimestamps.length < 10) return
    if (!channel) return
    if (!client?.curiosities || client.curiosities.length === 0) return

    const {theme, curiosity} = client.curiosities[randint(0, client.curiosities.length - 1)]
    const emojis = ['👾','🎊','🎯','💥','🔥','🌟','🎉','✏️','☘️','🍀']
    const titles = ['Nova curiosidade', 'Curiosidade', 'Para os curiosos', 'Curiosidade novinha', 'Você sabia que...', 'Cheguei com curiosidades!']
    const info = {
      emoji: emojis[randint(0, emojis.length - 1)],
      title: titles[randint(0, titles.length - 1)]
    }
    
    const icon = channel.guild?.iconURL({ dynamic: true })
    const embed = new EmbedBuilder()
      .setTitle(`${info.emoji} | ${info.title}`)
      .setDescription(`Trouxe uma curiosidade novinha, saindo quentinha do forno! Informações abaixo:

- 📋 **Tema:**
${theme}

- ✨ **Curiosidade:**
${curiosity}`)
      .setColor(0xa143ff)
      .setFooter({
        text: channel.guild.name,
        iconURL: icon || undefined
      })
    
    await channel.send({
      embeds: [embed]
    })
  }, 25 * 60 * 1000)
}