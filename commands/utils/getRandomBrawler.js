const { categoryDisplay } = require('../../variables/dataBrawlers.js')

function getRandomBrawler(dataBrawlers, categoryChances, rng=false) {
  
  if (!rng) {
    const rand = Math.random() * 100
    let cumulative = 0
    let selectedCategory = null
  
    for (const category in categoryChances) {
      cumulative += categoryChances[category]
      if (rand < cumulative) {
        selectedCategory = category
        break
      }
    }
  
    if (!selectedCategory) {
      const keys = Object.keys(dataBrawlers)
      selectedCategory = keys[Math.floor(Math.random() * keys.length)]
    }
  
    const list = dataBrawlers[selectedCategory]
    const index = Math.floor(Math.random() * list.length)
    const brawler = list[index]
  
    return {
      ...brawler,
      category: selectedCategory,
      categoryFormatted: categoryDisplay[selectedCategory] || selectedCategory
    }
  } else {
    const rand = Math.random() * 100
    let cumulative = 0
    let selectedCategory = null
  
    for (const category in categoryChances) {
      cumulative += categoryChances[category]
      if (rand < cumulative) {
        selectedCategory = category
        break
      }
    }
  
    if (!selectedCategory) {
      const keys = Object.keys(dataBrawlers)
      selectedCategory = keys[Math.floor(Math.random() * keys.length)]
    }
  
    const list = dataBrawlers[selectedCategory]
    const index = Math.floor(Math.random() * list.length)
    const brawler = list[index]
  
    return {
      ...brawler,
      category: selectedCategory
    }
    
  }
}

module.exports = { getRandomBrawler }