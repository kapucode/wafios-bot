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
    warnExpireBtn = true
  }) {
    this.pages = pages
    this.index = 0
    this.time = time
    this.ownerId = null
    this.disabledBtn = disabledBtn
    this.warnExpireBtn = warnExpireBtn
  }

  buildRow(disabled = false) {
    return new ActionRowBuilder().addComponents(
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
        .setDisabled(disabled)
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

  async start(interaction) {
    this.ownerId = interaction.user.id

    const embed = this.render()

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        embeds: [embed],
        components: [this.buildRow(this.disabledBtn)]
      })
    } else {
      await interaction.reply({
        embeds: [embed],
        components: [this.buildRow(this.disabledBtn)]
      })
    }

    if (this.disabledBtn) return

    const msg = await interaction.fetchReply()

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

        // responde pra não dar "interaction failed"
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
            text: currentFooter + ' | Botões expirados'
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