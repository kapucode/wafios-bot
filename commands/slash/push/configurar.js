const { 
EmbedBuilder,
MessageFlags,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle } = require("discord.js");
const { isManager } = require('../../utils/isManager.js')
const fs = require('fs')
const path = require('path')
const { getEmojis } = require('../../utils/getEmojis.js')

const statesConfigPush = new Map()

module.exports = {
  name: 'push.configurar',

  async execute(interaction, client) {
    const icon = getEmojis()
    
    // Verificando permissões
    if (!isManager(client, interaction.user.id)) {
      return interaction.reply({
        content: `${icon.error || ':x:'} | Você precisa ser \`MANAGER\` para configurar o push.`,
        flags: MessageFlags.Ephemeral
      });
    }
    
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })
    
    // Variáveis
    const channel = interaction.options.getChannel('canal')
    const role = interaction.options.getRole('cargo_push')
    const cooldown = interaction.options.getInteger('cooldown') || 5
    const filePath = path.join(__dirname, '../../../json/push.json')
    
    if (channel.name.includes('chat')) {
      const embedError = new EmbedBuilder()
        .setTitle(`${icon.error || ':x:'} | Chat detectado`)
        .setDescription(`O canal que você inseriu para **push** contém \`chat\` no nome, então eu não posso colocar esse canal como **canal para push**!\n\n-# __Estou errado e esse canal precisa ser o de push? Tire 'chat' do nome do canal, use o comando e depois volte com o nome!__`)
        .setColor(0xFF0000)
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.avatarURL({ dynamic: true })
        })
      return interaction.editReply({
        embeds: [embedError]
      })
    }
    
    if (interaction?.guild?.id !== '1325972840146800660') { // Mafios
      const btnConfirm = new ButtonBuilder()
        .setCustomId(`confirm-configpush:${interaction.user.id}`)
        .setLabel('Confirmar')
        .setEmoji('<:confirm:1481371916429168752>')
        .setStyle(ButtonStyle.Success)
        
      const btnCancel = new ButtonBuilder()
        .setCustomId(`cancel-configpush:${interaction.user.id}`)
        .setLabel('Cancelar')
        .setEmoji('<:cancel:1481371978072981654>')
        .setStyle(ButtonStyle.Danger)
        
      const row = new ActionRowBuilder()
        .addComponents(btnConfirm, btnCancel)
      
      const embedWarn = new EmbedBuilder()
        .setTitle('⚠️ | Servidor estrangeiro')
        .setDescription('> Esse servidor **não é a Mafios**, você tem certeza que deseja configurar o push para esse servidor?\n\n> __É recomendado que você configure o push para servidores estrangeiros somente para **testes**__.')
        .setColor(0xa143ff)
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true })
        })
      
      statesConfigPush.set(interaction.user.id, { filePath, channel, role, cooldown })
      
      const sentMessage = await interaction.editReply({
        embeds: [embedWarn],
        components: [row]
      })
      
      return
    }
    
    // Respondendo o comando
    const object = {
      channel: channel.id,
      pushRole: role.id,
      cooldown: cooldown * 60 * 1000
    }
    
    fs.writeFileSync(filePath, JSON.stringify(object, null, 2))
    await interaction.editReply({
      content: `${icon.success || ':white_check_mark:'} | Você configurou o push do servidor!`,
    })
  },
  
  statesConfigPush
};