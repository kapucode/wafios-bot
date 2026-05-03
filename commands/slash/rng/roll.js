const { getRandomBrawler } = require('../../utils/getRandomBrawler.js')
const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')

const { rngBrawlers, rngChances } = require('../../../variables/rngBrawlers.js')

const path = require('path')
const rngBrawlersPath = path.join(__dirname, '../../../json/rngBrawlers.json')

module.exports = {
  name: 'rng.roll',
  
  async execute(interaction, client) {
    try {
      await interaction.deferReply()
      
      // Emojis
      const icon = getEmojis()
      
      // Usuário que deu o roll
      const user = interaction.user
      
      // Objeto do usuário de rngBrawlers
      let userRng = client.rngBrawlers[user.id]
      if (!userRng) {
        userRng = createRngInfo(client, user.id)
      }
      
      // Brawler que o usuário pegou agora
      const getBrawler = getRandomBrawler(rngBrawlers, rngChances, rng=true)
      
      if (!getBrawler) {
        return await interaction.editReply({
          content: `${icon.error} **|** Não consegui sortear um brawler para você! Tente novamente. Se o erro persistir, contate a equipe staff.`
        })
      }
      
      if (!userRng?.brawlers[getBrawler.category]) {
        userRng.brawlers[getBrawler.category] = []
      }
      
      console.log(userRng.brawlers[getBrawler.category])
      userRng.brawlers[getBrawler.category].append(
        {
          name: getBrawler.name,
          emoji: icon[getBrawler.name.toLowerCase()] || '❓'
        }
      )
      
      await saveRngInfo(client, rngBrawlersPath) // Salvar brawler
      
      console.log(userRng)
      await interaction.editReply({
        content: 'foi, ve o console'
      })
    } catch (err) {
      console.error(err)
    }
  }
}