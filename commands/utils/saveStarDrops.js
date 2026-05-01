const fs = require('fs/promises')

let writing = false
let pending = false

async function saveStarDrops(client, starDropsPath) {
  if (writing) {
    pending = true
    return
  }

  writing = true

  try {
    do {
      pending = false

      await fs.writeFile(
        starDropsPath,
        JSON.stringify(client.starDrops, null, 2)
      )

    } while (pending)

  } catch (err) {
    console.error('Erro ao salvar starDrops:', err)
  } finally {
    writing = false
  }
}

module.exports = { saveStarDrops }