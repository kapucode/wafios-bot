const { getRandomBrawler } = require('../utils/getRandomBrawler.js')

const { rngBrawlers, rngChances } = require('../../variables/rngBrawlers.js')

module.exports = {
  name: 'teste',
  
  async execute(msg, client) {
    console.log(
      getRandomBrawler(rngBrawlers, rngChances, true)
    )
  }
}