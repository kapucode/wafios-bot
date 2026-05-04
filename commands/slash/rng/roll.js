const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js')

const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')

const { rngBrawlers, rngDisplay } = require('../../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

// Cooldown
const cooldowns = require('../../cooldowns/cooldowns.js')

// 🔥 catálogo rápido (evita undefined)
function getFromCatalog(name) {
  for (const cat in rngBrawlers) {
    const found = rngBrawlers[cat].find(
      b => b.name.toLowerCase() === name.toLowerCase()
    )
    if (found) return { ...found, category: cat }
  }
  return null
}

// 🔥 inventário seguro (só nomes)
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
    name: brawler.name,
    emoji: icon[brawler.name.toLowerCase()] || '❓'
  })

  client.rngBrawlers[userId] = userRng

  await saveRngInfo(client, rngBrawlersPath)
}

module.exports = {
  name: 'rng.roll',

  async execute(interaction, client) {
    if (
      interaction.user.id !== '1173408263920951356' &&
      interaction.user.id !== '1005925645521534996'
    ) return

    try {
      await interaction.deferReply()
      
      const key = `${interaction.user.id}:rng.roll`

      const result = cooldowns['rng.roll'].check(key)
      
      if (!result.allowed) {
        const seconds = Math.ceil(result.remaining / 1000)
        
        return interaction.editReply({
          content: `⏰ **|** Calma lá, ${interaction.user}! Você pode usar esse comando ${cooldowns['rng.roll'].maxUses} vezes por minuto, aguarde mais **${seconds}s**`
        })
      }
      

      const icon = getEmojis()
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

      // 🚨 JOGO ZERADO (sem RNG)
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
          .setCustomId(`rebirth-rng:${userId}`)
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(rebirthBtn)

        client.rngRolling.delete(userId)

        return interaction.editReply({
          embeds: [embed],
          components: [row]
        })
      }

      const list = [...ownedSet]
      const repeated = list.length > 0 ? Math.random() < 0.7 : false

      let brawler

      // 🔴 REPEATED (AGORA CORRIGIDO)
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

      // 🔥 proteção FINAL contra undefined
      if (!brawler || !brawler.name) {
        console.error('Brawler inválido:', brawler)
        client.rngRolling.delete(userId)
        return interaction.editReply({
          content: 'Erro ao gerar brawler.'
        })
      }

      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler, icon)
      }

      const embed = new EmbedBuilder()
        .setTitle(repeated ? `👾 | BRAWLER REPETIDO` : `✨ | NOVO BRAWLER`)
        .setDescription(
`${repeated ? 'Poxa! Você rolou um brawler repetido!' : 'Você rolou um brawler novo!'} Para verificar seu inventário, utilize o comando \`/rng inventário\`

- **Nome:** ${brawler.name}
- **Classe:** ${rngDisplay[brawler.category] ?? 'Desconhecida'}`
        )
        .setColor(repeated ? 0x8925a2 : 0x00ff99)
        .setImage(brawler.gif ?? null)

      client.rngRolling.delete(userId)

      return interaction.editReply({ embeds: [embed] })

    } catch (err) {
      console.error(err)
    }
  }
}