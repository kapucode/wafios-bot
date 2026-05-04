const fs = require('fs')
const path = require('path')

function normalizeText(texto) {
  return texto
    .toLowerCase()
    .replace(/\bqr\b/g, "quero")
    .replace(/\bq\b/g, "que")
    .replace(/\bjg\b/g, "jogar")
    .replace(/\bjgr\b/g, "jogar")
    .replace(/\bjoga\b/g, "jogar")
    .replace(/\bjgo\b/g, "jogar")
    .replace(/\bvms\b/g, "vamos")
    .replace(/\bvm\b/g, "vamos")
    .replace(/\bbora\b/g, "vamos")
    .replace(/\bbr\b/g, "vamos")
    .replace(/\balgm\b/g, "alguem")
    .replace(/\balg\b/g, "alguem")
}

function similaridade(a, b) {
  const palavrasA = a.split(/\s+/)
  const palavrasB = b.split(/\s+/)

  const comuns = palavrasA.filter(p => palavrasB.includes(p))

  return comuns.length / Math.max(palavrasA.length, palavrasB.length)
}

function wantsPlay(msg) {
  const texto = normalizeText(msg.content)

  const exemplos = [
    "vamos jogar",
    "alguem quer jogar",
    "quem quer jogar",
    "vamos push",
    "alguem ranked",
    "bora 3x3",
    "time pra combate",
    "alguem x1",
    "quero jogar"
  ]

  const parecido = exemplos.some(ex => similaridade(texto, ex) > 0.4)

  const palavrasFortes = /\b(jogar|push|ranked|3x3|x1|combate|partida|game|rank|ranqueado|ranke)\b/i.test(texto)

  return parecido || palavrasFortes
}

const pushCooldown = new Map()

module.exports = async (msg, client) => {
  if (msg.author.bot) return

  if (!wantsPlay(msg)) return

  const pushFilePath = path.join(__dirname, '../json/push.json')
  const modePath = path.join(__dirname, '../json/pushMode.json')

  const cooldownJson = JSON.parse(fs.readFileSync(pushFilePath))
  const mode = JSON.parse(fs.readFileSync(modePath))

  if (mode.pushMode === 'off') return

  const cooldownTime = cooldownJson.cooldown
  const now = Date.now()

  const lastUse = pushCooldown.get(msg.author.id)
  if (lastUse && now - lastUse < cooldownTime) return

  pushCooldown.set(msg.author.id, now)

  setTimeout(() => {
    pushCooldown.delete(msg.author.id)
  }, cooldownTime)

  const command = client.prefixCommands.get("push")
  if (command) {
    command.execute(msg)
  }
}