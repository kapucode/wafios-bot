const { getRandomBrawler } = require('../../utils/getRandomBrawler.js')
const { saveRngInfo } = require('../../utils/saveRngInfo.js')
const { createRngInfo } = require('../../utils/createRngInfo.js')
const { getEmojis } = require('../../utils/getEmojis.js')

const { rngBrawlers, rngChances } = require('../../../variables/rngBrawlers.js')

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
      let userStar = client.rngBrawlers[user.id]
      if (!userStar) {
        userStar = createRngInfo(client, user.id)
      }
      
      // Brawler que o usuário pegou agora
      const getBrawler = getRandomBrawler(rngBrawlers, rngChances, rng=true)
      
      if (!getBrawler) {
        return await interaction.editReply({
          content: `${icon.error} **|** Não consegui sortear um brawler para você! Tente novamente. Se o erro persistir, contate a equipe staff.`
        })
      }
      
      console.log(getBrawler)
      await interaction.editReply({
        content: 'foi, ve o console'
      })
    } catch (err) {
      console.error(err)
    }
  }
}