const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js')
const { getEmojis } = require('./getEmojis.js')
const icon = getEmojis()

class Paginator {
  constructor({ pages, time=6000 }) {
    this.pages = pages
    this.index = 0
    this.time = time
  }
  
  buildRow() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setEmoji(icon.leftarrow)
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('next')
        .setEmoji(icon.rightarrow)
        .setStyle(ButtonStyle.Primary)
    )
  }
  
  render() {
    return this.pages[this.index]
  }
  
  async start(interaction) {
    const msg = await interaction.reply({
      embeds: [this.render()],
      components: [this.buildRow()],
      fetchReply: true
    })

    const collector = msg.createMessageComponentCollector({
      time: this.time
    })

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: 'Não é seu menu.', ephemeral: true })

      if (i.customId === 'prev') {
        this.index--
        if (this.index < 0) this.index = this.pages.length - 1
      }

      if (i.customId === 'next') {
        this.index++
        if (this.index >= this.pages.length) this.index = 0
      }

      await i.update({
        embeds: [this.render()],
        components: [this.buildRow()]
      })
    })
  }
}

module.exports = Paginator