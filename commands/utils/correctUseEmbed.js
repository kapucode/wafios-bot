const { EmbedBuilder } = require('discord.js')

function correctUseEmbed(commandName, correctUse) {
  return new EmbedBuilder()
    .setTitle('✅ » Uso correto')
    .setDescription(`> Uso correto do comando \`${commandName}\`:\n- \`${correctUse}\`\n\n>>> \`[parametro]\`  - Parâmetro obrigatório\n\`<parametro>\` - Parâmetro opcional`)
    .setColor(0xa8ffc6)
}

module.exports = { correctUseEmbed }