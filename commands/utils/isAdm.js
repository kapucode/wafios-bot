const { PermissionsBitField } = require('discord.js')

function isAdm(member) {
  if (!member) return false
  return member.permissions.has(PermissionsBitField.Flags.Administrator)
}

module.exports = { isAdm }