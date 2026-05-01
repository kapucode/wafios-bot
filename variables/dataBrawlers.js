const dataBrawlers = {
  inicial: [
    {
      name: 'Shelly',
      roleId: '1498498369713213541',
      gives: '+1.0x XP na Loritta',
      gif: 'https://c.tenor.com/hz6nT_Vupi8AAAAd/tenor.gif'
    }
  ],

  raro: [
    {
      name: 'El Primo',
      roleId: '1498498830793179257',
      gives: '+1.10x XP na Loritta',
      gif: 'https://c.tenor.com/hz6nT_Vupi8AAAAd/tenor.gif'
    },
    {
      name: 'Barley',
      roleId: '1498498998892232714',
      gives: '+1.05x XP na Loritta',
      gif: 'https://c.tenor.com/brJznhfPOFsAAAAd/tenor.gif'
    },
    {
      name: 'Poco',
      roleId: '1498499165012103238',
      gives: '+1.05x XP na Loritta',
      gif: 'https://c.tenor.com/veviTKS5tAcAAAAd/tenor.gif'
    }
  ],

  super_raro: [
    {
      name: 'Dynamike',
      roleId: '1498499509825704086',
      gives: '+1.10x XP na Loritta',
      gif: 'https://c.tenor.com/UOVLTlxzsicAAAAd/tenor.gif'
    },
    {
      name: 'Darryl',
      roleId: '1498499781486710875',
      gives: '+1.10x XP na Loritta',
      gif: 'https://c.tenor.com/A9cOhNSXTc8AAAAd/tenor.gif'
    },
    {
      name: 'Rico',
      roleId: '1498500156516077759',
      gives: '+1.15x XP na Loritta',
      gif: 'https://c.tenor.com/jCtgovkYyAgAAAAd/tenor.gif'
    }
  ],

  epico: [
    {
      name: 'Piper',
      roleId: '1498500280248045668',
      gives: '+1.15x XP na Loritta',
      gif: 'https://c.tenor.com/HvdnzXbnJV4AAAAd/tenor.gif'
    },
    {
      name: 'Edgar',
      roleId: '1498499975716274267',
      gives: '+1.20x XP na Loritta',
      gif: 'https://c.tenor.com/TQNUy2CbEKAAAAAd/tenor.gif'
    },
    {
      name: 'Bo',
      roleId: '1498500666614747336',
      gives: '+1.15x XP na Loritta',
      gif: 'https://c.tenor.com/52dsH5I0NyoAAAAd/tenor.gif'
    }
  ],

  mitico: [
    {
      name: 'Mortis',
      roleId: '1498498108353548430',
      gives: '+1.25x XP na Loritta',
      gif: 'https://c.tenor.com/fTM4zDVu8VkAAAAd/tenor.gif'
    },
    {
      name: 'Tara',
      roleId: '1498500944223141908',
      gives: '+1.20x XP na Loritta',
      gif: 'https://c.tenor.com/mMEuZQeAAgQAAAAd/tenor.gif'
    },
    {
      name: 'Max',
      roleId: '1498501089782141069',
      gives: '+1.20x XP na Loritta',
      gif: 'https://c.tenor.com/HUsJ7KJz0zMAAAAd/tenor.gif'
    }
  ],

  lendario: [
    {
      name: 'Leon',
      roleId: '1498501201216536607',
      gives: 'Sem Modo Lento + +1.25x XP na Loritta',
      gif: 'https://c.tenor.com/IVHPB-pwdH8AAAAd/tenor.gif'
    },
    {
      name: 'Crow',
      roleId: '1498501289003319406',
      gives: '+1.35x XP na Loritta',
      gif: 'https://c.tenor.com/rtJ8ZHgUkIkAAAAd/tenor.gif'
    },
    {
      name: 'Spike',
      roleId: '1498501409694416926',
      gives: '+1.30x XP na Loritta',
      gif: 'https://c.tenor.com/J2ZVKIz3ulgAAAAd/tenor.gif'
    }
  ],

  ultra: [
    {
      name: 'Sirius',
      roleId: '1498501480355729589',
      gives: 'Permissão de mídias + +1.50x XP na Loritta',
      gif: 'https://c.tenor.com/ZLOLu3a4qmQAAAAd/tenor.gif'
    }
  ]
}

const categoryDisplay = {
  inicial: 'Inicial',
  raro: 'Raro',
  super_raro: 'Super Raro',
  epico: 'Épico',
  mitico: 'Mítico',
  lendario: 'Lendário',
  ultra: 'Ultralendário'
}

const categoryChances = {
  inicial: 25,
  raro: 25,
  super_raro: 20,
  epico: 16,
  mitico: 10,
  lendario: 3,
  ultra: 1
}

module.exports = { dataBrawlers, categoryDisplay, categoryChances }