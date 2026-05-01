const { correctUseEmbed } = require('../utils/correctUseEmbed.js')
const { randint } = require('../utils/randint.js')

const { 
EmbedBuilder
} = require('discord.js')

module.exports = {
  name: 'hack',
  async execute(msg, args) {
    const embedCorrectUse = correctUseEmbed(
      'hack',
      '&hack [pessoa]'
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
    
    
    const emails = [
      'respondeai',
      'vaitrabalhar',
      'sofala',
      'chamaquenaovem',
      'mentirosonato',
      'reidovacuo',
      'soapareceonline',
      'naotemvergonha',
      'carentedemsg',
      'dramasemfim',
      'falaefaznada',
      'soenrola',
      'clt',
      'kapu_erra_teleguiado',
      'uoldi',
      'vidaloka123'
    ]
    const passwords = [
      'rei123zoeira',
      'senha666top',
      'eusou100brabo',
      'acessa999ai',
      'top77zera',
      'dev123bug',
      'zoeiro420',
      'nivel9000',
      'pro007player',
      'brawl9tilt',
      'erro404vida',
      'teste321vai',
      'brabo777',
      'zero0paciencia',
      '12445678',
      '87654321',
      ':+39&+20\'!91649\';#9'
    ]
    
    const dispositivos = [
      'Android',
      'Windows',
      'SM01510',
      'PC da Nasa',
      'PC da Xuxa'
    ]
    
    const localizations = [
      'Brasil',
      'Argentina',
      'Rússia',
      'Coréia do Norte',
      'Área 51',
      'Casa da mãe',
      'Quarto bagunçado',
      'Foragido(a) (não encontrado)',
      'Desconhecido'
    ]
    
    const ips = [
      '192168001001',
      '777777777',
      '010101010101',
      '000000000000',
      '999999999',
      '123123123123',
      '666666666',
      '404notfound',
      '111111111',
      '888888888'
    ]

    
    const info = {
      email: emails[randint(0, emails.length - 1)],
      password: passwords[randint(0, passwords.length - 1)],
      dispositivo: dispositivos[randint(0, dispositivos.length - 1)],
      localization: localizations[randint(0, localizations.length - 1)],
      ip: ips[randint(0, ips.length - 1)]
    }
    
    const embed = new EmbedBuilder()
      .setTitle('⏰ » Hackeando...')
      .setDescription('Aguarde um momento, estou invadindo informações do usuário...')
      .setColor(0xf70000)
    const newEmbed = new EmbedBuilder()
      .setTitle('🔒 » Informações Confidencias')
      .setDescription(`> Informações de: ${user}

- 💌 E-mail: ${info.email}@gmail.com
- 🔑 Senha: ${info.password}
- 📱 Dispositivo ${info.dispositivo}
- 🌍 Localização: ${info.localization}
- 🖥️ IP: ${info.ip}`)
      .setColor(0xf70000)
    const msgAwait = await msg.reply({
      embeds: [embed]
    })
    
    setTimeout(async () => {
      msgAwait.edit({
        embeds: [newEmbed]
      })
    }, 3000)
  }
}