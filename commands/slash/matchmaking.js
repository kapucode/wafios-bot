const {
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { getEmojis } = require('../utils/getEmojis.js')

function getTrophyValue(member) {
  const role = member.roles.cache.find(r =>
    /\d+-\d+k|\d+k\+/i.test(r.name)
  )

  if (!role) return 0

  const name = role.name.toLowerCase()

  // 40-50k
  const range = name.match(/(\d+)-(\d+)k/)
  if (range) {
    const min = parseInt(range[1])
    const max = parseInt(range[2])
    return (min + max) / 2
  }

  // 90k+
  const plus = name.match(/(\d+)k\+/)
  if (plus) {
    return parseInt(plus[1])
  }

  return 0
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('matchmaking')
    .setDescription('「 Auxílio 」Cria equipes balanceadas')
    .addIntegerOption(option =>
      option
        .setName('equipes')
        .setDescription('Quantidade de equipes')
        .setRequired(true)
        .setMinValue(2)
    )
    .addStringOption(option =>
      option
        .setName('pessoas')
        .setDescription('Mencione ou dê o ID das pessoas')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('titulo')
        .setDescription('Título do matchmaking')
        .setMaxLength(250)
    ),

  async execute(interaction) {
    const icon = getEmojis()

    const raw = interaction.options.getString('pessoas')

    // pega menções ou IDs
    const ids = raw.match(/\d{17,20}/g) || []
    
    const uniqueIds = [...new Set(ids)]
    
    const members = []
    
    for (const id of uniqueIds) {

      const member = await interaction.guild.members.fetch(id).catch(() => null)
    
      if (member) {
        members.push({
          user: member.user,
          trophy: getTrophyValue(member)
        })
      }
    
    }
    const title = interaction.options.getString('titulo') || 'Matchmaking'
    
    if (members.length === 0) {
      return interaction.reply({
        content: `${icon.error || ':x:'} | Nenhum usuário válido foi mencionado ou informado por ID.`,
        flags: MessageFlags.Ephemeral
      })
    }

    const amountTeams = interaction.options.getInteger('equipes')

    if (members.length < amountTeams) {
      return interaction.reply({
        content: `${icon.error || ':c:'} | Existem menos pessoas (${members.length}) do que times (${amountTeams}).`,
        flags: MessageFlags.Ephemeral
      })
    }

    if (members.length % amountTeams !== 0) {
      return interaction.reply({
        content: `${icon.error || ':x:'} | Não é possível dividir ${members.length} pessoas em ${amountTeams} times igualmente.`,
        flags: MessageFlags.Ephemeral
      })
    }

    function gerarTimes() {

      const sorted = [...members].sort((a, b) => b.trophy - a.trophy)
    
      const teams = Array.from({ length: amountTeams }, () => [])
    
      sorted.forEach((player, index) => {
    
        const teamIndex = index % amountTeams
    
        teams[teamIndex].push(player)
    
      })
    
      const embed = new EmbedBuilder()
        .setTitle(`⚔️ | ${title}`)
        .setDescription('Times balanceados por troféus!')
        .setColor(0xa143ff)
    
      teams.forEach((team, index) => {
    
        const value = team
          .map(p => `- <@${p.user.id}> **(${p.trophy}k)**`)
          .join('\n')
        
        embed.addFields({
          name: `> Time ${index + 1} ${icon.prettystar || '💫'}`,
          value,
          inline: true
        })
    
      })
    
      return embed
    }

    let currentEmbed = gerarTimes()

    const finish = new ButtonBuilder()
      .setCustomId(`finish:${interaction.user.id}`)
      .setLabel('Finalizar time')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Success)

    const row = new ActionRowBuilder().addComponents(finish)

    const response = await interaction.reply({
      embeds: [currentEmbed],
      components: [row],
      withResponse: true
    })

    const message = response.resource.message

    const collector = message.createMessageComponentCollector({
      time: 300000
    })

    collector.on('collect', async i => {
      if (i.customId === `finish:${interaction.user.id}`) {

        collector.stop()

        const finishedButton = ButtonBuilder.from(finish)
          .setLabel('Time finalizado')
          .setDisabled(true)
        
        const newRow = new ActionRowBuilder().addComponents(finishedButton)
        
        await i.deferUpdate()
        await i.update({
          embeds: [currentEmbed],
          components: [newRow]
        })

      }

    })
  }
}