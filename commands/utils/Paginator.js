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
    this.buttons = buttons.slice(1, 3) 
  }

  buildRow(disabled = false) {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`prev:${this.ownerId}`)
          .setEmoji(icon.leftarrow)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(disabled),
  
        new ButtonBuilder()
          .setCustomId(`home:${this.ownerId}`)
          .setEmoji(icon.home)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(disabled),
  
        new ButtonBuilder()
          .setCustomId(`next:${this.ownerId}`)
          .setEmoji(icon.rightarrow)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(disabled),
          
        ...this.buttons
      )
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
      throw new Error('Paginator: página inválida (não é EmbedBuilder)')
    }

    return result
  }

  async send(target, payload) {
    // 🔥 interaction
    if (target.reply || target.deferred !== undefined) {
      if (target.deferred || target.replied) {
        return target.editReply(payload)
      } else {
        return target.reply(payload)
      }
    }

    // 🔥 message
    return target.channel.send(payload)
  }

  async fetchMessage(target, sentMsg) {
    // interaction
    if (target.fetchReply) {
      return target.fetchReply()
    }

    // message já é a msg enviada
    return sentMsg
  }

  async start(target) {
    this.ownerId = target.user?.id || target.author?.id

    const embed = this.render()

    const payload = {
      embeds: [embed],
      components: [this.buildRow(this.disabledBtn)]
    }

    const sent = await this.send(target, payload)
    const msg = await this.fetchMessage(target, sent)

    if (this.disabledBtn) return

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

        const embed = this.render()

        await i.update({
          embeds: [embed],
          components: [this.buildRow()]
        })

      } catch (err) {
        console.error('Paginator collect error:', err)

        if (!i.replied && !i.deferred) {
          await i.reply({
            content: 'Erro ao atualizar página.',
            flags: MessageFlags.Ephemeral
          }).catch(() => {})
        }
      }
    })

    collector.on('end', async () => {
      try {
        const embed = this.render()

        if (this.warnExpireBtn) {
          const currentFooter = embed.data.footer?.text || ''

          embed.setFooter({
            text: currentFooter === ''
              ? 'Botões expirados'
              : currentFooter + ' | Botões expirados'
          })
        }

        await msg.edit({
          embeds: [embed],
          components: [this.buildRow(true)]
        })

      } catch (err) {
        console.error('Paginator end error:', err)
      }
    })
  }
}

module.exports = Paginator