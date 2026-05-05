const { 
SlashCommandBuilder,
EmbedBuilder,
MessageFlags,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require('discord.js')
const { randint } = require('../utils/randint.js')
const { isManager } = require('../utils/isManager.js')
const path = require('path')
const fs = require('fs')
const fileMapsPath = path.join(__dirname, '../../json/mapasBrawl.json')

const states = new Map()

function filterMaps(mapsObj, filter='all') {
  if (filter === 'all') return mapsObj
  if (['casualspecial', 'specialcasual'].includes(filter)) {
    return mapsObj.filter(map => map.type === 'special' || map.type === 'casual')
  }
  if (['casualten', 'tencasual'].includes(filter)) {
    return mapsObj.filter(map => map.type === 'tenplayers' || map.type === 'casual')
  }
  if (['specialten', 'tenspecial'].includes(filter)) {
    return mapsObj.filter(map => map.type === 'tenplayers' || map.type === 'special')
  }
  
  return mapsObj.filter(map => map.type === filter)
}

function randomMaps(mapsObj) {
  const chosenMode = mapsObj[randint(0, mapsObj.length - 1)];
  const chosenMap = chosenMode.maps[randint(0, chosenMode.maps.length - 1)];
  return {
    emoji: chosenMode.emoji,
    name: chosenMode.name,
    label: chosenMode.label,
    map: chosenMap
  };
}

function embedMaps(maps, interaction, rerolls=0) {
  let message = '';
  for (const map of maps) {
    if (!message) message += `- ${map.emoji} **${map.label}**\n> ${map.map}`;
    else message += `\n\n- ${map.emoji} **${map.label}**\n> ${map.map}`;
  }

  return new EmbedBuilder()
    .setTitle('🗺️ | Mapas sortidos')
    .setDescription(message)
    .setColor(0xa143ff)
    .setFooter({
      text: `Resorteado ${rerolls} vezes`,
      iconURL: interaction.user.avatarURL()
    })
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('mapas')
    .setDescription('「 Auxílio 」Dá mapas aleatórios')
    .addIntegerOption(option => 
      option
        .setName('quantidade')
        .setDescription('Quantidade de mapas aleatórios')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(15)
    )
    .addStringOption(option =>
      option 
        .setName('tipo_modo')
        .setDescription('Se você quer modos casuais, especiais, combate ou todos.')
        .addChoices(
          { name: 'Todos modos', value:'all' },
          { name: 'Casuais (3x3)', value:'casual' },
          { name: 'Especiais (hóquei, basquete, etc)', value:'special' },
          { name: 'Combate', value:'tenplayers' },
          { name: 'Casuais e especiais', value:'casualspecial' },
          { name: 'Casuais e combate', value:'casualten' },
          { name: 'Especiais e combate', value:'specialten' }
        )
    )
    .addStringOption(option =>
      option 
        .setName('repetidos')
        .setDescription('Se pode ter modos repetidos')
        .addChoices(
          { name: 'Sim', value:'true' },
          { name: 'Não', value:'false' }
        )
    )
    .addStringOption(option =>
      option 
        .setName('ephemeral')
        .setDescription('Se a mensagem será visível só para você')
        .addChoices(
          { name: 'Sim', value:'true' },
          { name: 'Não', value:'false' }
        )
    ),
    
  async execute(interaction) {
    const ephemeral  = interaction.options.getString('ephemeral') === 'true' ? true : false
    const repetidos  = interaction.options.getString('repetidos') === 'true' ? true : false
    const filterMode  = interaction.options.getString('tipo_modo') || 'casual'
    let quantity = interaction.options.getInteger('quantidade')
    let mapsObj = filterMaps(JSON.parse(fs.readFileSync(fileMapsPath)), filterMode)
    const msgErrorLimit = quantity > mapsObj.length && !repetidos ? { status: true, lengthMaps: mapsObj.length } : { status: false }
    let maps = []
    
    await interaction.deferReply({
      flags: ephemeral ? MessageFlags.Ephemeral : MessageFlags.None
    })
    
    if (mapsObj.length < quantity && !repetidos) {
      quantity = mapsObj.length
    }
    
    for (let i=1; i <= quantity; i++) {
      const chosenObj = randomMaps(mapsObj)
      maps.push(chosenObj)
      if (!repetidos) {
        mapsObj = mapsObj.filter(modo => modo.name !== chosenObj.name)
      }
    }
    
    // BOTÕES
    const rerollButton = new ButtonBuilder()
      .setCustomId(`reroll-maps:${interaction.user.id}`)
      .setLabel('Resortear')
      .setEmoji('🔄')
      .setStyle(ButtonStyle.Primary)
    
    const finishButton = new ButtonBuilder()
      .setCustomId(`finish-maps:${interaction.user.id}`)
      .setLabel('Fechar mapas')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Success)
    
    const row = new ActionRowBuilder()
      .addComponents(finishButton, rerollButton)
    
    
    const msg = await interaction.editReply({
      embeds: [embedMaps(maps, interaction, 0)],
      components: [row]
    })

    
    states.set(msg.id, { rerolls: 0, repetidos: repetidos, filterMode: filterMode })
    if (msgErrorLimit.status) {
      await interaction.followUp({
        content: `A quantidade máxima de modos que podem ser escolhidos **sem repetir** é ${msgErrorLimit.lengthMaps}, então eu dei somente ${msgErrorLimit.lengthMaps} mapas para você!`,
        flags: MessageFlags.Ephemeral
      })
    }
  },
  randomMaps,
  embedMaps,
  fileMapsPath,
  filterMaps,
  states
}