const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

const { saveMissions } = require('../commands/utils/saveMissions.js')
const { getEmojis } = require('../commands/utils/getEmojis.js')
const { getCV2 } = require('../commands/utils/getCV2.js')
const path = require('path')

const roles = [
  // ⭐ ULTRA RARO
  {
    roleId: '1481616801002422424',
    name: '🌟 運 | Estado: Sorte Infinita',
    chance: 1,
    time: 1,
    timeShow: 'h',
    give: '2x xp & Permissão de mídias',
    type: 'buff'
  },

  // 🔴 BUFFS MÉDIOS
  {
    roleId: '1483882358439415948',
    name: '🔴 バフ | Estado: Buff 3',
    chance: 6,
    time: 20,
    timeShow: 'm',
    give: '1.5x xp',
    type: 'buff'
  },
  {
    roleId: '1482199049364045998',
    name: '🟡 バフ | Estado: Buff 2',
    chance: 12,
    time: 15,
    timeShow: 'm',
    give: '1.5x xp',
    type: 'buff'
  },
  {
    roleId: '1483882208392642590',
    name: '🟢 バフ | Estado: Buff 1',
    chance: 18,
    time: 10,
    timeShow: 'm',
    give: '1.5x xp',
    type: 'buff'
  },

  // 📸 MÍDIA
  {
    roleId: '1483882434226553013',
    name: '🔴 写真 | Mídias: Nível 3',
    chance: 6,
    time: 15,
    timeShow: 'm',
    give: 'Permissão de mídias',
    type: 'buff'
  },
  {
    roleId: '1483882327825449041',
    name: '🟡 写真 | Mídias: Nível 2',
    chance: 10,
    time: 10,
    timeShow: 'm',
    give: 'Permissão de mídias',
    type: 'buff'
  },
  {
    roleId: '1483882277325766746',
    name: '🟢 写真 | Mídias: Nível 1',
    chance: 12,
    time: 5,
    timeShow: 'm',
    give: 'Permissão de mídias',
    type: 'buff'
  },

  // 🟢 NOSLOWMODE (AGORA ÚTIL)
  // {
  //   roleId: '1489975680681771158',
  //   name: '💬 느린 | NoSlowMode: Nível 3',
  //   chance: 4,
  //   time: 15,
  //   timeShow: 'm',
  //   give: 'Sem slowmode',
  //   type: 'buff'
  // },
  // {
  //   roleId: '1489975440947937350',
  //   name: '💬 느린 | NoSlowMode: Nível 2',
  //   chance: 6,
  //   time: 10,
  //   timeShow: 'm',
  //   give: 'Sem slowmode',
  //   type: 'buff'
  // },
  // {
  //   roleId: '1489974722295890121',
  //   name: '💬 느린 | NoSlowMode: Nível 1',
  //   chance: 8,
  //   time: 5,
  //   timeShow: 'm',
  //   give: 'Sem slowmode',
  //   type: 'buff'
  // },

  // 🔻 NERFS (BEM MAIS RAROS)
  {
    roleId: '1483882404732076223',
    name: '🔴 ナーフ | Estado: Nerf 3',
    chance: 3,
    time: 15,
    timeShow: 'm',
    give: '0.5x xp',
    type: 'nerf'
  },
  {
    roleId: '1483882241099563209',
    name: '🟡 ナーフ | Estado: Nerf 2',
    chance: 4,
    time: 10,
    timeShow: 'm',
    give: '0.5x xp',
    type: 'nerf'
  },
  {
    roleId: '1483882472562233406',
    name: '🟢 ナーフ | Estado: Nerf 1',
    chance: 6,
    time: 5,
    timeShow: 'm',
    give: '0.5x xp',
    type: 'nerf'
  },

  // 💀 PUNIÇÃO (RARO)
  {
    roleId: '1483886013075034194',
    name: '🎤 罰 | Estado: Silenciado(a)',
    chance: 2,
    time: 2,
    timeShow: 'm',
    give: 'Castigo (mute)',
    type: 'punishment'
  },

  // 🗑️ NADA
  {
    roleId: '*Ganhar nada*',
    name: '🗑️ Ganhar nada',
    chance: 20,
    time: 0,
    timeShow: 'm',
    give: 'Nada',
    type: 'none'
  }
]

// ---------------- RANDOM ----------------
function randomItem(items) {
  const total = items.reduce((acc, i) => acc + i.chance, 0)
  let random = Math.random() * total

  for (const item of items) {
    random -= item.chance
    if (random < 0) return item
  }

  return items[0]
}

