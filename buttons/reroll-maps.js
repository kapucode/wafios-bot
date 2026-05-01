const fs = require('fs');
const path = require('path');
const { MessageFlags } = require('discord.js')
const mapas = require('../commands/slash/mapas.js')


module.exports = {
  id: 'reroll-maps', // customId do botão

  execute: async (interaction, client) => {
    try {
      const state = mapas.states.get(interaction.message.id)
      if (!state) return
      
      
      const cmd = client.slashCommands.get('mapas');
      if (!cmd) return interaction.reply({
        content: ':x: | **ERRO**: Comando não encontrado.',
        flags: MessageFlags.Ephemeral 
      });
  
      const embed = interaction.message.embeds[0];
      if (!embed) return interaction.reply({
        content: ':x: | **ERRO**: Não encontrei os mapas.',
        flags: MessageFlags.Ephemeral 
      });
  
      // quantidade de mapas = contar quantos itens tem no embed
      const quantity = embed.description.split('\n\n').length;
  
      // ler o arquivo de mapas
      let mapsObj = cmd.filterMaps(JSON.parse(fs.readFileSync(cmd.fileMapsPath)), state.filterMode)
  
      // gerar novos mapas
      const maps = [];
      for (let i = 0; i < quantity; i++) {
        const chosenObj = cmd.randomMaps(mapsObj)
        maps.push(chosenObj)
        
        if (!state.repetidos) {
          mapsObj = mapsObj.filter(modo => modo.name !== chosenObj.name)
        }
      }
      
      state.rerolls += 1
      const newEmbed = cmd.embedMaps(maps, interaction, state.rerolls);
  
      // manter os botões originais
      const row = interaction.message.components;
  
      await interaction.update({
        embeds: [newEmbed],
        components: row
      });
      
      await interaction.followUp({
        content: '🔄 **|** Você resorteou os mapas.',
        flags: MessageFlags.Ephemeral
      });
    } catch (e) {
      console.error(e)
    }
  }
};