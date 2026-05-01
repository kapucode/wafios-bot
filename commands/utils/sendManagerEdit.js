const { sendDm } = require('./sendDm.js')
const { EmbedBuilder } = require('discord.js')
const path = require('path')
const fs = require('fs')
const fileJSONPath = path.join(__dirname, '../../json/botManagers.json')
const { getEmojis } = require('./getEmojis.js')

async function sendManagerEdit(msg, userObj, add=true, reason) {
  const icon = getEmojis()
  
  let editMsg = {
    msg1: 'adicionado em',
    msg2: 'MANAGER adicionado(a)',
    msg3: 'Adicionado(a)',
    title: 'Novo(a) manager'
  }
  if (!add) {
    editMsg = {
      msg1: 'retirado de',
      msg2: 'MANAGER retirado(a)',
      msg3: 'Retirado(a)',
      title: 'Manager removido(a)'
    }
  }
  
  let msgReason = ''
  if (reason) {
    msgReason += `\n> **Motivo:**
\`${reason}\``
  }
  
  let failDm = []
  let botManagers = JSON.parse(fs.readFileSync(fileJSONPath, "utf8"))
  for (const manager of botManagers) {
    const embed = new EmbedBuilder()
      .setTitle(`${icon.bellnot || '💫'} | ${editMsg.title}!`)
      .setDescription(`Olá, <@${manager.id}>! Tenho um comunicado para você!

Um(a) MANAGER foi ${editMsg.msg1} mim! **MANAGER's podem usar comandos de configuração meus**, e caso uma pessoa errada virar manager, ela pode acabar fazendo coisas erradas!

> **${editMsg.msg2}**:
<@${userObj.id}> (\`${userObj.id}\`)
> **${editMsg.msg3} por**:
<@${msg.author.id}> (\`${msg.author.id}\`) ${msgReason}

-# > __Você está recebendo essa mensagem porque você é MANAGER!__`)
      .setColor(0xa143ff)
      .setThumbnail(userObj.displayAvatarURL())
    
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

module.exports = { sendManagerEdit }