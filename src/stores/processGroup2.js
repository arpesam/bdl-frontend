import { neutral, positive, info, alert, danger } from './utils'

export function processGroup2(exams, group1Suggestion) {
  let vcm = exams.selected_vcm
  let hcm = exams.selected_hcm
  let hasHemoglobinopatia = exams.previous_hemoglobine_value.length && !exams.previous_hemoglobine_value.includes('Não')
  let leococites = exams.selected_leucocito
  let plaquetas = exams.selected_plaquetas

  let VCM_LT_80 = vcm == '<80fl'
  let VCM_LT_100 = vcm == '<80fl' || vcm == '80-100fl'
  let VCM_80_100 = vcm == '80-100fl'
  let VCM_GT_80 = vcm == '80-100fl' || vcm == '>100fl'
  let VCM_GT_100 = vcm == '>100fl'

  let HCM_LT_32 = hcm == '<27pg' || hcm == '27-32pg'
  let HCM_27_32 = hcm == '27-32pg'
  let HCM_LT_27 = hcm == '<27pg'
  let HCM_GT_27 = hcm == '27-32pg' || hcm == '>32pg'
  let HCM_GT_32 = hcm == '>32pg'

  let TFG_LT_60 = exams.selected_gloumerar == 'TFG < 60 ml/min/1,73m2'
  let TFG_GT_60 = exams.selected_gloumerar == 'TFG > 60 ml/min/1,73m2'

  let LEOC_LT_4000 = leococites == '<4000'
  let LEOC_GT_4000 = leococites == '≥4000'

  let PLAQ_LT_100 = plaquetas == '<100'
  let PLAQ_GT_100 = plaquetas == '≥100'

  const defaultResp = (flow) => {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + flow,
      askFerroSerico: false,
      askFerritine: true,
      askFerritineSaturation: true
    }
  }

  if (hasHemoglobinopatia) {
    return {
      conductText: 'Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.',
      flow: group1Suggestion.flow + '/' + 'G2-20',
      color: info
    }
  }

  // Do not remove !hasHemoglobionpia from here,
  // keep all the conditions explicit, consider that the logic can be moved to anywhere
  if (VCM_LT_80 && TFG_GT_60 && !hasHemoglobinopatia) return defaultResp('G2-1')
  if (VCM_LT_100 && TFG_LT_60 && HCM_LT_32 && !hasHemoglobinopatia) return defaultResp('G2-2')
  if (VCM_80_100 && TFG_GT_60 && HCM_LT_27 && !hasHemoglobinopatia) return defaultResp('G2-3')
  if (VCM_80_100 && TFG_GT_60 && HCM_27_32 && !hasHemoglobinopatia) return defaultResp('G2-4')
  if (VCM_GT_100 && HCM_GT_32 && !hasHemoglobinopatia)
    return {
      ...defaultResp('G2-5'),
      askB12Vitamine: true,
      askFolicAcid: true,
      askFerroSerico: false,
      askFerritine: false,
      askFerritineSaturation: false
    }

  if (VCM_GT_100 && TFG_GT_60 && HCM_27_32 && !hasHemoglobinopatia)
    return {
      ...defaultResp('G2-6'),
      askB12Vitamine: true,
      askFolicAcid: true,
      askFerroSerico: false,
      askFerritine: true,
      askFerritineSaturation: true
    }

  if (VCM_GT_100 && TFG_LT_60 && HCM_27_32 && !hasHemoglobinopatia)
    return {
      ...defaultResp('G2-7'),
      askB12Vitamine: true,
      askFolicAcid: true,
      askFerroSerico: false,
      askFerritine: true,
      askFerritineSaturation: true
    }

  if (VCM_80_100 && TFG_GT_60 && HCM_GT_32 && !hasHemoglobinopatia)
    return {
      ...defaultResp('G2-8'),
      askB12Vitamine: true,
      askFolicAcid: true,
      askFerroSerico: false,
      askFerritine: true,
      askFerritineSaturation: true
    }

  if (VCM_80_100 && TFG_LT_60 && HCM_GT_32 && !hasHemoglobinopatia)
    return {
      ...defaultResp('G2-9'),
      askB12Vitamine: true,
      askFolicAcid: true,
      askFerroSerico: false,
      askFerritine: true,
      askFerritineSaturation: true
    }

  return {
    ...group1Suggestion,
    flow: group1Suggestion.flow + '/' + 'G2-00',
    askFerroSerico: false,
    askFerritine: true,
    askFerritineSaturation: true,
    askB12Vitamine: true,
    askFolicAcid: true
  }
}
