const fs = require('fs/promises')

let writing = false
let pending = false

async function saveManagers(client, managersPath) {
  if (writing) {
    pending = true
    return
  }

  writing = true

  try {
    do {
      pending = false
      
      let managers = []
      for (const [id, name] of client.managers) {
        managers.push({
          name,
          id
        })
      }

      await fs.writeFile(
        managersPath,
        JSON.stringify(managers, null, 2)
      )

    } while (pending)

  } catch (err) {
    console.error('Erro ao salvar managers:', err)
  } finally {
    writing = false
  }
}

module.exports = { saveManagers }