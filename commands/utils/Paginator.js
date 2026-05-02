const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js')

const { getEmojis } = require('./getEmojis.js')
const icon = getEmojis()

class Paginator {
  constructor({ pages, time = 60000 }) {
    this.pages = pages
    this.index = 0
    this.time = time
    this.ownerId = null
  }

  buildRow() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`prev:${this.ownerId}`)
        .setEmoji(icon.leftarrow)
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId(`next:${this.ownerId}`)
        .setEmoji(icon.rightarrow)
        .setStyle(ButtonStyle.Primary)
    )
  }

  render() {
    const page = this.pages[this.index]

    return typeof page === 'string'
      ? new EmbedBuilder().setDescription(page)
      : page
  }

  async start(interaction) {
    this.ownerId = interaction.user.id

    const msg = await interaction.reply({
      embeds: [this.render()],
      components: [this.buildRow()],
      fetchReply: true
    })

    const collector = msg.createMessageComponentCollector({
      time: this.time
    })

    collector.on('collect', async i => {
      const [action, ownerId] = i.customId.split(':')

      if (i.user.id !== ownerId) {
        return i.reply({
          content: 'Não é seu menu.',
          ephemeral: true
        })
      }

      if (action === 'prev') {
        this.index--
        if (this.index < 0) this.index = this.pages.length - 1
      }

      if (action === 'next') {
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