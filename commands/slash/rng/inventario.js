const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

const { createRngInfo } = require('../../utils/createRngInfo.js')
const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const Paginator = require('../../utils/Paginator.js')

const { rngBrawlers, rngDisplay } = require('../../../variables/rngBrawlers.js')

const path = require('path')
const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

module.exports = {
  name: 'rng.inventario',

  async execute(interaction, client) {
    const icon = getEmojis()
    
    await interaction.deferReply()

    const user = interaction.user

    let userRng = client.rngBrawlers[user.id]

    if (!userRng) {
      userRng = createRngInfo(client, user.id)
      client.rngBrawlers[user.id] = userRng
      await saveRngInfo(client, rngBrawlersPath)
    }

    if (!userRng.brawlers) {
      userRng.brawlers = {}
    }
    const brawlersLength = Object.values(userRng.brawlers)
      .reduce((acc, categoria) => acc + categoria.length, 0)
      
    const totalBrawlers = Object.values(rngBrawlers)
      .reduce((acc, categoria) => acc + categoria.length, 0)
    
    // 📄 página inicial
    let pages = [
      ({ actualPage, totalPages }) =>
        new EmbedBuilder()
          .setTitle(`🏘️ | Página inicial (${actualPage}/${totalPages})`)
          .setColor(0x51d4ff)
          .setDescription(
`- Veja o inventário RNG de Brawlers de ${user}! O usuário possui **${brawlersLength}/${totalBrawlers}** brawlers

> Quer informações mais específicas do jogo? Use \`/rng info\`!

> Já zerou o jogo e quer jogar novamente? Dê rebirth (prestígio) usando \`/rng rebirth\` ${brawlersLength >= totalBrawlers ? `ou clicando no botão abaixo` : ''}`
          )
    ]

    // 📦 páginas por categoria
    
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
    
    let buttons = []
    
    if (brawlersLength >= totalBrawlers) {
      buttons.push(
        new ButtonBuilder()
          .setCustomId(`rebirth-rng:${interaction.user.id}`)
          .setLabel(`Rebirth`)
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Danger)
      )
    }
    
    const paginator = new Paginator({ 
      pages,
      buttons
    })
    await paginator.start(interaction)
  }
}