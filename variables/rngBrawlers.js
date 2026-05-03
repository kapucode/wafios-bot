const rngBrawlers = {
  inicial: [
    { 
      name: 'Shelly', 
      gif: 'https://c.tenor.com/hz6nT_Vupi8AAAAd/tenor.gif'
    }
  ],

  raro: [
    { 
      name: 'Nita', 
      gif: 'https://c.tenor.com/r0Pp6p9cpXUAAAAd/tenor.gif' 
    },
    { 
      name: 'Colt', 
      gif: 'https://c.tenor.com/euxSqje_shUAAAAd/tenor.gif' 
    },
    { 
      name: 'Poco', 
      gif: 'https://c.tenor.com/veviTKS5tAcAAAAd/tenor.gif' 
    },
    { 
      name: 'Barley', 
      gif: 'https://c.tenor.com/brJznhfPOFsAAAAd/tenor.gif' 
    },
    { 
      name: 'El Primo', 
      gif: 'https://c.tenor.com/B29YvLiS53gAAAAd/tenor.gif' 
    }
  ],

  super_raro: [
    { 
      name: 'Jessie', 
      gif: 'https://c.tenor.com/CIbFoXvmNcIAAAAd/tenor.gif' 
    },
    { 
      name: 'Rico', 
      gif: 'https://c.tenor.com/jCtgovkYyAgAAAAd/tenor.gif' 
    },
    { 
      name: 'Darryl', 
      gif: 'https://c.tenor.com/A9cOhNSXTc8AAAAd/tenor.gif' 
    },
    { 
      name: 'Jacky', 
      gif: 'https://c.tenor.com/lesCTULdNAsAAAAd/tenor.gif' 
    },
    { 
      name: 'Gus', 
      gif: 'https://c.tenor.com/1eYWjOpKeXMAAAAd/tenor.gif' 
    }
  ],

  epico: [
    { 
      name: 'Colette', 
      gif: 'https://c.tenor.com/b-_QCkmSMOIAAAAd/tenor.gif' 
    },
    { 
      name: 'Frank', 
      gif: 'https://c.tenor.com/zve8__XIFCkAAAAd/tenor.gif' 
    },
    { 
      name: 'Mandy', 
      gif: 'https://c.tenor.com/PUh-93HUSz4AAAAd/tenor.gif' 
    },
    { 
      name: 'Bonnie', 
      gif: 'https://c.tenor.com/iNrTgKXI3f0AAAAd/tenor.gif' 
    },
    { 
      name: 'Shade', 
      gif: 'https://c.tenor.com/gPCYLlSLHHQAAAAd/tenor.gif' 
    }
  ],

  mitico: [
    { 
      name: 'Max', 
      gif: 'https://c.tenor.com/qKSBoX1qHq8AAAAd/tenor.gif' 
    },
    { 
      name: 'Tara', 
      gif: 'https://c.tenor.com/mMEuZQeAAgQAAAAd/tenor.gif' 
    },
    { 
      name: 'Mortis', 
      gif: 'https://c.tenor.com/fTM4zDVu8VkAAAAd/tenor.gif' 
    },
    { 
      name: 'Buzz', 
      gif: 'https://c.tenor.com/BKsKl3z2Q-MAAAAd/tenor.gif' 
    },
    { 
      name: 'Janet', 
      gif: 'https://c.tenor.com/tv8MZ7Lr76kAAAAd/tenor.gif' 
    }
  ],

  lendario: [
    { 
      name: 'Leon', 
      gif: 'https://c.tenor.com/IVHPB-pwdH8AAAAd/tenor.gif' 
    },
    { 
      name: 'Spike', 
      gif: 'https://c.tenor.com/klTMyvrX81cAAAAd/tenor.gif' 
    },
    { 
      name: 'Sandy', 
      gif: 'https://c.tenor.com/c6illGf50UQAAAAd/tenor.gif' 
    },
    { 
      name: 'Surge', 
      gif: 'https://c.tenor.com/U1Ti7gnyPfsAAAAd/tenor.gif' 
    },
    { 
      name: 'Amber', 
      gif: 'https://c.tenor.com/1awGxp5NnikAAAAd/tenor.gif' 
    }
  ],

  ultra: [
    { 
      name: 'Kaze', 
      gif: 'https://c.tenor.com/h65dKkP7AMAAAAAd/tenor.gif' 
    },
    { 
      name: 'Sirius', 
      gif: 'https://c.tenor.com/ZLOLu3a4qmQAAAAd/tenor.gif' 
    }
  ]
};

const rngDisplay = {
  inicial: 'Inicial',
  raro: 'Raro',
  super_raro: 'Super Raro',
  epico: 'Épico',
  mitico: 'Mítico',
  lendario: 'Lendário',
  ultra: 'Ultralendário'
}

const rngChances = {
  inicial: 25,
  raro: 25,
  super_raro: 20,
  epico: 16,
  mitico: 10,
  lendario: 3,
  ultra: 1
}

module.exports = { rngBrawlers, rngDisplay, rngChances }