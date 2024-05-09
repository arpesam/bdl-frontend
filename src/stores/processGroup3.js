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
  let FERR_LT_100 = FERR_LT_30 || FERR_30_100
  let FERR_100_500 = ferritine == '≥100 e < 500 mcg/L'
  let FERR_GT_500 = ferritine == '≥ 500 mcg/L'
  let FERR_LT_500 = FERR_LT_30 || FERR_30_100 || FERR_100_500

  let TFG_LT_60 = exams.selected_gloumerar == 'TFG < 60 ml/min/1,73m2'
  let TFG_GT_60 = exams.selected_gloumerar == 'TFG > 60 ml/min/1,73m2'

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
    return group2Suggestion.flow.includes(flow)
  }

  // G2-1 - verificado
  {
    if (inc('G2-1') && TFG_GT_60 && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-1',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )

    if (inc('G2-1') && TFG_GT_60 && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-2',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )

    if (inc('G2-1') && TFG_GT_60 && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-3',
        'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )

    if (inc('G2-1') && TFG_GT_60 && FERR_GT_500)
      return defaultResp(
        'G3-4',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )

    if (inc('G2-1') && TFG_GT_60 && SAT_GT_20)
      return defaultResp(
        'G3-5',
        'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
      )
  }

  // G2-2 - verificado
  {
    if (inc('G2-2') && TFG_LT_60 && FERR_LT_100 && SAT_LT_20)
      return defaultResp(
        'G3-6',
        'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-2') && TFG_LT_60 && FERR_GT_500)
      return defaultResp(
        'G3-7',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-2') && TFG_LT_60 && FERR_LT_500 && SAT_20_30)
      return defaultResp(
        'G3-8',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso.'
      )
    if (inc('G2-2') && TFG_LT_60 && SAT_GT_30)
      return defaultResp(
        'G3-9',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
  }

  // G2-3 - verificado
  {
    if (inc('G2-3') && TFG_GT_60 && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-10',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-3') && TFG_GT_60 && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-11',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-3') && TFG_GT_60 && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-12',
        'Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-3') && TFG_GT_60 && FERR_GT_500)
      return defaultResp(
        'G3-13',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-3') && TFG_GT_60 && SAT_GT_20)
      return defaultResp(
        'G3-14',
        'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
      )
  }

  // G2-4 - verificado
  {
    if (inc('G2-4') && TFG_GT_60 && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-15',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-4') && TFG_GT_60 && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-16',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-4') && TFG_GT_60 && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-17',
        'Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-4') && TFG_GT_60 && FERR_GT_500)
      return defaultResp(
        'G3-18',
        'Anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-4') && TFG_GT_60 && SAT_GT_20)
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

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_GT_4000 &&
      PLAQ_LT_100 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-23',
        'Encaminhar ao Hematologista para investigação de anemia e plaquetopenia. Possível mielodisplasia.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_LT_4000 &&
      PLAQ_GT_100 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-24',
        'Encaminhar ao Hematologista para investigação de anemia e leucopenia. Possível mielodisplasia.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_LT_4000 &&
      PLAQ_LT_100 &&
      !hasCronicHepatopatia
    )
      return defaultResp(
        'G3-25',
        'Encaminhar ao Hematologista para investigação de pancitopenia, possível mielodisplasia.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_GT_4000 &&
      PLAQ_GT_100 &&
      !hasCronicHepatopatia
    )
      return defaultResp('G3-26', 'Encaminhar ao hematologista. Possível mielodisplasia.')

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_GT_4000 &&
      PLAQ_GT_100 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-27',
        'Possível anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_LT_4000 &&
      PLAQ_LT_100 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-28',
        'Possível anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma estar entre 30.000 e 50.000. Avaliar nexcessidade de encaminhar ao Hematologista. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_LT_4000 &&
      PLAQ_GT_100 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-29',
        'Possível anemia da inflamação e leucopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Avaliar nexcessidade de encaminhar ao Hematologista.'
      )

    if (
      inc('G2-5') &&
      B12_GT_200 &&
      FOLIC_GT_6 &&
      LEOC_GT_4000 &&
      PLAQ_LT_100 &&
      hasCronicHepatopatia
    )
      return defaultResp(
        'G3-30',
        'Possível anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma estar entre 30.000 e 50.000. Avaliar nexcessidade de encaminhar ao Hematologista. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
      )
  }

  // G2-6
  {
    if (inc('G2-6') && TFG_GT_60 && FERR_LT_30 && SAT_LT_20)
      return defaultResp(
        'G3-31',
        'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.'
      )
    if (inc('G2-6') && TFG_GT_60 && FERR_30_100 && SAT_LT_20)
      return defaultResp(
        'G3-32',
        'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
      )
    if (inc('G2-6') && TFG_GT_60 && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-33',
        'Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
      )
    if (inc('G2-6') && TFG_GT_60 && FERR_GT_500)
      return defaultResp(
        'G3-34',
        'Provável anemia por doença crônica, sem necessidade de reposição com ferro.'
      )
    if (inc('G2-6') && TFG_GT_60 && SAT_GT_20)
      return defaultResp('G3-35', 'Sem necessidade de reposição com ferro.')
    //==========================
  }
  // G2-7
  {
    if (inc('G2-7') && TFG_LT_60 && FERR_LT_100 && SAT_LT_20)
      return defaultResp(
        'G3-36',
        'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-7') && TFG_LT_60 && FERR_100_500 && SAT_LT_20)
      return defaultResp(
        'G3-37',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso.'
      )
    if (inc('G2-7') && TFG_LT_60 && FERR_GT_500)
      return defaultResp(
        'G3-38',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
    if (inc('G2-7') && TFG_LT_60 && FERR_LT_500 && SAT_20_30)
      return defaultResp(
        'G3-39',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso.'
      )
    if (inc('G2-7') && TFG_LT_60 && SAT_GT_30)
      return defaultResp(
        'G3-40',
        'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
      )
  }

  return {
    ...group2Suggestion,
    flow: group2Suggestion.flow + '/' + 'G3-00',
    conductText:
      'Infelizmente não foi possível processar uma sugestão de conduta, a combinação de exames não foi mapeada. Verifique se os dados fornecidos estão corretos e clique em Salvar para processar novamente.'
  }
}
