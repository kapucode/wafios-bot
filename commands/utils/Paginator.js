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

    let response
    
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        embeds: [this.render()],
        components: [this.buildRow(this.disabledBtn)]
      })
    } else {
      await interaction.reply({
        embeds: [this.render()],
        components: [this.buildRow(this.disabledBtn)]
      })
    }
    
    // Não adicionar collector se os botões forem desativados
    if (this.disabledBtn) {
      return
    }

    const msg = await interaction.fetchReply()

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
        
        if (action === 'home') {
          this.index = 0
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
        let newEmbed = []
        
        if (this.warnExpireBtn) {
          const currentFooter = this.pages[0].data.footer?.text || ''

          this.pages[0].setFooter({
            text: currentFooter + ' | Botões expirados'
          })
          
          newEmbed.push(this.pages[0])
        }
        
        await msg.edit({
          embeds: newEmbed,
          components: [this.buildRow(true)]
        })
      } catch {}
    })
  }
}

module.exports = Paginator