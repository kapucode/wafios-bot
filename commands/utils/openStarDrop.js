const {
  MessageFlags
} = require('discord.js')
const { CV2StarDrop } = require('./CV2StarDrop.js')
const { saveStarDrops } = require('./saveStarDrops.js')
const path = require('path')
const starJsonPath = path.join(__dirname, '../../json/starDrops.json')

async function openStarDrop(msg, userStar) {
  userStar.info.collected = false
  await saveStarDrops(msg.client, starJsonPath)
  
  const messages = userStar.info.messages
  const goal = userStar.info.goal
  
  const cv2 = CV2StarDrop(msg, userStar)
  msg.reply({
    flags: MessageFlags.IsComponentsV2,
    files: [
      {
        attachment: 'https://c.tenor.com/j2Apftneyx4AAAAd/tenor.gif',
        name: 'gif.gif'
      }
    ],
    components: [cv2]
  })
}

module.exports = { openStarDrop }