// ---------------- REWARD ----------------
async function giveRole(interaction, roleObj, icon, userMission, member) {

  if (!roleObj) {
    return interaction.editReply({
      content: `${icon.error} Erro ao gerar recompensa`
    })
  }

  if (roleObj.type === 'none') {
    userMission.status = 'rewarded'
    userMission.rewardType = 'none'
    userMission.roleId = null

    return interaction.editReply({
      content: '🗑️ Você não ganhou nada dessa vez.'
    })
  }

  if (roleObj.type === 'punishment') {
    let ms = roleObj.time
    if (roleObj.timeShow === 'h') ms *= 60
    ms *= 60 * 1000

    try {
      await member.timeout(ms, 'Azar na missão diária')

      userMission.status = 'rewarded'
      userMission.rewardType = 'punishment'

      return interaction.editReply({
        content: `💀 Castigo aplicado por ${roleObj.time}${roleObj.timeShow}`
      })
    } catch {
      return interaction.editReply({
        content: `${icon.error} Erro ao aplicar mute`
      })
    }
  }

  const role = await interaction.guild.roles.fetch(roleObj.roleId)

  if (!role) {
    return interaction.editReply({
      content: `${icon.error} Cargo não encontrado`
    })
  }

  try {
    let ms = roleObj.time
    if (roleObj.timeShow === 'h') ms *= 60
    ms *= 60 * 1000
    if (ms <= 0) ms = 5000

    await member.roles.add(role.id)

    userMission.status = 'rewarded'
    userMission.rewardType = 'role'
    userMission.roleIncludedAt = Date.now()
    userMission.roleEndAt = Date.now() + ms
    userMission.roleId = role.id
    userMission.roleActive = true
    userMission.rewardName = role.name

    return interaction.editReply({
      content:
        `🎁 Você recebeu: **${role.name}**\n` +
        `⏰ Tempo: ${roleObj.time}${roleObj.timeShow}\n` +
        `📦 O que dá: ${roleObj.give}`
    })

  } catch {
    return interaction.editReply({
      content: `${icon.error} Erro ao dar cargo`
    })
  }
}

// ---------------- BUTTON ----------------
module.exports = {
  id: 'mission-reward',

  execute: async (interaction, client) => {
    try {

      await interaction.deferReply({ flags: MessageFlags.Ephemeral })

      const icon = getEmojis()
      const missionsPath = path.join(__dirname, '../json/missions.json')

      if (!client.missions) client.missions = new Map()

      const userMission = client.missions.get(interaction.user.id)

      if (!userMission) {
        return interaction.editReply({
          content: `${icon.error} Missão não encontrada`
        })
      }
      
      userMission.ultraPity ??= 0

      if (interaction.guild.id !== '1325972840146800660') {
        return interaction.editReply({
          content: `${icon.error} Use no servidor correto`
        })
      }

      if (userMission.status !== 'completed') {
        return interaction.editReply({
          content: `${icon.error} Missão não concluída`
        })
      }

      const member = await interaction.guild.members.fetch(interaction.user.id)

      // 🔥 FIX REAL
      const availableRoles = roles.filter(r => {
        if (r.type === 'none' || r.type === 'punishment') return true
        return !member.roles.cache.has(r.roleId)
      })

      let roleObj

      const ultraRole = roles.find(r => r.name.includes('Sorte Infinita'))
      
      if (userMission.ultraPity >= 50) {
        roleObj = ultraRole
      } else {
        roleObj = randomItem(availableRoles)
      }
      
      await giveRole(interaction, roleObj, icon, userMission, member)
      
      if (roleObj?.name?.includes('Sorte Infinita')) {
        userMission.ultraPity = 0
      } else {
        userMission.ultraPity++
      }

      await saveMissions(client, missionsPath)

      // ---------------- CV2 ----------------
      const statusMap = {
        idle: 'Não iniciada',
        in_progress: 'Em andamento',
        completed: 'Concluída',
        rewarded: 'Recompensa recebida'
      }
      
      const missionHandler = client.missionsList.get(userMission.type)
      
      const translatedStatus = statusMap[userMission.status] || 'Desconhecido'
      
      const progress = userMission.progress
      const goal = userMission.goal
      const progressText = missionHandler?.formatProgress
        ? missionHandler.formatProgress(progress, goal)
        : `${progress}/${goal}`
      const percent = 100

      let rewardText = '**Nada**'
      if (userMission.rewardType === 'role') {
        const timestampRoleEndAt = Math.floor(userMission?.roleEndAt / 1000)
        let msgTimestamp = `(acaba <t:${timestampRoleEndAt}:R>)`
          
        if (Date.now() > userMission.roleEndAt) {
          msgTimestamp = `(acabou <t:${timestampRoleEndAt}:R>)`
        }
        
        rewardText = `<@&${userMission.roleId}> ${msgTimestamp}`
      } else if (userMission.rewardType === 'punishment') {
        rewardText = '**Castigo**'
      }
      let timeLeft = '—'

      if (userMission.expiresAt) {
        timeLeft = `<t:${Math.floor(userMission.expiresAt / 1000)}:R>`
      }
      
      const container = getCV2(
        userMission,
        progressText,
        percent,
        timeLeft,
        rewardText,
        translatedStatus
      )

      const btn = new ButtonBuilder()
        .setCustomId(`mission-reward:${interaction.user.id}`)
        .setLabel('Recompensa resgatada')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)

      const row = new ActionRowBuilder().addComponents(btn)

      if (interaction.message) {
        await interaction.message.edit({
          flags: MessageFlags.IsComponentsV2,
          components: [container, row]
        })
      }

    } catch (e) {
      console.error(e)
    }
  }
}