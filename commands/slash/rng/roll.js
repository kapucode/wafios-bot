const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')

const { rngBrawlers } = require('../../../variables/rngBrawlers.js')
const path = require('path')

const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

// 🔥 checa se já tem
function hasBrawler(userRng, name) {
  return Object.values(userRng.brawlers).flat().some(
    b => b.name.toLowerCase() === name.toLowerCase()
  )
}

async function updateNewBrawler(client, userRng, brawler, icon) {

  if (!userRng.brawlers[brawler.category]) {
    userRng.brawlers[brawler.category] = []
  }

  userRng.brawlers[brawler.category].push({
    name: brawler.name,
    emoji: icon[brawler.name.toLowerCase()] || '❓'
  })

  client.rngBrawlers[userRng.id] = userRng

  await saveRngInfo(client, rngBrawlersPath)
}

module.exports = {
  name: 'rng.roll',

  async execute(interaction, client) {
    try {
      await interaction.deferReply()

      const icon = getEmojis()
      const user = interaction.user

      let userRng = client.rngBrawlers[user.id]
      if (!userRng) {
        userRng = createRngInfo(client, user.id)
      }

      const allUserBrawlers = Object.values(userRng.brawlers).flat()

      // 🔥 regra correta: repeated só existe se tiver inventário
      const canBeRepeated = allUserBrawlers.length > 0
      const repeated = canBeRepeated
        ? Math.random() < 0.3
        : false

      let brawler = null

      // 🔴 REPEATED MODE
      if (repeated) {
        brawler = allUserBrawlers[
          Math.floor(Math.random() * allUserBrawlers.length)
        ]
      }

      // 🔵 NORMAL MODE (SEM REPETIR)
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

      // 💾 salva só se for novo
      if (!repeated) {
        await updateNewBrawler(client, userRng, brawler, icon)
      }

      console.log({
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