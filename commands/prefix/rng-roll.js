const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')

const { saveRngInfo } = require('../utils/saveRngInfo.js')
const { createRngInfo } = require('../utils/createRngInfo.js')
const { getRandomBrawler } = require('../utils/getRandomBrawler.js')

const { rngBrawlers, rngDisplay, rngChances } = require('../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../json/rngBrawlers.json')
const cooldowns = require('../cooldowns/cooldowns.js')

function getOwnedSet(userRng) {
  return new Set(
    Object.values(userRng.brawlers)
      .flat()
      .map(b => b.name.toLowerCase())
  )
}

function applyLuck(chances, rebirths = 0) {
  const newChances = { ...chances }
  const multiplier = 1 + rebirths

  newChances.epico *= multiplier
  newChances.mitico *= multiplier
  newChances.lendario *= multiplier
  newChances.ultra *= multiplier

  return normalize(newChances)
}

function normalize(chances) {
  const total = Object.values(chances).reduce((a, b) => a + b, 0)

  const result = {}
  for (const key in chances) {
    result[key] = (chances[key] / total) * 100
  }

  return result
}

async function updateNewBrawler(client, userRng, userId, brawler) {
  if (!userRng.brawlers[brawler.category]) {
    userRng.brawlers[brawler.category] = []
  }

  userRng.brawlers[brawler.category].push({
    name: brawler.name
  })

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
      const user = msg.author
      const userId = user.id

      // cooldown
      const key = `${userId}:rng.roll`
      const result = cooldowns['rng.roll'].check(key)

      if (!result.allowed) {
        const seconds = Math.ceil(result.remaining / 1000)
        return msg.reply(
          `⏰ | Calma lá, ${user}! Aguarde **${seconds}s**, você só pode usar esse comando ${cooldowns['rng.roll'].maxUses} vezes por minuto!`
        )
      }

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

      if (ownedSet.size >= totalBrawlers) {
        const embed = new EmbedBuilder()
          .setTitle(`✨ | JOGO ZERADO`)
          .setDescription(`> Você já zerou o jogo, mas pode reiniciar seu progresso para ganhar bônus.

- 🎯 Quantidade de rebirths atualmente: **${userRng.rebirths}**

> 💫 Bônus de rebirth:
- 2x de sorte
- Cargos exclusivos
- Chance de entrar no ranking (\`/rng rebirth ranking\`)`)
          .setColor(0xefff51)

        const btn = new ButtonBuilder()
          .setLabel('Rebirth')
          .setEmoji('🎯')
          .setCustomId(`rebirth:rebirth-rng:${userId}`)
          .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(btn)

        client.rngRolling.delete(userId)

        return msg.reply({
          embeds: [embed],
          components: [row]
        })
      }

      const repeatedChance = Math.max(
        0.1,
        0.4 - (userRng.rebirths || 0) * 0.05
      )

      const list = [...ownedSet]
      const repeated = list.length > 0
        ? Math.random() < repeatedChance
        : false

      let brawler

      if (repeated) {
        const name = list[Math.floor(Math.random() * list.length)]

        for (const cat in rngBrawlers) {
          const found = rngBrawlers[cat].find(
            b => b.name.toLowerCase() === name
          )

          if (found) {
            brawler = { ...found, category: cat }
            break
          }
        }
      } else {
        const luckChances = applyLuck(
          rngChances,
          userRng.rebirths || 0
        )

        let attempts = 0

        do {
          brawler = getRandomBrawler(
            rngBrawlers,
            luckChances,
            true
          )
          attempts++
        } while (
          ownedSet.has(brawler.name.toLowerCase()) &&
          attempts < 10
        )

        if (ownedSet.has(brawler.name.toLowerCase())) {
          const pool = []

          for (const cat in rngBrawlers) {
            for (const item of rngBrawlers[cat]) {
              if (!ownedSet.has(item.name.toLowerCase())) {
                pool.push({ ...item, category: cat })
              }
            }
          }

          if (pool.length > 0) {
            brawler = pool[Math.floor(Math.random() * pool.length)]
          }
        }
      }

      if (!brawler) {
        client.rngRolling.delete(userId)
        return msg.reply('Erro ao gerar brawler.')
      }

      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler)
      }
      
      userRng.totalOpen++

      const embed = new EmbedBuilder()
        .setTitle(repeated ? `👾 | BRAWLER REPETIDO` : `✨ | BRAWLER NOVO`)
        .setDescription(
`${repeated ? 'Poxa! Você rolou um brawler repetido!.' : `Você rolou um brawler novo!`} Para verificar seu inventário, utilize o comando \`/rng inventário\`
-# Dica: quer rolar brawlers mais rápidos? Ao invés de &rng roll, use &rr

- Nome: ${brawler.name}
- Classe: ${rngDisplay[brawler.category] ?? 'Desconhecida'}`
        )
        .setColor(repeated ? 0x8925a2 : 0x00ff99)

      if (brawler.gif) embed.setImage(brawler.gif)

      client.rngRolling.delete(userId)

      return msg.reply({ embeds: [embed] })

    } catch (err) {
      console.error(err)
    }
  }
}