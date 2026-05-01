async function sendDm(client, userId, message, options = {}) {
  if (!client || !userId || !message) throw new Error('Syntax Error: do you forgot pass some argument of \'sendDm()\'?')
  
  const { funcError = () => {}, isEmbed = false } = options
  
  const user = await client.users.fetch(userId)
  if (!user) return
  
  try {
    if (isEmbed) {
      await user.send({ embeds: [message] })
    } else {
      await user.send(message)
    }
  } catch(err) {
    
    funcError(err)
  }
}

module.exports = { sendDm }