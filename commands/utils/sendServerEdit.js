const { sendDm } = require('./sendDm.js')
const { EmbedBuilder } = require('discord.js')
const path = require('path')
const fs = require('fs')
const fileMANAGERPath = path.join(__dirname, '../../json/botManagers.json')
const fileGuildPath = path.join(__dirname, '../../json/allowGuilds.json')
const { getEmojis } = require('./getEmojis.js')

async function sendServerEdit(msg, serverId, add=true) {
  const icon = getEmojis()
  
  let editMsg = {
    msg1: 'adicionado nos',
    msg2: 'Servidor adicionado',
    msg3: 'Adicionado',
    msg4: 'podem ser',
    title: 'Novo servidor!'
  }
  if (!add) {
    editMsg = {
      msg1: 'retirado dos',
      msg2: 'Servidor retirado',
      msg3: 'Retirado',
      msg4: 'não podem mais',
      title: 'Servidor removido!'
    }
  }
  
  let failDm = []
  let botManagers = JSON.parse(fs.readFileSync(fileMANAGERPath, 'utf-8'))
  let guildIconURL
  try {
    let guild = await msg.client.guilds.fetch(serverId)
    guildIconURL = guild.iconURL()
  } catch {
    guildIconURL = null
  }
  
  for (const manager of botManagers) {
    const embed = new EmbedBuilder()
      .setTitle(`${icon.bellnot || '💫'} | ${editMsg.title}!`)
      .setDescription(`Olá, <@${manager.id}>! Tenho um comunicado para você!\n\nUm servidor foi ${editMsg.msg1} servidores que tem permissão de usar meus comandos! **Nesse servidor meus comandos ${editMsg.msg4} ser usados**, tanto slash (/) quanto de prefixo (&).\n\n> **${editMsg.msg2} (ID)**:\n\`${serverId}\`\n> **${editMsg.msg3} por**:\n<@${msg.author.id}> (\`${msg.author.id}\`)\n\n-# > __Você está recebendo essa mensagem porque você é MANAGER!__`)
      .setColor(0xa143ff)
    
    if (guildIconURL) embed.setThumbnail(guildIconURL)
    
    sendDm(msg.client, manager.id, embed, {
      isEmbed: true,
      funcError: (err) => {
        failDm.push({
          failId: manager.id,
          failMsg: err
        })
      }
    })
  }
  
  if (failDm.length > 0) {
    console.log(failDm)
    let msgError = ''
    for (const failManager of failDm) {
      msgError += `\n<@${failManager.failId}> (\`${failManager.failId}\`): ${failManager.failMsg}`
    }
    msg.channel.send(`${icon.error || ':x:'} **|** Falha em enviar DM de aviso para esses MANAGERs:${msgError}`)
  }
}

module.exports = { sendServerEdit }