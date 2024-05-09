import { neutral, positive, info, alert, danger } from './utils'

export function processGroup4(suggestion, exams) {
  let isG2_6 = suggestion.flow.includes('G2-6')
  let isG2_7 = suggestion.flow.includes('G2-6')

  if (!isG2_6 || !isG2_7) {
    console.log('--------------not g2-6 or g2-7 returningn ', suggestion)
    return suggestion
  }

  let b12 = exams.selected_b12_vitamine
  let folic_acid = exams.selected_folic_acid
  let leococites = exams.selected_leucocito
  let plaquetas = exams.selected_plaquetas

  let B12_LT_200 = b12 == '< 200 ng/L'
  let B12_GT_200 = b12 == '≥ 200 ng/L'

  let FOLIC_LT_6 = folic_acid == '< 6 ng/ml'
  let FOLIC_GT_6 = folic_acid == '≥ 6 ng/ml'

  let LEOC_LT_4000 = leococites == '<4000'
  let LEOC_GT_4000 = leococites == '≥4000'

  let PLAQ_LT_100 = plaquetas == '<100'
  let PLAQ_GT_100 = plaquetas == '≥100'
  let hasCronicHepatopatia = exams.set_hemostasis_value.includes('Hepatopatia crônica')

  if (B12_LT_200 && FOLIC_LT_6) {
    suggestion.flow += '/G4-1'
    suggestion.conductText2 = '*  Anemia megaloblástica. Iniciar reposição de vitamina B12 e ácido fólico.'
    return suggestion
  }

  if (B12_LT_200 && FOLIC_GT_6) {
    suggestion.flow += '/G4-2'
    suggestion.conductText2 = '* Anemia megaloblástica. Iniciar reposição de vitamina B12.'
    return suggestion
  }

  if (B12_GT_200 && FOLIC_LT_6) {
    suggestion.flow += '/G4-3'
    suggestion.conductText2 = '* Anemia megaloblástica. iniciar reposição de ácido fólico 5mg VO/ dia 3 vezes por semana.'
    return suggestion
  }

  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-4'
    suggestion.conductText2 = '* Encaminhar ao Hematologista para investigação de plaquetopenia.'
    return suggestion
  }

  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-5'
    suggestion.conductText2 = '* Encaminhar ao Hematologista para investigação de leucopenia.'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-6'
    suggestion.conductText2 = '* Encaminhar ao hematologista para investigação de pancitopenia.'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-7'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-8'
    suggestion.conductText2 =
      '* Provável plaquetopenia  por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma estar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-9'
    suggestion.conductText2 = '* Possível leucopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Avaliar a necessidade de encaminhar ao Hematologista.'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-10'
    suggestion.conductText2 =
      '* Possível leucopenia e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma estar entre 30.000 e 50.000. Avaliar necessidade de encaminhamento ao Hematologista. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
    return suggestion
  }
  if (B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100 && !hasCronicHepatopatia) {
    suggestion.flow += '/G4-11'
    return suggestion
  }

  return suggestion
}
