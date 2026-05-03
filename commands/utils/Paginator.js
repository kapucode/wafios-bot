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
  constructor({ pages, time = 60000, disabledBtn = false }) {
    this.pages = pages
    this.index = 0
    this.time = time
    this.ownerId = null
    this.disabledBtn = disabledBtn
  }

  buildRow(disabled = false) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`prev:${this.ownerId}`)
        .setEmoji(icon.leftarrow)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled),

      new ButtonBuilder()
        .setCustomId(`next:${this.ownerId}`)
        .setEmoji(icon.rightarrow)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled)
    )
  }

  render() {
    const page = this.pages[this.index]

    if (typeof page === 'function') {
      return page({
        actualPage: this.index + 1,
        totalPages: this.pages.length
      })
    }

    return page
  }

  async start(interaction) {
    this.ownerId = interaction.user.id

    const response = await interaction.reply({
      embeds: [this.render()],
      components: [this.buildRow(disabledBtn)],
      withResponse: true
    })
    
    // Não adicionar collector se os botões forem desativados
    if (disabledBtn) {
      return
    }

    const msg = response.resource.message

    const collector = msg.createMessageComponentCollector({
      time: this.time
    })

    collector.on('collect', async i => {
      try {
        const [action, ownerId] = i.customId.split(':')

        if (i.user.id !== ownerId) {
          return i.reply({
            content: `${icon.error} **|** Os botões não são seus!`,
            flags: MessageFlags.Ephemeral
          }).catch(() => {})
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
        }).catch(() => {})

      } catch (err) {
        console.log('Paginator error:', err)
      }
    })

    collector.on('end', async () => {
      try {
        await msg.edit({
          components: [this.buildRow(true)]
        })
      } catch {}
    })
  }
}

module.exports = Paginator