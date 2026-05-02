const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags
} = require('discord.js')

const { getEmojis } = require('./getEmojis.js')
const icon = getEmojis()

class Paginator {
  constructor({ pages, time = 60000 }) {
    this.pages = pages
    this.index = 0
    this.time = time
    this.ownerId = null
    this.ended = false
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
  
    // se for função → executa passando contexto
    if (typeof page === 'function') {
      return page({
        actualPage: this.index,
        totalPages: this.pages.length
      })
    }
  
    return page
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
          content: `${icon.error} **|** Os botões não são seus!`,
          flags: MessageFlags.Ephemeral
        })
      }
      
      if (this.ended) {
        return i.reply({
          content: `${icon.error} **|** Os dados da interação sumiram, use o comando novamente!`,
          flags: MessageFlags.Ephemeral
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
    
    collector.on('end', () => {
      
    })
  }
}

module.exports = Paginator