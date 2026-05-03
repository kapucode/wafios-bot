const fs = require('fs/promises')

let writing = false
let pending = false

async function saveRngInfo(client, rngBrawlersPath) {
  if (writing) {
    pending = true
    return
  }

  writing = true

  try {
    do {
      pending = false

      await fs.writeFile(
        rngBrawlersPath,
        JSON.stringify(client.rngBrawlers, null, 2)
      )

    } while (pending)

  } catch (err) {
    console.error('Erro ao salvar rngBrawlers:', err)
  } finally {
    writing = false
  }
}

module.exports = { saveRngInfo }