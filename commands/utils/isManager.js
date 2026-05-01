const path = require('path')
const fs = require('fs')
const filePath = path.join(__dirname, '../../json/botManagers.json')


function isManager(id) {
  let botManagers = []
  
  try {
    botManagers = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    botManagers = []
  }
  return botManagers.some(user => user?.id === id)
}

module.exports = { isManager }