async function isKapu(message, client) {
  const app = await client.application.fetch()
  const kapuId = app.owner.id
  return kapuId === message.author.id
}

module.exports = { isKapu }