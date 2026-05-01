const {
  EmbedBuilder
} = require('discord.js')

const path = require ('path')
const starJsonPath = path.join(__dirname, '../json/starDrops.json')

const { createStarInfo } = require('../commands/utils/createStarInfo.js')
const { saveStarDrops } = require('../commands/utils/saveStarDrops.js')
const { getFormattedDateBR } = require('../commands/utils/getFormattedDateBR.js')
const { openStarDrop } = require('../commands/utils/openStarDrop.js')
const { isValidMessage } = require('../commands/utils/isValidMessage.js')

function updateData(userStar) {
  if (userStar.info.date !== getFormattedDateBR()) {
    userStar.info.date = getFormattedDateBR()
    userStar.info.messages = 0
    userStar.info.goal = 100
    userStar.info.notified = false
  }
}

module.exports = async (msg, client) => {
  // Bloquear em acasos
  if (msg.author.bot) return
  
  const lastMsg = client.lastMessages[msg.author.id]
  const isValid = isValidMessage(
    msg.content,
    lastMsg?.content,
    lastMsg?.timestamp || 0
  )
  
  if (msg.author.id !== '1173408263920951356' && msg.author.id !== '1005925645521534996') return

  if (!msg?.guild || msg?.guild?.id != '1325972840146800660') return
  if (!isValid) return
  
  // Pegar dados do usuário 
  let userStar = client.starDrops[msg.author.id]

  if (!userStar) {
    userStar = createStarInfo(client, msg.author.id)
    if (!userStar) throw new Error('Eu não faço ideia de qual erro deu aqui, mas userStar está como false.')
  }
  
  if (userStar.info.amountOpen >= 5) return
  
  updateData(userStar) // Atualizar dados com base na data
  
  userStar.info.messages++ // Adicionar +1 à quantidade de mensagens
  
  // Verificação se o usuário ppde abrir um star drop
  if (
    userStar.info.messages >= userStar.info.goal
  ) {
    userStar.info.messages = userStar.info.goal
    if (
      userStar.info.amountOpen < 5 &&
      userStar.info.notified !== true
    ) {
      userStar.info.notified = true
      openStarDrop(msg, userStar)
    }
  }
  
  // Salvar Last Message 
  client.lastMessages[msg.author.id] = {
    content: msg.content,
    timestamp: Date.now()
  }
  
  // Salvar dados
  await saveStarDrops(client, starJsonPath)
}