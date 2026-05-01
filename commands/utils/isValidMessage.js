function isValidMessage(content, lastContent, lastTimestamp) {
  if (!content || typeof content !== 'string') return false

  // 1. Mais de 5 caracteres
  if (content.length <= 5) return false

  // 2. Diferente da última mensagem
  if (content === lastContent) return false

  // 3. Tempo "humanamente possível"
  const now = Date.now()
  const timeDiff = (now - lastTimestamp) / 1000 // em segundos
  const minTime = content.length / 7

  if (timeDiff < minTime) return false

  // 4. Remover caracteres repetidos (kkkk -> k)
  const noRepeat = content.replace(/(.)\1+/g, '$1')

  if (noRepeat.length <= 12) return false

  return true
}

module.exports = { isValidMessage }