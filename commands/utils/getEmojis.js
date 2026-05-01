// utils/config.js
const fs = require('fs')
const path = require('path')

const emojisPath = path.join(__dirname, '../../json/icon.json')

function getEmojis() {
  return JSON.parse(fs.readFileSync(emojisPath))
}

module.exports = { getEmojis }