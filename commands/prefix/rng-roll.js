const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')

const { saveRngInfo } = require('../utils/saveRngInfo.js')
const { createRngInfo } = require('../utils/createRngInfo.js')
const { getEmojis } = require('../utils/getEmojis.js')

const { rngBrawlers, rngDisplay } = require('../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../json/rngBrawlers.json')

// Cooldown 
const cooldowns = require('../cooldowns/cooldowns.js')

// 🔥 catálogo rápido
function getFromCatalog(name) {
  for (const cat in rngBrawlers) {
    const found = rngBrawlers[cat].find(
      b => b.name.toLowerCase() === name.toLowerCase()
    )
    if (found) return { ...found, category: cat }
  }
  return null
}

// 🔥 inventário seguro
function getOwnedSet(userRng) {
  return new Set(
    Object.values(userRng.brawlers)
      .flat()
      .map(b => b.name.toLowerCase())
  )
}

// 💾 salva
async function updateNewBrawler(client, userRng, userId, brawler, icon) {
  if (!userRng.brawlers[brawler.category]) {
    userRng.brawlers[brawler.category] = []
  }

  userRng.brawlers[brawler.category].push({
    name: brawler.name
  })
  
  userRng.totalOpen++

  client.rngBrawlers[userId] = userRng

  await saveRngInfo(client, rngBrawlersPath)
}

module.exports = {
  name: 'rng.roll',
  aliases: ['rr'],
  prefixes: ['+', '&', '.', ','],
  test: true,

  async execute(msg, args) {
    
    const client = msg.client

    try {
      const key = `${msg.author.id}:rng.roll`

      const result = cooldowns['rng.roll'].check(key)
      
      if (!result.allowed) {
        const seconds = Math.ceil(result.remaining / 1000)
        
        return msg.channel.send({
          content: `⏰ **|** Calma lá, ${msg.author}! Você pode usar esse comando ${cooldowns['rng.roll'].maxUses} vezes por minuto, aguarde mais **${seconds}s**`
        })
      }
      
      const icon = getEmojis()
      const userId = msg.author.id

      client.rngRolling ??= new Set()
      if (client.rngRolling.has(userId)) return
      client.rngRolling.add(userId)

      let userRng = client.rngBrawlers[userId]

      if (!userRng) {
        userRng = createRngInfo(client, userId)
        client.rngBrawlers[userId] = userRng
      }

      const ownedSet = getOwnedSet(userRng)

      const totalBrawlers = Object.values(rngBrawlers)
        .reduce((a, b) => a + b.length, 0)

      const hasAll = ownedSet.size >= totalBrawlers

      // 🚨 JOGO ZERADO
      if (hasAll) {
        const embed = new EmbedBuilder()
          .setTitle(`✨ | JOGO ZERADO`)
          .setDescription(
`Você já possui **todos** os brawlers.

Use \`/rng rebirth\` para reiniciar sua progressão e ganhar bônus:
- 2x mais sorte
- Cargos exclusivos
- Ranking de rebirths (\`/rng rebirth ranking\`)`
          )
          .setColor(0xefff51)

        const rebirthBtn = new ButtonBuilder()
          .setLabel('Resetar')
          .setCustomId(`rebirth:rebirth-rng:${userId}`)
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(rebirthBtn)

        client.rngRolling.delete(userId)

        return msg.reply({
          embeds: [embed],
          components: [row]
        })
      }

      const list = [...ownedSet]
      const repeated = list.length > 0 ? Math.random() < 0.7 : false

      let brawler

      // 🔴 REPEATED
      if (repeated) {
        const name = list[Math.floor(Math.random() * list.length)]
        brawler = getFromCatalog(name)
      }

      // 🔵 NORMAL MODE
      else {
        const pool = []

        for (const cat in rngBrawlers) {
          for (const item of rngBrawlers[cat]) {
            if (!ownedSet.has(item.name.toLowerCase())) {
              pool.push({ ...item, category: cat })
            }
          }
        }

        if (pool.length === 0) {
          client.rngRolling.delete(userId)
          return
        }

        brawler = pool[Math.floor(Math.random() * pool.length)]
      }

      if (!brawler || !brawler.name) {
        console.error('Brawler inválido:', brawler)
        client.rngRolling.delete(userId)

        return msg.reply('Erro ao gerar brawler.')
      }

      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler, icon)
      }

      const embed = new EmbedBuilder()
        .setTitle(repeated ? `👾 | BRAWLER REPETIDO` : `✨ | NOVO BRAWLER`)
        .setDescription(
`${repeated ? 'Poxa! Você rolou um brawler repetido!' : 'Você rolou um brawler novo!'} Para verificar seu inventário, utilize o comando \`/rng inventário\`
-# Dica: quer rolar brawlers mais rápidos? Ao invés de &rng roll, use &rr

- **Nome:** ${brawler.name}
- **Classe:** ${rngDisplay[brawler.category] ?? 'Desconhecida'}`
        )
        .setColor(repeated ? 0x8925a2 : 0x00ff99)
        .setImage(brawler.gif ?? null)

      client.rngRolling.delete(userId)

      return msg.reply({ embeds: [embed] })

    } catch (err) {
      console.error(err)
    }
  }
}