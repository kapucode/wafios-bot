const path = require("path");
const fs = require("fs");

const fileManagersPath = path.join(__dirname, "../../json/botManagers.json");

const { EmbedBuilder } = require("discord.js");
const { isManager } = require("../utils/isManager.js");
const { isKapu } = require("../utils/isKapu.js");
const { getEmojis } = require("../utils/getEmojis.js");

// função pra montar footer padrão
function buildFooter(user) {
  return {
    text: user.username,
    iconURL: user.displayAvatarURL({ dynamic: true })
  };
}

// função pra montar lista (mais limpa)
function formatManagers(map) {
  let managersMsg = ''
  for (const [id, name] of map) {
    managersMsg += `✨ › ${name} - <@${id}> (${id})\n\n`
  }
  return managersMsg
}

module.exports = {
  name: "managers",

  async execute(msg) {
    if (!isManager(msg.client, msg.author.id) && !isKapu(msg, msg.client)) return;

    const icon = getEmojis();
    const client = msg.client

    // vazio ou erro
    if (client.managers.size <= 0) {
      const embed = new EmbedBuilder()
        .setTitle("🛠️ | Lista vazia")
        .setDescription(
          "> Não possuem managers registrados no meu sistema!."
        )
        .setColor(0x965200)
        .setFooter({
          text: msg.author.username,
          iconURL: msg.author.displayAvatarURL({ dynamic: true })
        });

      return msg.reply({ embeds: [embed] }).catch(() => null);
    }

    const embed = new EmbedBuilder()
      .setTitle(`${icon.manager} | Managers`)
      .setDescription(
        `> Atualmente, meus managers:

${formatManagers(client.managers)}`
      )
      .setColor(0xa143ff)
      .setFooter({
        text: msg.author.username,
        iconURL: msg.author.displayAvatarURL({ dynamic: true })
      });

    return msg.reply({ embeds: [embed] }).catch(() => null);
  }
};