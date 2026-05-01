const { isManager } = require('../utils/isManager.js')

const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require('discord.js');

module.exports = {
  name: 'regras',
  
  async execute(msg) {
    if (!isManager(msg.author.id)) return
    
    const separator = new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small);
    
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 1 — Respeito é obrigatório**
- - Xingamentos gratuitos, provocações forçadas, humilhações, perseguições, piadas maldosas ou atitudes tóxicas não são toleradas. “Era só brincadeira” não justifica desrespeito`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 2 — Desrespeito à staff agrava a punição**
- - A staff possui autoridade, responsabilidade e poder de decisão
- - Questionar decisões é permitido; desrespeitar, ironizar, provocar ou atacar não é
- - Desrespeito à staff resulta em punições mais severas`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 3 — Brincadeira tem limite**
- - Brincadeiras só são válidas quando todos concordam.
- - Forçar piadas, apelidos ofensivos ou provocações insistentes não é brincadeira.
- - Brincar com algo que incomoda outro membro gera punição.

- __Zoar é permitido, oprimir não.__`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 4 — Evite conflitos públicos**
- - Problemas devem ser resolvidos em ticket ou no privado.
- - Discussões em chat aberto, exposições públicas ou tretas geram punição.`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 5 — Use os canais corretamente**
- - Cada canal tem uma função específica, então flood, spam, conteúdo fora do tema ou desvio proposital de assunto atrapalham o servidor e se insistir leva punição`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 6 — Ticket não é brinquedo**
- - O sistema de tickets é destinado a denúncias, dúvidas, sugestões e problemas reais. Abrir ticket para zoar, brincar ou reclamar de qualquer coisa irrelevante gera punição`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 7 — Palavrões liberados, ataques não**
- - Você pode se expressar do seu jeito, mas ofensações diretas, humilhações, xingamentos direcionados ou ameaças verbais geram punição imediata

- __Existe diferença entre palavrões e ataques pessoais.__`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 8 — Preconceito é ban imediato (sem exceção)**
- - Racismo, xenofobia, homofobia, transfobia, capacitismo ou qualquer discurso de ódio são proibidos
- - - Isso inclui zoações, piadas, ironias ou “brincadeiras”.
- - - Não existe contexto aceitável para preconceito.
- - - __Membros maiores de 18 anos, fiquem cientes: esse tipo de conduta pode configurar crime previsto em lei.__

- __Penalidade: banimento direto ou até prisão.__`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 9 — Proibído conteúdos ilegais ou pesados:**
- - Pornografia explícita ou conteúdo NSFW
- - Conteúdo gore ou extremamente violento
- - Apologia ao crime ou drogas
- - Ideologias extremistas (nazismo, fascismo, etc.)

- __Infração resulta em banimento imediato.__`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 10 — Divulgação envolvendo dinheiro**
- - Qualquer divulgação que envolva dinheiro precisa de autorização da staff
- - Vendas, pix, apostas, sorteios, cursos ou links pagos sem permissão são proibidos

- __Se não provar que é confiável, não publique.__`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 11 — Respeite iniciantes**
- - Zombar, desmerecer ou desmotivar novatos não é tolerado`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
**Artigo 12 — Brigas de ego não têm espaço**
- - Disputas de ego, indiretas ou exposição de conflitos criam ambiente tóxico

- - __Resolver conflitos é melhor do que vencer discussão. __`)
      )
      
      .addSeparatorComponents(separator)
      
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`
🧾 __**OBSERVAÇÕES FINAIS**__

1. **Peso das Punições:** *As punições não seguem tabela fixa e variam conforme gravidade, histórico e contexto, comparar punições não é válido.*
2. **Apelo de Punição:** *Reclamações devem ser feitas via ticket, com respeito. Reclamar de punições em canais gerais acarretará mais punições.*
3. **Momentos de Punições:** *A Equipe de Moderação do servidor pode tomar medidas punitivas conforme considerado apropriado, em quaisquer situações, mesmo que não esteja explícito nas regras.*
4. **Termos de Serviço do Discord:** *Nosso servidor também segue os [Termos de Serviço do Discord](https://discord.com/terms), desrespeitar eles irá acarretar em banimento imediato e denúncia de sua conta.*`)
      )
    
    msg.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [container]
    })
  }
}