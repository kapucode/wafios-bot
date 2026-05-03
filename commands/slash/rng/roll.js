const {
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder
} = require('discord.js')

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
        const embed = new EmbedBuilder()
          .setTitle(`✨ | Zerou o jogo`)
          .setDescription(`Você zerou o jogo! Caso queira continuar jogando, você pode dar um rebirth.
Os rebirths reiniciam todos seus brawlers do RNG, mas há benefícios:
- A cada rebirth você ganha **2x mais sorte**
- Cargos exclusivos
- Você pode entrar no **ranking de rebirths** (\`/rng rebirth ranking\`)

> Para dar rebirth, use o botão abaixo ou o comando \`/rng rebirth\``)
          .setColor(0xefff51)
        
        const rebirthBtn = new ButtonBuilder()
          .setLabel('Rebirth')
          .setCustomId(`rebirth-rng:${interaction.user.id}`)
          .setEmoji('🎯')
        
        const row = new ActionRowBuilder()
          .addComponent(rebirthBtn)
        if (pool.length === 0) {
          return interaction.editReply({
            embeds: [embed],
            components: [row]
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
          embeds: [embed],
          components: [row]
        })
      }

      // 🔥 CASO 2: acabou de completar agora
      embed.setTitle(`✨ | PARABÉNS! Zerou o jogo`)
      
      if (!hadAllBefore && hasAllNow) {
        return interaction.followUp({
          embeds: [embed],
          components: [row]
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