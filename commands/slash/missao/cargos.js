const {
EmbedBuilder,
MessageFlags
} = require('discord.js')

module.exports = {
  name: 'missao.cargos',
  async execute(interaction, client) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    })
    
    let roles = [
      {
        mention: '<@&1481616801002422424>',
        name: '🌟 運 | Estado: Sorte Infinita',
        chance: 1,
        time: 1,
        timeShow: 'h',
        give: '2x xp & Permissão de mídias'
      },
    
      {
        mention: '<@&1483882358439415948>',
        name: '🔴 バフ | Estado: Buff 3',
        chance: 6,
        time: 20,
        timeShow: 'm',
        give: '1.5x xp'
      },
      {
        mention: '<@&1482199049364045998>',
        name: '🟡 バフ | Estado: Buff 2',
        chance: 12,
        time: 15,
        timeShow: 'm',
        give: '1.5x xp'
      },
      {
        mention: '<@&1483882208392642590>',
        name: '🟢 バフ | Estado: Buff 1',
        chance: 18,
        time: 10,
        timeShow: 'm',
        give: '1.5x xp'
      },
    
      {
        mention: '<@&1483882434226553013>',
        name: '🔴 写真 | Mídias: Nível 3',
        chance: 6,
        time: 15,
        timeShow: 'm',
        give: 'Permissão de mídias'
      },
      {
        mention: '<@&1483882327825449041>',
        name: '🟡 写真 | Mídias: Nível 2',
        chance: 10,
        time: 10,
        timeShow: 'm',
        give: 'Permissão de mídias'
      },
      {
        mention: '<@&1483882277325766746>',
        name: '🟢 写真 | Mídias: Nível 1',
        chance: 12,
        time: 5,
        timeShow: 'm',
        give: 'Permissão de mídias'
      },
    
      // 🔥 NOSLOWMODE (corrigido + balanceado)
      {
        mention: '<@&1489975680681771158>',
        name: '💬 느린 | NoSlowMode: Nível 3',
        chance: 4,
        time: 15,
        timeShow: 'm',
        give: 'Sem slowmode'
      },
      {
        mention: '<@&1489975440947937350>',
        name: '💬 느린 | NoSlowMode: Nível 2',
        chance: 6,
        time: 10,
        timeShow: 'm',
        give: 'Sem slowmode'
      },
      {
        mention: '<@&1489974722295890121>',
        name: '💬 느린 | NoSlowMode: Nível 1',
        chance: 8,
        time: 5,
        timeShow: 'm',
        give: 'Sem slowmode'
      },
    
      // 🔻 NERFS (reduzidos)
      {
        mention: '<@&1483882404732076223>',
        name: '🔴 ナーフ | Estado: Nerf 3',
        chance: 3,
        time: 15,
        timeShow: 'm',
        give: '0.5x xp'
      },
      {
        mention: '<@&1483882241099563209>',
        name: '🟡 ナーフ | Estado: Nerf 2',
        chance: 4,
        time: 10,
        timeShow: 'm',
        give: '0.5x xp'
      },
      {
        mention: '<@&1483882472562233406>',
        name: '🟢 ナーフ | Estado: Nerf 1',
        chance: 6,
        time: 5,
        timeShow: 'm',
        give: '0.5x xp'
      },
    
      // 💀 PUNIÇÃO (rara)
      {
        mention: '<@&1483886013075034194>',
        name: '🎤 罰 | Estado: Silenciado(a)',
        chance: 2,
        time: 2,
        timeShow: 'm',
        give: 'Castigo (mute)'
      },
    
      {
        mention: '*Ganhar nada*',
        name: '🗑️ Ganhar nada',
        chance: 20,
        time: 0,
        timeShow: 'm',
        give: 'Nada'
      }
    ]
    let rolesMsg = ''
    for (const role of roles) {
      if (rolesMsg) rolesMsg += '\n\n'
      if (interaction.guild.id === '1325972840146800660') {
        rolesMsg += `${role.mention}\n`
      } else {
        rolesMsg += `> **${role.name}**\n`
      }
      
      rolesMsg += `- - Chance de ganhar: \`${role.chance}%\`
- - Tempo de duração: \`${role.time}${role.timeShow}\`
- - O que dá: \`${role.give}\``
    }
    
    const embed = new EmbedBuilder()
      .setTitle('📋 | Tabela de Cargos de Missão')
      .setDescription(rolesMsg)
      .setColor(0xa143ff)
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.avatarURL({ dynamic: true })
      })
      .addFields(
        {
          name: '📌 › Sistema de Pity',
          value: 'A cada 50 missões que você fizer, caso você não tiver ganhado nenhuma vez o **Sorte Infinita**, você ganhará ele de forma garantida!'
        }
      )
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
}