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
  constructor({
    pages,
    time = 3 * 60 * 1000,
    disabledBtn = false,
    warnExpireBtn = true,
    buttons = []
  }) {
    this.pages = pages
    this.index = 0
    this.time = time
    this.ownerId = null
    this.disabledBtn = disabledBtn
    this.warnExpireBtn = warnExpireBtn
    this.buttons = buttons.slice(0, 2)
  }

  buildRow(disabled = false) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`paginator:prev:${this.ownerId}`)
        .setEmoji(icon.leftarrow)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled),

      new ButtonBuilder()
        .setCustomId(`paginator:home:${this.ownerId}`)
        .setEmoji(icon.home)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled),

      new ButtonBuilder()
        .setCustomId(`paginator:next:${this.ownerId}`)
        .setEmoji(icon.rightarrow)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled),

      ...this.buttons
    )
  }

  disableAllRows(rows) {
    if (!Array.isArray(rows)) return []

    return rows.map(row => {
      const newRow = new ActionRowBuilder()

      row.components.forEach(comp => {
        newRow.addComponents(
          ButtonBuilder.from(comp).setDisabled(true)
        )
      })

      return newRow
    })
  }

  render() {
    const page = this.pages[this.index]

    const result = typeof page === 'function'
      ? page({
          actualPage: this.index + 1,
          totalPages: this.pages.length
        })
      : page

    if (!(result instanceof EmbedBuilder)) {
      throw new Error('Paginator: página inválida')
    }

    return result
  }

  async send(target, payload) {
    if (target.reply || target.deferred !== undefined) {
      if (target.deferred || target.replied) {
        return target.editReply(payload)
      } else {
        return target.reply(payload)
      }
    }

    return target.channel.send(payload)
  }

  async fetchMessage(target, sentMsg) {
    if (target.fetchReply) {
      return target.fetchReply()
    }

    return sentMsg
  }

  async start(target) {
    this.ownerId = target.user?.id || target.author?.id

    const payload = {
      embeds: [this.render()],
      components: [this.buildRow(this.disabledBtn)]
    }

    const sent = await this.send(target, payload)
    const msg = await this.fetchMessage(target, sent)

    if (this.disabledBtn) return

    const collector = msg.createMessageComponentCollector({
      time: this.time
    })

    collector.on('collect', async i => {
      const parts = i.customId.split(':')

      // 🔥 só trata paginator
      if (parts[0] !== 'paginator') return

      const [, action, ownerId] = parts

      // 🔥 usuário errado
      if (i.user.id !== ownerId) {
        return i.reply({
          content: `${icon.error} **|** Esse botão não é seu.`,
          flags: MessageFlags.Ephemeral
        }).catch(() => {})
      }

      // 🔥 responde rápido
      await i.deferUpdate()

      try {
        if (action === 'prev') {
          this.index = (this.index - 1 + this.pages.length) % this.pages.length
        }

        if (action === 'home') {
          this.index = 0
        }

        if (action === 'next') {
          this.index = (this.index + 1) % this.pages.length
        }

        await i.editReply({
          embeds: [this.render()],
          components: [this.buildRow()]
        })

      } catch (err) {
        console.error('Paginator collect error:', err)
      }
    })

    collector.on('end', async () => {
      try {
        const embed = this.render()

        if (this.warnExpireBtn) {
          const currentFooter = embed.data.footer?.text || ''

          embed.setFooter({
            text: currentFooter
              ? currentFooter + ' | Botões expirados'
              : 'Botões expirados'
          })
        }

        await msg.edit({
          embeds: [embed],
          components: this.disableAllRows(msg.components)
        })

      } catch (err) {
        console.error('Paginator end error:', err)
      }
    })
  }
}

module.exports = Paginator