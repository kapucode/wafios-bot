const {
  MessageFlags,
  EmbedBuilder
} = require('discord.js')

const { dataBrawlers, categoryChances } = require('../variables/dataBrawlers.js')
const { getRandomBrawler } = require('../commands/utils/getRandomBrawler.js')
const { saveStarDrops } = require('../commands/utils/saveStarDrops.js')
const { CV2StarDrop } = require('../commands/utils/CV2StarDrop.js') // AJUSTA ISSO
const path = require('path')

const starJsonPath = path.join(__dirname, '../json/starDrops.json')

async function updateBrawlerRole({
  member,
  dataBrawlers,
  newRoleId
}) {
  if (!member || !dataBrawlers) return false

  const validRoleIds = new Set(
    Object.values(dataBrawlers).flat().map(b => b.roleId)
  )

  const rolesToRemove = member.roles.cache.filter(role =>
    validRoleIds.has(role.id)
  )

  if (rolesToRemove.size) {
    await member.roles.remove(rolesToRemove)
  }

  if (!newRoleId || !validRoleIds.has(newRoleId)) {
    return false
  }

  if (!member.roles.cache.has(newRoleId)) {
    await member.roles.add(newRoleId)
  }

  return true
}

module.exports = {
  id: 'collect-stardrop',

  execute: async (interaction, client) => {
    if (!interaction.member) return
    
    const [, userId, timestamp] = interaction.customId.split(':')

    if (Date.now() - Number(timestamp) > 10 * 60 * 1000) {
      return interaction.reply({
        content: `:x: **|** Dados do botão expiraram. Use \`/star_drop abrir\` para abrir o Star Drop.`,
        flags: MessageFlags.Ephemeral
      })
    }

    const userStar = client.starDrops[interaction.user.id]
    if (!userStar) return

    // 🔒 proteção básica contra spam
    if (userStar.info.collected) {
      return interaction.reply({
        content: 'Você já coletou esse Star Drop.',
        flags: MessageFlags.Ephemeral
      })
    }

    userStar.info.collected = true

    const brawler = getRandomBrawler(dataBrawlers, categoryChances)
    const member = interaction.member

    // salva o brawler completo
    userStar.actual = brawler

    await updateBrawlerRole({
      member,
      dataBrawlers,
      newRoleId: brawler.roleId
    })
    userStar.info.notified = false
    userStar.info.goal += 100
    userStar.info.amountOpen++
    userStar.totalOpen++

    // 🧩 recria UI com botão desabilitado
    const msgFake = { author: interaction.user }
    const cv2 = CV2StarDrop(msgFake, userStar, true)

    // 1. edita mensagem original
    await interaction.update({
      components: [cv2]
    })

    // 2. manda recompensa
    const embed = new EmbedBuilder()
      .setTitle(`🌟 › NOVO BRAWLER!`)
      .setDescription(`> Parabéns! Você abriu um Star Drop e liberou o(a) Brawler **${brawler.name}**! Informações:
- **Brawler**: <@&${brawler.roleId}>
- **Classe**: ${brawler.categoryFormatted}
- **Benefício**: ${brawler.gives}
- **Chance**: ${categoryChances[brawler.category]}%`)
      .setColor(Math.floor(Math.random() * 0xffffff))
      .setImage(brawler.gif)
    
    await interaction.followUp({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    })

    await saveStarDrops(client, starJsonPath)
  }
}