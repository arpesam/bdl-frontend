import { neutral, positive, info, alert, danger } from './utils'

export function processGroup3(exams, group2Suggestion) {
  const g2s = group2Suggestion
  let hasCronicHepatopatia = exams.set_hemostasis_value.includes('Hepatopatia crônica')
  let leococites = exams.selected_leucocito
  let plaquetas = exams.selected_plaquetas
  let ferro = exams.selected_ferro_serico
  let ferritine = exams.selected_ferritina
  let sat_transferrina = exams.selected_transferrine_saturation
  let b12 = exams.selected_b12_vitamine
  let folic_acid = exams.selected_folic_acid

  let FERR_LT_30 = ferritine == '< 30 mcg/L'
  let FERR_30_100 = ferritine == '≥ 30 e < 100 mcg/L'
  let FERR_100_500 = ferritine == '≥100 e < 500 mcg/L'
  let FERR_GT_500 = ferritine == '≥ 500 mcg/L'
  let FERR_LT_500 = FERR_LT_30 || FERR_30_100 || FERR_100_500

  let SAT_LT_20 = sat_transferrina == '< 20%'
  let SAT_GT_20 = sat_transferrina == '≥ 20% e ≤ 30%' || sat_transferrina == '> 30%'
  let SAT_20_30 = sat_transferrina == '≥ 20% e ≤ 30%'
  let SAT_GT_30 = sat_transferrina == '> 30%'

  let B12_LT_200 = b12 == '< 200 ng/L'
  let B12_GT_200 = b12 == '≥ 200 ng/L'

  let FOLIC_LT_6 = folic_acid == '< 6 ng/ml'
  let FOLIC_GT_6 = folic_acid == '≥ 6 ng/ml'

  let LEOC_LT_4000 = leococites == '<4000'
  let LEOC_GT_4000 = leococites == '≥4000'

  let PLAQ_LT_100 = plaquetas == '<100'
  let PLAQ_GT_100 = plaquetas == '≥100'

  if (g2s.flow.includes('G2-20')) {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-XX',
      conductText:
        'Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.'
    }
  }

  const defaultResp = (flow, conductText) => ({
    ...group2Suggestion,
    color: info,
    flow: group2Suggestion.flow + '/' + flow,
    conductText: conductText
  })

  const inc = (flow) => {
    let fl = group2Suggestion.flow.split('/')
    if (fl.length == 2) {
      return fl[1] == flow
    }
    console.log('================================', flow, group2Suggestion.flow)
    return group2Suggestion.flow.includes(flow)
  }

  // G2-1 - verificado
  {
    if (inc('G2-1') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-1',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )

    if (inc('G2-1') && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-2',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )

    if (inc('G2-1') && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-3',
        'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )

    if (inc('G2-1') && FERR_GT_500)
      return defaultResp(
        'G3-4',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )

    if (inc('G2-1') && SAT_GT_20)
      return defaultResp(
        'G3-5',
        'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
      )
  }

  // G2-2 - verificado
  {
    if (inc('G2-2') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-6',
        'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-2') && FERR_GT_500)
      return defaultResp(
        'G3-7',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-2') && FERR_LT_500 && SAT_20_30)
      return defaultResp(
        'G3-8',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso.'
      )
    if (inc('G2-2') && SAT_GT_30)
      return defaultResp(
        'G3-9',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
  }

  // G2-3 - verificado
  {
    if (inc('G2-3') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-10',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-3') && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-11',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-3') && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-12',
        'Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-3') && FERR_GT_500)
      return defaultResp(
        'G3-13',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-3') && SAT_GT_20)
      return defaultResp(
        'G3-14',
        'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
      )
  }

  // G2-4 - verificado
  {
    if (inc('G2-4') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-15',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-4') && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-16',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-4') && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-17',
        'Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-4') && FERR_GT_500)
      return defaultResp(
        'G3-18',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-4') && SAT_GT_20)
      return defaultResp('G3-19', 'Sem necessidade de reposição com ferro.')
  }

  // G2-5
  {
    if (inc('G2-5') && B12_LT_200 && FOLIC_LT_6)
      return defaultResp(
        'G3-20',
        'Anemia megaloblástica. Iniciar reposição de vitamina B12 e ácido fólico.'
      )

    if (inc('G2-5') && B12_LT_200 && FOLIC_GT_6)
      return defaultResp('G3-21', 'Anemia megaloblástica. Iniciar reposição de vitamina B12.')

    if (inc('G2-5') && B12_GT_200 && FOLIC_LT_6)
      return defaultResp('G3-22', 'Realizar reposição de ácido fólico 5mg/dia VO 3x por semana.')
  }

  // G2-16
  {
    if (inc('G2-16') && B12_GT_200 && FOLIC_GT_6)
      return defaultResp(
        'G3-23',
        'Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.'
      )
  }

  // G2-17
  {
    if (inc('G2-17') && B12_GT_200 && FOLIC_GT_6)
      return defaultResp(
        'G3-24',
        'Encaminhar ao Hematologista para investigação de anemia e leucopenia'
      )
  }

  // G2-18
  {
    if (inc('G2-18') && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-25',
        'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico.'
      )

    if (inc('G2-18') && B12_GT_200 && FOLIC_GT_6 && !hasCronicHepatopatia)
      return defaultResp('G3-26', 'Encaminhar ao Hematologista para investigação de pancitopenia.')
  }

  // G2-19
  {
    if (inc('G2-19') && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-27',
        'Provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI.'
      )

    if (inc('G2-19') && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp('G3-28', 'Encaminhar ao hematologista. Possível mielodisplasia.')
  }

  // TODO VALIDAR SE o  G4 esta adicionando as condutas adicionais aqui
  // G2-6
  {
    if (inc('G2-6') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-29',
        'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-6') && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-30',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-6') && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-31',
        'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-6') && FERR_GT_500)
      return defaultResp(
        'G3-32',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-6') && SAT_GT_20)
      return defaultResp('G3-33', 'Sem necessidade de reposição com ferro.')
  }

  // G2-8
  {
    if (inc('G2-8') && FERR_LT_30 && SAT_LT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-34',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500. Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico.'
      )
    if (inc('G2-8') && FERR_30_100 && SAT_LT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-35',
        'Provavél deficiência de ferro. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro. Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico.'
      )
    if (inc('G2-8') && FERR_30_100 && SAT_GT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-36',
        'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
  }

  // G2-9
  {
    if (
      inc('G2-9') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-37',
        'Possível deficiência funcional de ferro se paciente com sangramento crônico.  Considerar teste terapêutico com ferro EV.  Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
    if (inc('G2-9') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-38',
        'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
    if (inc('G2-9') && SAT_LT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-39',
        'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
  }

  // G2-10
  {
    if (
      inc('G2-10') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-40',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.  Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
    if (inc('G2-10') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-41',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.  Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
    if (inc('G2-10') && SAT_LT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-42',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.  Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
  }

  // G2-11
  {
    if (inc('G2-11') && FERR_LT_30 && SAT_LT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-43',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (
      inc('G2-11') &&
      FERR_30_100 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-44',
        'Provavél deficiência de ferro. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro'
      )
    if (
      inc('G2-11') &&
      FERR_LT_30 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-45',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (
      inc('G2-11') &&
      FERR_30_100 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-46',
        'Provavél deficiência de ferro. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro'
      )
  }

  // G2-12
  {
    if (
      inc('G2-12') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-47',
        'Possível deficiência funcional de ferro se paciente com sangramento crônico. Considerar teste terapêutico com ferro EV.'
      )
    if (inc('G2-12') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp('G3-48', 'Provável anemia da inflamação.')
    if (inc('G2-12') && SAT_GT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp('G3-49', 'Provável anemia da inflamação.')
    if (
      inc('G2-12') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      !hasCronicHepatopatia
    )
      return defaultResp('G3-50', 'Encaminhar ao Hematologista. Possível Mielodisplasia.')
    if (inc('G2-12') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && !hasCronicHepatopatia)
      return defaultResp('G3-51', 'Encaminhar ao Hematologista. Possível Mielodisplasia.')
    if (inc('G2-12') && SAT_GT_20 && B12_GT_200 && FOLIC_GT_6 && !hasCronicHepatopatia)
      return defaultResp('G3-52', 'Encaminhar ao Hematologista. Possível Mielodisplasia.')
  }

  // G2-13
  {
    if (
      inc('G2-13') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-53',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-13') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-54',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-13') && SAT_GT_20 && B12_GT_200 && FOLIC_GT_6 && hasCronicHepatopatia)
      return defaultResp(
        'G3-55',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (
      inc('G2-13') &&
      FERR_100_500 &&
      SAT_LT_20 &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-56',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-13') && FERR_GT_500 && B12_GT_200 && FOLIC_GT_6 && !hasCronicHepatopatia)
      return defaultResp(
        'G3-57',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO'
      )
    if (inc('G2-13') && SAT_GT_20 && B12_GT_200 && FOLIC_GT_6 && !hasCronicHepatopatia)
      return defaultResp(
        'G3-58',
        'Provável anemia da DRC. Encaminhar ao nefrologista para avaliar inicio de EPO'
      )
  }

  // G2-7
  {
    if (inc('G2-7') && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-58',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-7') && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-59',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-7') && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-60',
        'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
  }

  // G2-14
  {
    if (inc('G2-14') && FERR_GT_500)
      return defaultResp(
        'G3-61',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-14') && SAT_GT_20)
      return defaultResp(
        'G3-62',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
  }

  // G2-15
  {
    if (inc('G2-15') && FERR_GT_500)
      return defaultResp(
        'G3-63',
        'Anemia por doença renal crônica. Encaminhar ao nefro para avaliar inicio de EPO.'
      )
    if (inc('G2-15') && SAT_GT_20)
      return defaultResp(
        'G3-64',
        'Anemia por doença renal crônica. Encaminhar ao nefro para avaliar inicio de EPO.'
      )
  }

  return {
    ...group2Suggestion,
    flow: group2Suggestion.flow + '/' + 'G3-00',
    conductText:
      'Infelizmente não foi possível processar uma sugestão de conduta, a combinação de exames não foi mapeada. Verifique se os dados fornecidos estão corretos e clique em Salvar para processar novamente.'
  }
}
