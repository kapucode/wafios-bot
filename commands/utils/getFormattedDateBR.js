function getFormattedDateBR(format = 'MM-DD-YY') {
  const d = new Date()

  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).formatToParts(d)

  const dateObj = {}
  parts.forEach(({ type, value }) => {
    if (type !== 'literal') dateObj[type] = value
  })

  const formats = {
    'DD-MM-YY': `${dateObj.day}-${dateObj.month}-${dateObj.year}`,
    'MM-DD-YY': `${dateObj.month}-${dateObj.day}-${dateObj.year}`,
    'YY-MM-DD': `${dateObj.year}-${dateObj.month}-${dateObj.day}`
  }

  return formats[format] || formats['DD-MM-YY']
}

module.exports = { getFormattedDateBR }