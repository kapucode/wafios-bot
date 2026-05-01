const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { randint } = require('../utils/randint.js')

const { 
EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'segredo',
  
  async execute(msg, args) {
    const embedCorrectUse = correctUseEmbed(
      'segredo',
      '&segredo [pessoa]'
    )
    
    const client = msg.client
    
    const user = msg?.mentions.users.first() ||
    client.users.cache.get(args[0]) ||
    await client.users.fetch(args[0]).catch(() => null)
  
    if (!user) {
      return msg.reply({
        embeds: [embedCorrectUse]
      })
    }
    
    const secrets = [
      "Tem um grupo só com ele mesmo pra anotar fofoca dos outros",
      "Já criou um fake só pra ver quem fala mal dele",
      "Apaga mensagem e reescreve só pra parecer mais inteligente",
      "Já fingiu estar offline pra evitar uma pessoa específica",
      "Tem prints guardados de conversas antigas 'por segurança'",
      "Já stalkeou alguém tão fundo que chegou em 2017",
      "Tem um contato salvo só pra desabafar e nunca manda nada",
      "Já testou mensagem em outro chat antes de mandar na real",
      "Tem um plano de resposta pra briga que nunca aconteceu",
      "Já ficou digitando, apagando e digitando por 10 minutos",
      "Já abriu o perfil de alguém todo dia por uma semana",
      "Tem um fake só pra ver quem visita os stories",
      "Já ignorou alguém e depois inventou desculpa",
      "Tem conversa arquivada só pra fingir que superou",
      "Já respondeu seco de propósito pra ver a reação",
      "Tem uma lista mental de pessoas que evita a qualquer custo",
      "Já leu a mensagem e decidiu não responder só pelo poder",
      "Tem um ranking secreto de pessoas favoritas",
      "Já fingiu que esqueceu algo só pra não fazer",
      "Tem um plano de fuga mental pra qualquer situação social",
      "Já respondeu rápido demais e ficou com medo de parecer emocionado",
      "Tem um histórico inteiro que ele reza pra ninguém ver",
      "Já mudou o jeito de escrever só pra impressionar alguém",
      "Tem um 'personagem' diferente pra cada grupo de amigos",
      "Já stalkeou alguém e depois agiu como se não soubesse nada",
      "Tem uma conversa que ele nunca vai apagar",
      "Já voltou numa conversa só pra analisar cada mensagem",
      "Tem um segredo dentro de outro segredo",
      "Já fingiu não entender algo só pra ver até onde iam explicar",
      "Tem um plano B pra fugir de qualquer rolê",
      "Já pensou numa resposta perfeita… 3 horas depois",
      "Tem uma pessoa que ele nunca responde na hora de propósito",
      "Já mudou opinião só pra evitar discussão",
      "Tem um print que poderia destruir uma amizade",
      "Já fingiu surpresa sabendo exatamente o que ia acontecer",
      "Tem um histórico de pesquisa que nem ele quer lembrar",
      "Já abriu o chat várias vezes esperando mensagem que nunca veio",
      "Tem um segredo que ele mesmo esqueceu que existe",
      "Já testou como alguém reagiria mentindo uma coisa pequena",
      "Tem um nível de stalk que beira investigação criminal",
      "Já fingiu estar ocupado só pra não ajudar",
      "Tem um jeito específico de responder cada pessoa",
      "Já segurou informação só pra usar depois",
      "Tem um radar mental pra evitar gente chata",
      "Já deixou alguém no vácuo só pra 'equilibrar o jogo'",
      "Tem um lado que ninguém daquele servidor conhece",
      "Já fingiu não ver mensagem só pra ganhar tempo",
      "Tem um segredo que ele nunca contaria nem bêbado",
      "Já observou tudo sem falar nada só pra entender o ambiente",
      "Tem uma opinião que ele nunca revela pra ninguém",
      "Já manipulou uma situação pequena sem ninguém perceber"
    ];
    const secret = secrets[randint(0, secrets.length - 1)]
    
    const midMessage = randint(0, 100) <= 40
    const errorMessage = randint(0, 100) <= 15
    const colors = [
      0x83eeff,
      0xfcff83,
      0x8cff83,
      0xb4ff83,
      0xc383ff
    ]
    const finalColor = colors[randint(0, colors.length - 1)]
    
    const firstEmbed = new EmbedBuilder()
      .setTitle(`📋 » Acessando...`)
      .setDescription(`Estamos tentando acessar alguma informação de segredo do usuário ${user}`)
      .setColor(0xfdffa5)
    
    const midEmbed = new EmbedBuilder()
      .setTitle(`⚠️ » Acesso dificultado`)
      .setDescription(`**Estamos quase lá**, mas o(a) usuário(a) ${user} possui uma segurança mais forte. Aguarde, iremos conseguir!`)
      .setColor(0xff5959)
    
    const errorEmbed = new EmbedBuilder()
      .setTitle(`👾 » Falha ao invadir`)
      .setDescription(`A invasão ao dispositivo para pegar o segredo do(a) usuário(a) ${user} falhou, ele tem muita segurança na conta!`)
      .setColor(0xFF0000)
    
    const finalEmbed = new EmbedBuilder()
      .setTitle(`📋 Segredo Detectado`)
      .setDescription(` - Segredo de: ${user}

||**${secret}**||
-# Clique acima para revelar o segredo do usuário`)
      .setColor(finalColor)
    
    const msgSend = await msg.reply({
      embeds: [firstEmbed]
    })
    
    setTimeout(() => {
      if (midMessage) {
        msgSend.edit({ embeds: [midEmbed] })
      }
    }, 500)
    
    // etapa final
    setTimeout(async () => {
      if (errorMessage) {
        await msgSend.edit({ embeds: [errorEmbed] })
        await msgSend.react('😡')
        return
      }
    
      await msgSend.edit({ embeds: [finalEmbed] })
      await msgSend.react('😂')
    }, 3000)
  }
}