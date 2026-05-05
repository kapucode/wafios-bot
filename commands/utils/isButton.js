function isButton(obj) {
  if (!obj) return false

  const data = obj.data ?? obj

  return (
    data.type === 2 && // Button
    typeof data.style !== 'undefined'
  )
}

module.exports = { isButton }