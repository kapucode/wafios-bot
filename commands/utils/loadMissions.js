const path = require('path')
const fs = require('fs/promises')

async function loadMissions() {
  const missionsPath = path.join(__dirname, '../missions')

  const files = await fs.readdir(missionsPath)

  const missionsMap = new Map()

  for (const file of files) {
    const fullPath = path.join(missionsPath, file)

    const stat = await fs.stat(fullPath)

    if (stat.isDirectory()) continue
    if (!file.endsWith('.js')) continue

    try {
      delete require.cache[require.resolve(fullPath)]
      const mod = require(fullPath)

      if (mod && mod.name) {
        missionsMap.set(mod.name, mod)
      }
    } catch (err) {
      console.log(`Erro carregando missão ${file}:`, err.message)
    }
  }

  console.log(`✅ Missões carregadas: ${missionsMap.size}`)

  return missionsMap
}

module.exports = { loadMissions }