const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getEmojis } = require("../utils/getEmojis.js");

const filePath = path.join(__dirname, "../../json/push.json");

// cache simples pra não ler o arquivo toda hora
let cache = null;

function loadConfig() {
  if (cache) return cache;

  try {
    const data = fs.readFileSync(filePath, "utf8");
    cache = JSON.parse(data);
    return cache;
  } catch (err) {
    console.error("Erro ao carregar push.json:", err);
    return null;
  }
}

function getUserRank(member, ranks) {
  return member.roles.cache.find(r => ranks.includes(r.name)) || null;
}

function getUserTrophies(member) {
  const regex = /(\d+k\+|\d+-\d+k|\d+k)/i;
  return member.roles.cache.find(r => regex.test(r.name)) || null;
}

module.exports = {
  name: "push",

  execute(msg) {
    if (!msg.guild) return;

    const config = loadConfig();
    if (!config?.channel || !config?.pushRole) return;
    if (msg.channel.id !== config.channel) return;

    const icon = getEmojis();

    const ranks = [
      "Bronze",
      "Prata",
      "Ouro",
      "Diamante",
      "Mítico",
      "Lendário",
      "Mestre",
      "Pro"
    ];

    const rankRole = getUserRank(msg.member, ranks);
    const trophyRole = getUserTrophies(msg.member);

    const rank = rankRole ? `<@&${rankRole.id}>` : `${icon.error} *Não encontrado*`;
    const trophies = trophyRole ? `<@&${trophyRole.id}>` : `${icon.error} *Não encontrado*`;

    const embed = new EmbedBuilder()
      .setTitle("🔎 » Procurando time")
      .setDescription(
`> ${msg.author} está buscando um time para jogar!
- **${icon.brawltrophy} Troféus:** ${trophies}
- **${icon.brawlranked} Ranqueado:** ${rank}

-# __Não quer mais receber notificações de push? Altere isso em customizações!__`
      )
      .setColor(0xffc200)
      .setFooter({
        text: msg.author.username,
        iconURL: msg.author.displayAvatarURL({ dynamic: true })
      });

    const payload = {
      content: `<@&${config.pushRole}> - ${msg.author} está **buscando um time para jogar**! 🎮`,
      embeds: [embed],
      allowedMentions: { roles: [config.pushRole] }
    };

    msg.reply(payload).catch(() => msg.channel.send(payload));
  }
};