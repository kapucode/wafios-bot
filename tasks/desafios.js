const { randint } = require('../commands/utils/randint.js')

module.exports = (client) => {

  if (client.challengeInterval) clearInterval(client.challengeInterval)

  client.challengeInterval = setInterval(async () => {

    try {

      if (client.challenge.active) return
      if (!client.challengesConfig?.on) return

      if (!Array.isArray(client.messageTimestamps)) {
        client.messageTimestamps = []
      }

      const now = Date.now()

      const hour = (new Date().getUTCHours() - 3 + 24) % 24
      if (hour >= 22 || hour < 9) return

      const channel = client.channels.cache.get(client.challengesConfig.channelId)

      // canal inválido
      if (!channel) return
      
      // garante que é canal de texto (v14)
      if (!channel.isTextBased()) return
      
      // tenta buscar mensagens (evita crash)
      let messages
      try {
        messages = await channel.messages.fetch({ limit: 20 })
      } catch (err) {
        return 
        // sem permissão ou erro → ignora
      }
      
      // se não tiver mensagens
      if (!messages || messages.size === 0) return
      
      // filtra mensagens dos últimos 5 minutos (e ignora bot)
      const recentMessages = messages.filter(msg => {
        if (!msg.createdTimestamp) return false
        if (msg.author?.bot) return false
      
        return (now - msg.createdTimestamp) <= 5 * 60 * 1000
      })
      
      // precisa de pelo menos 5 mensagens recentes
      if (recentMessages.size < 5) return

      client.challenge.active = true
      client.challenge.channelId = channel.id

      const desafios = [

        // 🧠 FRASE
        async () => {
          const frases = [
            "O rato roeu a roupa do rei de roma",
            "Três pratos de trigo para três tigres tristes",
            "O peito do pé do padre Pedro é preto",
            "A aranha arranha a rã mas a rã não arranha a aranha",
            "Se o papa papasse papa, seria um papa papador de papa",
            "O sabiá não sabia que o sábio sabia que o sabiá não sabia assobiar",
            "Casa suja chão sujo",
            "Bagre branco, branco bagre",
            "A vaca malhada foi molhada por outra vaca molhada e malhada",
            "Luzia lustrava o lustre listrado da sala de luxo",
            "O tempo perguntou ao tempo quanto tempo o tempo tem",
            "Fala pouca língua de palhaço fala rápido e não falha",
            "A rua de paralelepípedo é toda paralelepipedada",
            "O doce perguntou ao doce qual é o doce mais doce",
            "Se o sapo soubesse soprar sopa, não seria sapo seria soprador",
            "O original nunca se iguala ao original repetido",
            "Rato roedor rói roupa de reis de Roma rapidamente",
            "O peito do Pedro é preto porque Pedro perdeu o peito",
            "Trazei três pratos de trigo para três tigres tristes trincarem",
            "Quem a paca cara compra paca cara pagará caro por ela",
            "Nonas nunca nem viu nada nadando",
            'Fran fatiou farinha fraca fortemente',
            "Machado mata mosquitos macios, mas não morrem",
            "Kapu korta karne krua, ke estranho",
            "Leleh limpa a laje, lavando loucamente sua lona",
            "Matias marcou muitas malas, mas esmurrou a mala morta"
          ]
            

          const frase = frases[randint(0, frases.length - 1)]

          client.challenge.type = 'phrase'
          client.challenge.answer = frase.toLowerCase().trim()

          await channel.send({
            embeds: [
              {
                title: '🧠 DESAFIO DE DIGITAÇÃO',
                description: 'Escreva exatamente o texto da imagem abaixo.',
                image: {
                  url: `https://dummyimage.com/800x200/1f1f2e/ffffff&text=${encodeURIComponent(frase)}`
                },
                color: 0x7c4dff,
                footer: {
                  text: '⏳ Você tem 50 segundos para responder'
                },
                timestamp: new Date()
              }
            ]
          })
        },

        // 🔢 NÚMERO
        async () => {

          const start = randint(5, 20)
          const end = randint(30, 40)
          const number = randint(start, end)

          client.challenge.type = 'number'
          client.challenge.answer = number

          await channel.send({
            embeds: [
              {
                title: '🔢 DESAFIO DE NÚMEROS',
                description: `Adivinhe o número entre **${start} e ${end}**.`,
                color: 0x00c2ff,
                footer: {
                  text: '⏳ Você tem 50 segundos para responder'
                },
                timestamp: new Date()
              }
            ]
          })
        }

      ]

      const chosen = desafios[Math.floor(Math.random() * desafios.length)]
      await chosen()

      if (client.challenge.timeout) clearTimeout(client.challenge.timeout)

      client.challenge.timeout = setTimeout(() => {

        if (!client.challenge.active) return

        client.challenge.active = false
        client.challenge.type = null
        client.challenge.answer = null
        client.challenge.channelId = null

        channel.send({
          embeds: [
            {
              title: '⏰ TEMPO ESGOTADO',
              description: 'Ninguém conseguiu responder o desafio a tempo dessa vez.',
              color: 0xff4d4d,
              footer: {
                text: 'Tente novamente no próximo desafio'
              },
              timestamp: new Date()
            }
          ]
        })

      }, 50000)

    } catch (err) {

      console.error('[CHALLENGE ERROR]', err)

      client.challenge.active = false
      client.challenge.type = null
      client.challenge.answer = null
      client.challenge.channelId = null
    }

  }, 15 * 60 * 1000)
}