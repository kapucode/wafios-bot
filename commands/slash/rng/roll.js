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

      // 📊 estado ANTES do roll
      const allUserBrawlersBefore = Object.values(userRng.brawlers).flat()

      const totalBrawlers = Object.values(rngBrawlers)
        .reduce((acc, list) => acc + list.length, 0)

      const hadAllBefore = allUserBrawlersBefore.length >= totalBrawlers

      // 🔥 repeated só se tiver inventário
      const repeated = allUserBrawlersBefore.length > 0
        ? Math.random() < 0.3
        : false

      let brawler = null

      // 🔴 REPEATED MODE
      if (repeated) {
        brawler = allUserBrawlersBefore[
          Math.floor(Math.random() * allUserBrawlersBefore.length)
        ]
      }

      // 🔵 NORMAL MODE
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

      // 💾 salva só se não for repeated
      if (!repeated) {
        await updateNewBrawler(client, userRng, userId, brawler, icon)
      }

      // 📊 estado DEPOIS do roll
      const allUserBrawlersAfter = Object.values(userRng.brawlers).flat()
      const hasAllNow = allUserBrawlersAfter.length >= totalBrawlers

      // 🔥 CASO 1: já tinha tudo antes e continua tendo
      if (hadAllBefore && hasAllNow) {
        return interaction.editReply({
          content: "👑 Você já tinha todos os brawlers antes do roll."
        })
      }

      // 🔥 CASO 2: acabou de completar agora
      if (!hadAllBefore && hasAllNow) {
        return interaction.followUp({
          content: "🔥 PARABÉNS! Você acabou de completar TODOS os brawlers!"
        })
      }

      console.log({
        userId,
        brawler,
        repeated,
        hadAllBefore,
        hasAllNow
      })

      await interaction.editReply({
        content: 'foi, ve o console'
      })

    } catch (err) {
      console.error(err)
    }
  }
}