const {
  EmbedBuilder,
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

      const allUserBrawlersBefore = Object.values(userRng.brawlers).flat()

      const totalBrawlers = Object.values(rngBrawlers)
        .reduce((acc, list) => acc + list.length, 0)

      const hadAllBefore = allUserBrawlersBefore.length >= totalBrawlers

      const repeated =
        allUserBrawlersBefore.length > 0
          ? Math.random() < 0.3
          : false

      let brawler = null
      let embed = null
      let row = null

      // 🔴 REPEATED MODE
      if (repeated) {
        brawler =
          allUserBrawlersBefore[
            Math.floor(Math.random() * allUserBrawlersBefore.length)
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

        // 🔥 zerou o jogo (base real: pool vazio)
        if (pool.length === 0) {
          embed = new EmbedBuilder()
            .setTitle(`✨ | Zerou o jogo`)
            .setDescription(
`Você zerou o jogo! Caso queira continuar jogando, você pode dar um rebirth.
Os rebirths reiniciam todos seus brawlers do RNG, mas há benefícios:
- A cada rebirth você ganha **2x mais sorte**
- Cargos exclusivos
- Você pode entrar no **ranking de rebirths** (\`/rng rebirth ranking\`)

> Para dar rebirth, use o botão abaixo ou o comando \`/rng rebirth\``
            )
            .setColor(0xefff51)

          const rebirthBtn = new ButtonBuilder()
            .setLabel('Rebirth')
            .setCustomId(`rebirth-rng:${interaction.user.id}`)
            .setEmoji('🎯')

          row = new ActionRowBuilder().addComponents(rebirthBtn)

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

      const allUserBrawlersAfter = Object.values(userRng.brawlers).flat()
      const hasAllNow = allUserBrawlersAfter.length >= totalBrawlers

      // 🔥 embed padrão do roll
      embed = new EmbedBuilder()
        .setTitle(`✨ | Você ganhou um brawler!`)
        .setDescription(`Você recebeu **${brawler.name}**`)
        .setColor(0x00ff99)

      // 🔥 já tinha tudo antes e continua tendo
      if (hadAllBefore && hasAllNow) {
        return interaction.editReply({
          embeds: [embed]
        })
      }

      // 🔥 acabou de completar agora
      if (!hadAllBefore && hasAllNow) {
        embed.setTitle(`✨ | PARABÉNS! Zerou o jogo`)
      }

      await interaction.editReply({
        embeds: [embed]
      })

    } catch (err) {
      console.error(err)
    }
  }
}