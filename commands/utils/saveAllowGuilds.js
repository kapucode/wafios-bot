const fs = require('fs/promises')

let writing = false
let pending = false

async function saveAllowGuilds(client, allowGuildsPath) {
  if (writing) {
    pending = true
    return
  }

  writing = true

  try {
    do {
      pending = false

      await fs.writeFile(
        allowGuildsPath,
        JSON.stringify([...client.allowGuilds], null, 2)
      )

    } while (pending)

  } catch (err) {
    console.error('Erro ao salvar allowGuilds:', err)
  } finally {
    writing = false
  }
}

module.exports = { saveAllowGuilds }