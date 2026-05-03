const {
  EmbedBuilder,
  MessageFlags
} = require('discord.js')

const { createRngInfo } = require('../../utils/createRngInfo.js')
const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const Paginator = require('../../utils/Paginator.js')

const { rngDisplay } = require('../../../variables/rngBrawlers.js')

const path = require('path')
const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

module.exports = {
  name: 'rng.inventario',
  
  async execute(interaction, client) {
    await interaction.deferReply()
    
    const user = interaction.user
    
    let userRng = client.rngBrawlers[user.id]
    if (!userRng) {
      userRng = createRngInfo(client, user.id)
      
      if (!userRng) throw new Error('userRng está como false')
      
      saveRngInfo(client, rngBrawlersPath)
    }
    
    // Garante que existe
    if (!userRng.brawlers) {
      userRng.brawlers = {}
    }
    
    let pages = [
      ({ actualPage, totalPages }) =>
        new EmbedBuilder()
          .setTitle(`🏘️ | Página inicial (${actualPage}/${totalPages})`)
          .setDescription(`- Veja o inventário RNG de Brawlers de ${user}!

> Quer informações mais específicas do jogo? Use \`/rng info\`!

> Já zerou o jogo e quer jogar novamente? Dê rebirth (prestígio) usando \`/rng rebirth\``)
    ]
    
    if (Object.keys(userRng.brawlers).length <= 0) {
      pages.push(
        ({ actualPage, totalPages }) =>
          new EmbedBuilder()
            .setTitle(`🎒 | Página vazia (${actualPage}/${totalPages})`)
            .setDescription(`Ah, que pena! Você ainda não tem nenhum brawler! Para começar, use \`/rng roll\`!

-# O jogo de RNG da Mafios não concebe nenhum benefício, é apenas um sistema para diversão.`)
            .setColor(0xc01b1b)
      )
    } else {
      // ✅ Loop seguro (controlado por rngDisplay)
      for (const rarity in rngDisplay) {
        const brawlers = userRng.brawlers[rarity]

        // pula se não existir ou estiver vazio
        if (!Array.isArray(brawlers) || brawlers.length === 0) continue

        let brawlersMsg = ''

        for (const brawler of brawlers) {
          brawlersMsg += `${brawler.emoji} ${brawler.name}\n`
        }

        const display = rngDisplay[rarity]

        // segurança extra (caso rngDisplay esteja quebrado)
        if (!display) {
          console.log('Rarity sem display:', rarity)
          continue
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
    await paginator.start(interaction)
  }
}