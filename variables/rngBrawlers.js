const rngBrawlers = {
  inicial: [
    { 
      name: 'Shelly', 
      gif: 'Não_identificado'
    }
  ],

  raro: [
    { 
      name: 'Nita', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Colt', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Poco', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Barley', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'El Primo', 
      gif: 'Não_identificado' 
    }
  ],

  super_raro: [
    { 
      name: 'Jessie', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Rico', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Darryl', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Jacky', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Gus', 
      gif: 'Não_identificado' 
    }
  ],

  epico: [
    { 
      name: 'Colette', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Frank', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Mandy', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Bonnie', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Shade', 
      gif: 'Não_identificado' 
    }
  ],

  mitico: [
    { 
      name: 'Max', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Tara', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Mortis', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Buzz', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Janet', 
      gif: 'Não_identificado' 
    }
  ],

  lendario: [
    { 
      name: 'Leon', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Spike', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Sandy', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Surge', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Amber', 
      gif: 'Não_identificado' 
    }
  ],

  ultralendario: [
    { 
      name: 'Kaze', 
      gif: 'Não_identificado' 
    },
    { 
      name: 'Sirius', 
      gif: 'Não_identificado' 
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