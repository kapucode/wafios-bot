const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')

const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const { getRandomBrawler } = require('../../utils/getRandomBrawler.js')

const { rngBrawlers, rngDisplay, rngChances } = require('../../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

// cooldown
const cooldowns = require('../../cooldowns/cooldowns.js')

// inventário seguro
function getOwnedSet(userRng) {
  return new Set(
    Object.values(userRng.brawlers)
      .flat()
      .map(b => b.name.toLowerCase())
  )
}

// sorte
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

// salva
async function updateNewBrawler(client, userRng, userId, brawler) {
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
  test: true,

  async execute(interaction, client) {
    try {
      await interaction.deferReply()

      const key = `${interaction.user.id}:rng.roll`
      const result = cooldowns['rng.roll'].check(key)

      if (!result.allowed) {
        const seconds = Math.ceil(result.remaining / 1000)

        return interaction.editReply({
          content: `⏰ **|** Calma lá, ${interaction.user}! Aguarde **${seconds}s**`
        })
      }

      const userId = interaction.user.id

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

      // jogo zerado
      if (hasAll) {
        const embed = new EmbedBuilder()
          .setTitle(`✨ | JOGO ZERADO`)
          .setDescription(
`Você já possui todos os brawlers.

Use \`/rng rebirth\` para resetar e ganhar bônus.`
          )
          .setColor(0xefff51)

        const rebirthBtn = new ButtonBuilder()
          .setLabel('Resetar')
          .setCustomId(`rebirth:rebirth-rng:${userId}`)
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(rebirthBtn)

        client.rngRolling.delete(userId)

        return interaction.editReply({
          embeds: [embed],
          components: [row]
        })
      }

      // 🔥 repeated balanceado
      const repeatedChance = Math.max(
        0.1,
        0.4 - (userRng.rebirths || 0) * 0.05
      )

      const list = [...ownedSet]
      const repeated = list.length > 0 ? Math.random() < repeatedChance : false

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
        // 🔥 RNG com sorte
        const luckChances = applyLuck(
          rngChances,
          userRng.rebirths || 0
        )

        let attempts = 0
        const maxAttempts = 10

        do {
          brawler = getRandomBrawler(
            rngBrawlers,
            luckChances,
            true
          )
          attempts++
        } while (
          ownedSet.has(brawler.name.toLowerCase()) &&
          attempts < maxAttempts
        )

        // fallback
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

      if (!brawler || !brawler.name) {
        client.rngRolling.delete(userId)
        return interaction.editReply({
          content: 'Erro ao gerar brawler.'
        })
      }

      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler)
      }

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

      return interaction.editReply({ embeds: [embed] })

    } catch (err) {
      console.error(err)
    }
  }
}