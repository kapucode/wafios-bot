const path = require("path");
const fs = require("fs");

const fileManagersPath = path.join(__dirname, "../../json/botManagers.json");

const { EmbedBuilder } = require("discord.js");
const { isManager } = require("../utils/isManager.js");
const { isKapu } = require("../utils/isKapu.js");
const { getEmojis } = require("../utils/getEmojis.js");

// função isolada só pra leitura
function loadManagers() {
  try {
    const raw = fs.readFileSync(fileManagersPath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];
    return parsed.filter(m => m?.id && m?.name);
  } catch (err) {
    console.error("Erro ao ler botManagers.json:", err);
    return [];
  }
}

// função pra montar footer padrão
function buildFooter(user) {
  return {
    text: user.username,
    iconURL: user.displayAvatarURL({ dynamic: true })
  };
}

// função pra montar lista (mais limpa)
function formatManagers(list) {
  return list
    .map(m => `> **${m.name}**\n- <@${m.id}> \`(${m.id})\``)
    .join("\n\n");
}

module.exports = {
  name: "managers",

  async execute(msg) {
    if (!isManager(msg.client, msg.author.id) && !isKapu(msg, msg.client)) return;

    const icon = getEmojis();
    const managers = loadManagers();

    // vazio ou erro
    if (!managers.length) {
      const embed = new EmbedBuilder()
        .setTitle("🛠️ | Lista vazia")
        .setDescription(
          "> Nenhum manager encontrado.\n> Ou o arquivo está vazio, ou deu erro na leitura."
        )
        .setColor(0x965200)
        .setFooter(buildFooter(msg.author));

      return msg.reply({ embeds: [embed] }).catch(() => null);
    }

    const embed = new EmbedBuilder()
      .setTitle(`${icon.manager} | Managers`)
      .setDescription(
        `> Atualmente, meus managers:\n\n${formatManagers(managers)}`
      )
      .setColor(0xa143ff)
      .setFooter(buildFooter(msg.author));

    return msg.reply({ embeds: [embed] }).catch(() => null);
  }
};