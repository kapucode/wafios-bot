class Context {
  constructor(data, client) {
    this.client = client

    // Detecta tipo de execução
    this.isInteraction = !!data.isCommand
    this.isMessage = !!data.content

    // Normaliza origem
    this.interaction = this.isInteraction ? data : null
    this.message = this.isMessage ? data : null

    // Usuário
    this.user = this.isInteraction ? data.user : data.author

    // Guild
    this.guild = data.guild

    // Canal
    this.channel = data.channel

    // ID do guild
    this.guildId = data.guild?.id

    // ID do canal
    this.channelId = data.channel?.id

    // Args padronizados (slash ou prefix)
    this.args = []

    // Nome do comando
    this.commandName = null

    this._parse()
  }

  _parse() {
    if (this.isInteraction) {
      this.commandName = this.interaction.commandName
      this.args = this._parseInteractionOptions()
    }

    if (this.isMessage) {
      const prefix = this.client.prefix || "!"
      const content = this.message.content.trim()

      if (!content.startsWith(prefix)) return

      const raw = content.slice(prefix.length).trim()
      const split = raw.split(/ +/g)

      this.commandName = split.shift()?.toLowerCase()
      this.args = split
    }
  }

  _parseInteractionOptions() {
    const opts = this.interaction.options
    if (!opts) return []

    return opts.data?.map(o => o.value) || []
  }

  // 🔥 Responder (unificado)
  async reply(content, options = {}) {
    if (this.isInteraction) {
      if (this.interaction.replied || this.interaction.deferred) {
        return this.interaction.followUp({ content, ...options })
      }

      return this.interaction.reply({ content, ...options })
    }

    return this.message.reply({ content, ...options })
  }

  // 🔥 Defer (slash only)
  async defer(ephemeral = false) {
    if (!this.isInteraction) return
    return this.interaction.deferReply({ ephemeral })
  }

  // 🔥 Editar resposta
  async edit(content, options = {}) {
    if (this.isInteraction) {
      return this.interaction.editReply({ content, ...options })
    }

    return this.message.edit({ content, ...options })
  }

  // 🔥 Permissão rápida
  memberPermissions() {
    if (!this.guild) return null

    if (this.isInteraction) {
      return this.interaction.member?.permissions
    }

    return this.message.member?.permissions
  }

  // 🔥 Checar se é dono do bot
  isOwner() {
    return this.client.ownerId === this.user.id
  }

  // 🔥 Resposta simples tipo embed-safe fallback
  send(content, options = {}) {
    return this.reply(content, options)
  }
}

module.exports = Context