const {
  EmbedBuilder,
  MessageFlags
} = require('discord.js')
const { createStarInfo } = require('../../utils/createStarInfo.js')
const { openStarDrop } = require('../../utils/openStarDrop.js')
const { getEmojis } = require('../../utils/getEmojis.js')
const { getNextMidnight } = require('../../utils/getNextMidnight.js')

function toMsg(interaction) {
  return {
    author: interaction.user,
    client: interaction.client,
    guild: interaction.guild,
    member: interaction.member,
    
    reply: (data) => interaction.followUp(data)
  }
}

module.exports = {
  name: 'star_drop.abrir',
  
  async execute(interaction, client) {
    const icon = getEmojis()
    
    let userStar = client.starDrops[interaction.user.id]

    if (!userStar) {
      userStar = createStarInfo(client, interaction.user.id)
      if (!userStar) throw new Error('Eu não faço ideia de qual erro deu aqui, mas userStar está como false.')
    }
    
    if (
      userStar.info.messages < userStar.info.goal &&
      userStar.info.amountOpen < 5
    ) {
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      })
      return await interaction.editReply({
        content: `${icon.error} **|** Para abrir um Star Drop você precisa enviar uma quantia específica de mensagens (${userStar.info.goal}), e você só enviou **${userStar.info.messages}**!`,
      })
    } else if (
      userStar.info.messages >= userStar.info.goal &&
      userStar.info.amountOpen < 5
    ) {
      await interaction.deferReply()
      openStarDrop(toMsg(interaction), userStar)
    } else if (userStar.info.amountOpen >= 5) {
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral
      })
      return await interaction.editReply({
        content: `${icon.error} **|** Você já atingiu seu limite diário de **${userStar.info.amountOpen}** Star Drops abertos hoje! Mas relaxa, <t:${getNextMidnight() / 1000}:R> você poderá abrir mais!`,
      })
    }
  }
}