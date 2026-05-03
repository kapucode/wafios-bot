const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')

const { rngBrawlers } = require('../../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

// 🔥 checa se já tem brawler
function hasBrawler(userRng, name) {
  return Object.values(userRng.brawlers).flat().some(
    b => b.name.toLowerCase() === name.toLowerCase()
  )
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

  // 🔥 garante consistência global
  client.rngBrawlers[userId] = userRng

  await saveRngInfo(client, rngBrawlersPath)
}

module.exports = {
  name: 'rng.roll',

  async execute(interaction, client) {
    try {
      await interaction.deferReply()

      const icon = getEmojis()
      const userId = interaction.user.id

      // 🔥 SEMPRE sincroniza corretamente
      let userRng = client.rngBrawlers[userId]

      if (!userRng) {
        userRng = createRngInfo(client, userId)
        client.rngBrawlers[userId] = userRng
      }

      // 🔥 trava identidade (evita bug futuro)
      userRng.id = userId

      const allUserBrawlers = Object.values(userRng.brawlers).flat()

      // 🔥 repeated só existe se tiver inventário
      const repeated = allUserBrawlers.length > 0
        ? Math.random() < 0.3
        : false

      let brawler = null

      // 🔴 REPEATED MODE (só o que já tem)
      if (repeated) {
        brawler = allUserBrawlers[
          Math.floor(Math.random() * allUserBrawlers.length)
        ]
      }

      // 🔵 NORMAL MODE (só o que NÃO tem)
      else {

        const pool = []

        for (const category in rngBrawlers) {
          for (const item of rngBrawlers[category]) {

            if (!hasBrawler(userRng, item.name)) {
              pool.push({
                ...item,
                category
              })
            }
          }
        }

        if (pool.length === 0) {
          return interaction.editReply({
            content: "Você já tem todos os brawlers."
          })
        }

        brawler = pool[Math.floor(Math.random() * pool.length)]
      }

      // 💾 salva só se NÃO for repetido
      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler, icon)
      }

      console.log({
        userId,
        brawler,
        repeated
      })

      await interaction.editReply({
        content: 'foi, ve o console'
      })

    } catch (err) {
      console.error(err)
    }
  }
}