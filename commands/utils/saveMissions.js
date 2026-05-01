
const fs = require('fs/promises')

let writing = false

async function saveMissions(client, missionsPath) {
  if (writing) return // ignora chamadas duplicadas
  
  writing = true
  
  try {
    const missionsArray = Array.from(client.missions.values())
    
    await fs.writeFile(  
      missionsPath,  
      JSON.stringify(missionsArray, null, 2)  
    )
    
  } catch (err) {
    console.error('Erro ao salvar missions:', err)
  } finally {
    writing = false
  }
}

module.exports = { saveMissions }