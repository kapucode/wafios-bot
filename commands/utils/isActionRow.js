function isActionRow(obj) {
  if (!obj) return false

  const data = obj.data ?? obj // suporta builder ou JSON

  return (
    data.type === 1 && // Action Row
    Array.isArray(data.components)
  )
}

module.exports = { isActionRow }