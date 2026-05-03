const {
  EmbedBuilder
} = require('discord.js')

const { createRngInfo } = require('../utils/createRngInfo.js')
const { saveRngInfo } = require('../utils/saveRngInfo.js')
const { getEmojis } = require('../utils/getEmojis.js')
const Paginator = require('../utils/Paginator.js')

const { rngBrawlers, rngDisplay } = require('../../variables/rngBrawlers.js')

const path = require('path')
const rngBrawlersPath = path.join(__dirname, '../json/rngBrawlers.json')

module.exports = {
  name: 'rng.inventario',
  aliases: ['rng.inv'],

  async execute(msg, args) {
    const client = msg.client
    
    const icon = getEmojis()

    const userId = msg.author.id

    if (
      userId !== '1173408263920951356' &&
      userId !== '1005925645521534996'
    ) return

    // ⚠️ prefix não usa deferReply
    const user = msg.author

    let userRng = client.rngBrawlers[user.id]

    if (!userRng) {
      userRng = createRngInfo(client, user.id)
      client.rngBrawlers[user.id] = userRng
      await saveRngInfo(client, rngBrawlersPath)
    }

    if (!userRng.brawlers) {
      userRng.brawlers = {}
    }

    // 📄 página inicial
    let pages = [
      ({ actualPage, totalPages }) =>
        new EmbedBuilder()
          .setTitle(`🏘️ | Página inicial (${actualPage}/${totalPages})`)
          .setColor(0x51d4ff)
          .setDescription(
`- Veja o inventário RNG de Brawlers de ${user}!

> Quer informações mais específicas do jogo? Use \`&rng info\`!

> Já zerou o jogo e quer jogar novamente? Dê rebirth (prestígio) usando \`&rng rebirth\``
          )
    ]

    // 🎒 vazio
    if (Object.keys(userRng.brawlers).length <= 0) {
      pages.push(
        ({ actualPage, totalPages }) =>
          new EmbedBuilder()
            .setTitle(`🎒 | Página vazia (${actualPage}/${totalPages})`)
            .setDescription(
`Ah, que pena! Você ainda não tem nenhum brawler! Para começar, use \`&rng roll\`!

-# O jogo de RNG da Mafios não concebe nenhum benefício, é apenas um sistema para diversão.`
            )
            .setColor(0xc01b1b)
      )
    }

    // 📦 páginas por categoria
    else {
      for (const rarity in rngBrawlers) {

        const display = rngDisplay[rarity]
        if (!display) continue

        const userBrawlersRarity = userRng.brawlers[rarity] || []

        let brawlersMsg = ''

        for (const brawler of rngBrawlers[rarity]) {

          const has = userBrawlersRarity.some(
            b => b.name.toLowerCase() === brawler.name.toLowerCase()
          )

          brawlersMsg += `${has ? icon[brawler.name.toLowerCase()] || '❓' : '❌'} ${has ? `**${brawler.name}**` : `*${brawler.name} (não possui)*`}\n\n`
        }

        pages.push(({ actualPage, totalPages }) =>
          new EmbedBuilder()
            .setTitle(`🎒 | ${display.toUpperCase()} (${actualPage}/${totalPages})`)
            .setDescription(brawlersMsg || 'Nenhum brawler nessa categoria.')
            .setColor(0x924c19)
        )
      }
    }

    const paginator = new Paginator({ pages })

    // ⚠️ adapter simples para paginator (msg em vez de interaction)
    await paginator.start(msg)
  }
}