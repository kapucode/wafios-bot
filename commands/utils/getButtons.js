const { MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const buttonsPath = path.join(__dirname, '../../json/buttons.json');
let savedButtons = require(buttonsPath);

async function getButtons(client) {
  for (const btn of savedButtons.buttons) {

    if (!btn.channelId || !btn.messageId) continue;

    try {
      const channel = await client.channels.fetch(btn.channelId).catch(() => null);
      if (!channel || !channel.isTextBased()) continue;

      const message = await channel.messages.fetch(btn.messageId).catch(() => null);
      if (!message) continue;

      // 🚫 segurança extra (caso algo estranho aconteça)
      if (!message.components?.length) continue;

      const collector = message.createMessageComponentCollector({
        componentType: 'BUTTON'
      });

      collector.on('collect', async (interaction) => {
        const [buttonId, ownerId] = interaction.customId.split(':');

        if (interaction.user.id !== ownerId) {
          return interaction.reply({
            content: `:x: **|** Esse botão não é seu.`,
            ephemeral: true
          });
        }

        const button = client.buttons.get(buttonId);
        if (!button) return;

        await button.execute(interaction, client);
      });

    } catch (err) {

      // 🔥 para de spammar erro inútil
      if (err.code === 'ENOTFOUND') return;

      console.log(`Erro ao recuperar ${btn.messageId}:`, err.message);
    }

    // 🧠 anti flood
    await new Promise(res => setTimeout(res, 300));
  }
}

module.exports = { getButtons };