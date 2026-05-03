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

// 🔥 checa se já tem brawler
function hasBrawler(userRng, name) {
  return Object.values(userRng.brawlers)
    .flat()
    .some(b => b.name.toLowerCase() === name.toLowerCase())
}

// 💾 salva + sincroniza corretamente
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

      const icon = getEmojis()
      const userId = interaction.user.id

      // 🔥 garante userRng
      let userRng = client.rngBrawlers[userId]

      if (!userRng) {
        userRng = createRngInfo(client, userId)
        client.rngBrawlers[userId] = userRng
      }

      const allUserBrawlers = Object.values(userRng.brawlers).flat()

      const totalBrawlers = Object.values(rngBrawlers)
        .reduce((acc, list) => acc + list.length, 0)

      const hasAll = allUserBrawlers.length >= totalBrawlers

      
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
          .setCustomId(`rebirth-rng:${interaction.user.id}`)
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder().addComponents(rebirthBtn)

        return interaction.editReply({
          embeds: [embed],
          components: [row]
        })
      }

      // 🎲 RNG normal
      const repeated =
        allUserBrawlers.length > 0
          ? Math.random() < 0.3
          : false

      let brawler = null

      // 🔴 REPEATED MODE
      if (repeated) {
        brawler =
          allUserBrawlers[
            Math.floor(Math.random() * allUserBrawlers.length)
          ]
      }

      // 🔵 NORMAL MODE
      else {
        const pool = []

        for (const category in rngBrawlers) {
          for (const item of rngBrawlers[category]) {
            if (!hasBrawler(userRng, item.name)) {
              pool.push({ ...item, category })
            }
          }
        }

        // (segurança extra — nunca deveria acontecer por causa do bloqueio acima)
        if (pool.length === 0) return

        brawler = pool[Math.floor(Math.random() * pool.length)]
      }

      // 💾 salva só se não for repeated
      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler, icon)
      }

      const embed = new EmbedBuilder()
        .setTitle(`✨ | NOVO BRAWLER`)
        .setDescription(
`Você ganhou um novo brawler!

- **Nome:** ${brawler.name}
- **Classe:** ${rngDisplay[brawler.category] ?? 'Desconhecida'}`
        )
        .setColor(0x00ff99)
        .setImage(brawler.gif)

      return interaction.editReply({
        embeds: [embed]
      })

    } catch (err) {
      console.error(err)
    }
  }
}