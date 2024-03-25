import { defineStore } from 'pinia'
import { processGroup1 } from './processGroup1'
import { processGroup2 } from './processGroup2'
import { processGroup3 } from './processGroup3'
import { processGroup4 } from './processGroup4'

import { neutral, positive, info, alert, danger } from './utils'

export const useExamStore = defineStore('examStore', {
  state: () => ({
    saveButtonClicked: 0,
    saveButtonClicked2: 0,
    saveButtonClicked3: 0
  }),
  persist: true,
  getters: {
    getPatientByID: (state) => (id) => {
      return state.patients.find((pt) => pt._id === id)
    }
  },
  actions: {
    processExamInputsAction: (state) => (exams) => {
      return processExamInputs(exams)
    },
    hasSaved(v) {
      this.userClickedInSave = v
    }
  }
})

function processExamInputs(exams = {}) {
  let isGroup1Filled = checkGroup1Filled(exams)
  console.log('isGroup1Filled', isGroup1Filled)
  const examStore = useExamStore()

  // Access the saveButtonClicked state
  const saveButtonClicked = examStore.saveButtonClicked

  console.log('saveButtonClicked', saveButtonClicked)

  let isGroup2Filled = checkGroup2Filled(exams)
  if (!isGroup1Filled || saveButtonClicked == 0) {
    // check also if the button was clicked
    console.log('>>>> !isGroup1Filled || saveButtonClicked == 0')
    let resp = {
      flow: 'NO-INPUT',
      conductText:
        'Complete todos os dados abaixo e clique em "Salvar". \n A conduta será mostrada aqui. Você pode salvar e retornar quando quiser.',
      color: neutral
    }

    if (isGroup1Filled) {
      resp.isGroup1Filled = true
    }

    if (isGroup2Filled) {
      resp.isGroup2Filled = true
    }
    return returnMiddleware(resp, exams)
  }

  const saveButtonClicked2 = examStore.saveButtonClicked2
  console.log('saveButtonClicked2', saveButtonClicked2)

  const group1Suggestion = processGroup1(exams)
  console.log('group1Suggestion', group1Suggestion)

  isGroup2Filled = checkGroup2Filled(exams)
  console.log('isGroup2Filled', isGroup2Filled)

  if (isGroup1Filled && !isGroup2Filled) {
    console.log('>>>> isGroup1Filled && !isGroup2Filled')
    group1Suggestion.isGroup1Filled = isGroup1Filled
    group1Suggestion.isGroup2Filled = isGroup2Filled
    console.log('group 2 not filled, returning group 1 suggestion')
    return returnMiddleware(group1Suggestion, exams)
  }

  const group2Suggestion = processGroup2(exams, group1Suggestion)
  console.log('group2Suggestion', group2Suggestion)

  if (isGroup1Filled && isGroup2Filled && saveButtonClicked2 == 0) {
    console.log('>>>> isGroup1Filled && isGroup2Filled && saveButtonClicked2 == 0')
    group1Suggestion.isGroup1Filled = isGroup1Filled
    group1Suggestion.isGroup2Filled = isGroup2Filled
    return returnMiddleware(group1Suggestion, exams)
  }

  let isGroup3Filled = checkGroup3Filled(exams, group2Suggestion)
  console.log('isGroup3Filled', isGroup3Filled)

  if (isGroup1Filled && isGroup2Filled && !isGroup3Filled) {
    console.log('>>>> isGroup1Filled && isGroup2Filled && !isGroup3Filled')
    group2Suggestion.isGroup1Filled = isGroup1Filled
    group2Suggestion.isGroup2Filled = isGroup2Filled
    console.log('group 3 not filled, returning group 2 suggestion')
    return returnMiddleware(group2Suggestion, exams)
  }

  const group3Suggestion = processGroup3(exams, group2Suggestion)
  console.log('group3Suggestion', group3Suggestion)
  group1Suggestion.isGroup3Filled = isGroup3Filled

  console.log('+++++++++++++++++++', isGroup1Filled, isGroup2Filled, isGroup3Filled)
  if (isGroup1Filled && isGroup2Filled && isGroup3Filled) {
    console.log('>>>> isGroup1Filled && isGroup2Filled && isGroup3Filled')
    group3Suggestion.isGroup1Filled = isGroup1Filled
    group3Suggestion.isGroup2Filled = isGroup2Filled
    group3Suggestion.isGroup3Filled = isGroup3Filled
    return returnMiddleware(group3Suggestion, exams)
  }

  return {
    flow: 'NO-INPUT',
    color: '#8607ed'
  }
}

function returnMiddleware(suggestion = {}, exams = {}) {
  let leococites = exams.selected_leucocito
  let plaquetas = exams.selected_plaquetas
  let b12 = exams.selected_b12_vitamine
  let folic_acid = exams.selected_folic_acid
  console.log('leococites ', leococites, plaquetas)

  if (leococites == '<4000' && plaquetas == '<100') {
    suggestion.askB12Vitamine = true
    suggestion.askFolicAcid = true
  }

  console.log('>>>> returnMiddleware', suggestion)
  // G2-5 already takes care of the following logic, so we should not concatenate any othem conduct text
  let isG2_5 = suggestion.flow.includes('G2-5')
  if (
    isG2_5 ||
    !suggestion.isGroup1Filled ||
    !suggestion.isGroup2Filled ||
    !suggestion.isGroup3Filled
  ) {
    console.log(
      '>>>> isG2_5 || !suggestion.isGroup1Filled || !suggestion.isGroup2Filled || !suggestion.isGroup3Filled'
    )
    return suggestion
  }

  console.log('end of processing')
  return processGroup4(suggestion, exams)
}

// function processGroup1(exams) {
//   let hb = exams.selected_hb
//   let comorbidity = exams.comorbities.length > 0 && !exams.comorbities.includes('Não')
//   let physicalSymptoms =
//     exams.selected_physical_exam.length > 0 && !exams.selected_physical_exam.includes('Não')
//   let HB_LT_7 = hb == 'Hb<7'
//   let HB_7_8 = hb == '7≤Hb<8'
//   let HB_8_13 = hb === '8≤Hb<13'

//   const defaultResp = (flow, color, conductText) => ({
//     flow: flow,
//     color: color,
//     conductText: conductText
//   })

//   if (HB_LT_7 && !comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-1',
//       positive,
//       'A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_LT_7 && comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-2',
//       alert,
//       'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_LT_7 && comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-3',
//       danger,
//       'Provavelmente se beneficiará com a transfusão. Porém é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Este é um paciente de maior risco pré-operatório. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_LT_7 && !comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-4',
//       alert,
//       'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_7_8 && !comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-5',
//       positive,
//       'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_7_8 && comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-6',
//       alert,
//       'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_7_8 && comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-7',
//       danger,
//       'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_7_8 && !comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-8',
//       positive,
//       'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_8_13 && !comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-9',
//       positive,
//       'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_8_13 && comorbidity && !physicalSymptoms)
//     return defaultResp(
//       'G1-10',
//       positive,
//       'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_8_13 && comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-11',
//       alert,
//       'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   if (HB_8_13 && !comorbidity && physicalSymptoms)
//     return defaultResp(
//       'G1-12',
//       positive,
//       'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
//     )
//   return {}
// }

// function processGroup2(exams, group1Suggestion) {
//   let vcm = exams.selected_vcm
//   let hcm = exams.selected_hcm
//   let hasHemoglobinopatia =
//     exams.previous_hemoglobine_value.length && !exams.previous_hemoglobine_value.includes('Não')

//   let VCM_LT_80 = vcm == '<80fl'
//   let VCM_LT_100 = vcm == '<80fl' || vcm == '80-100fl'
//   let VCM_80_100 = vcm == '80-100fl'
//   let VCM_GT_80 = vcm == '80-100fl' || vcm == '>100fl'
//   let VCM_GT_100 = vcm == '>100fl'

//   let HCM_LT_32 = hcm == '<27pg' || hcm == '27-32pg'
//   let HCM_27_32 = hcm == '27-32pg'
//   let HCM_LT_27 = hcm == '<27pg'
//   let HCM_GT_27 = hcm == '27-32pg' || hcm == '>32pg'
//   let HCM_GT_32 = hcm == '>32pg'

//   let TFG_LT_60 = exams.selected_gloumerar == 'TFG < 60 ml/min/1,73m2'
//   let TFG_GT_60 = exams.selected_gloumerar == 'TFG > 60 ml/min/1,73m2'

//   const defaultResp = (flow) => ({
//     ...group1Suggestion,
//     flow: group1Suggestion.flow + '/' + flow,
//     askFerroSerico: true,
//     askFerritine: true,
//     askFerritineSaturation: true
//   })

//   if (hasHemoglobinopatia) {
//     return {
//       conductText:
//         'Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.',
//       flow: group1Suggestion.flow + '/' + 'G2-8',
//       color: info
//     }
//   }

//   // Do not remove !hasHemoglobionpia from here,
//   // keep all the conditions explicit, consider that the logic can be moved to anywhere
//   if (VCM_LT_80 && TFG_GT_60 && !hasHemoglobinopatia) return defaultResp('G2-1')
//   if (VCM_LT_100 && HCM_LT_32 && TFG_LT_60 && !hasHemoglobinopatia) return defaultResp('G2-2')
//   if (VCM_80_100 && HCM_LT_27 && TFG_GT_60 && !hasHemoglobinopatia) return defaultResp('G2-3')
//   if (VCM_80_100 && HCM_27_32 && TFG_GT_60 && !hasHemoglobinopatia) return defaultResp('G2-4')
//   if (VCM_GT_100 && HCM_GT_32 && !hasHemoglobinopatia)
//     return {
//       ...defaultResp('G2-5'),
//       askB12Vitamine: true,
//       askFolicAcid: true,
//       askFerroSerico: false,
//       askFerritine: false,
//       askFerritineSaturation: false
//     }
//   if (VCM_GT_100 && HCM_27_32 && !hasHemoglobinopatia)
//     return { ...defaultResp('G2-6'), askB12Vitamine: true, askFolicAcid: true }
//   if (VCM_80_100 && HCM_GT_32 && !hasHemoglobinopatia)
//     return { ...defaultResp('G2-7'), askB12Vitamine: true, askFolicAcid: true }

//   return {
//     ...group1Suggestion,
//     flow: group1Suggestion.flow + '/' + 'G2-00',
//     askFerroSerico: true,
//     askFerritine: true,
//     askFerritineSaturation: true,
//     askB12Vitamine: true,
//     askFolicAcid: true
//   }
// }

// function processGroup3(exams, group2Suggestion) {
//   const g2s = group2Suggestion
//   let hasCronicHepatopatia = exams.set_hemostasis_value.includes('Hepatopatia crônica')
//   let leococites = exams.selected_leucocito
//   let plaquetas = exams.selected_plaquetas
//   let ferro = exams.selected_ferro_serico
//   let ferritine = exams.selected_ferritina
//   let sat_transferrina = exams.selected_transferrine_saturation
//   let b12 = exams.selected_b12_vitamine
//   let folic_acid = exams.selected_folic_acid

//   let FERR_LT_30 = ferritine == '< 30 mcg/L'
//   let FERR_30_100 = ferritine == '≥ 30 e < 100 mcg/L'
//   let FERR_100_500 = ferritine == '≥100 e < 500 mcg/L'
//   let FERR_GT_500 = ferritine == '≥ 500 mcg/L'
//   let FERR_LT_500 = FERR_LT_30 || FERR_30_100 || FERR_100_500

//   let SAT_LT_20 = sat_transferrina == '< 20%'
//   let SAT_GT_20 = sat_transferrina == '≥ 20% e ≤ 30%' || sat_transferrina == '> 30%'
//   let SAT_20_30 = sat_transferrina == '≥ 20% e ≤ 30%'
//   let SAT_GT_30 = sat_transferrina == '> 30%'

//   let B12_LT_200 = b12 == '< 200 ng/L'
//   let B12_GT_200 = b12 == '≥ 200 ng/L'

//   let FOLIC_LT_6 = folic_acid == '< 6 ng/ml'
//   let FOLIC_GT_6 = folic_acid == '≥ 6 ng/ml'

//   let LEOC_LT_4000 = leococites == '<4000'
//   let LEOC_GT_4000 = leococites == '≥4000'

//   let PLAQ_LT_100 = plaquetas == '<100'
//   let PLAQ_GT_100 = plaquetas == '≥100'

//   if (g2s.flow.includes('G2-8')) {
//     return {
//       ...group2Suggestion,
//       color: info,
//       flow: group2Suggestion.flow + '/' + 'G3-XX',
//       conductText:
//         'Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.'
//     }
//   }

//   const defaultResp = (flow, conductText) => ({
//     ...group2Suggestion,
//     color: info,
//     flow: group2Suggestion.flow + '/' + flow,
//     conductText: conductText
//   })

//   const inc = (flow) => group2Suggestion.flow.includes(flow)

//   // G2-1
//   if (inc('G2-1') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-1',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-1') && FERR_30_100 && SAT_LT_20)
//     return defaultResp(
//       'G3-2',
//       'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
//     )
//   if (inc('G2-1') && FERR_100_500 && SAT_LT_20)
//     return defaultResp(
//       'G3-3',
//       'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
//     )
//   if (inc('G2-1') && FERR_GT_500)
//     return defaultResp('G3-4', 'Anemia por doença crônica, sem necessidade de reposição com ferro.')
//   if (inc('G2-1') && SAT_GT_20)
//     return defaultResp(
//       'G3-5',
//       'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
//     )

//   // G2-2
//   if (inc('G2-2') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-6',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-2') && FERR_GT_500)
//     return defaultResp(
//       'G3-7',
//       'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-2') && FERR_LT_500 && SAT_20_30)
//     return defaultResp(
//       'G3-8',
//       'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso.'
//     )
//   if (inc('G2-2') && SAT_GT_30)
//     return defaultResp(
//       'G3-9',
//       'Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )

//   // G2-3
//   if (inc('G2-3') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-10',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-3') && FERR_30_100 && SAT_LT_20)
//     return defaultResp(
//       'G3-11',
//       'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
//     )
//   if (inc('G2-3') && FERR_100_500 && SAT_LT_20)
//     return defaultResp(
//       'G3-12',
//       'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
//     )
//   if (inc('G2-3') && FERR_GT_500)
//     return defaultResp(
//       'G3-13',
//       'Anemia por doença crônica, sem necessidade de reposição com ferro.'
//     )
//   if (inc('G2-3') && SAT_GT_20)
//     return defaultResp(
//       'G3-14',
//       'Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista.'
//     )

//   // G2-4
//   if (inc('G2-4') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-15',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-4') && FERR_30_100 && SAT_LT_20)
//     return defaultResp(
//       'G3-16',
//       'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
//     )
//   if (inc('G2-4') && FERR_100_500 && SAT_LT_20)
//     return defaultResp(
//       'G3-17',
//       'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
//     )
//   if (inc('G2-4') && FERR_GT_500)
//     return defaultResp(
//       'G3-18',
//       'Anemia por doença crônica, sem necessidade de reposição com ferro.'
//     )
//   if (inc('G2-4') && SAT_GT_20)
//     return defaultResp('G3-19', 'Sem necessidade de reposição com ferro.')

//   // G2-5
//   if (
//     inc('G2-5') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-25',
//       'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
//     )
//   if (
//     inc('G2-5') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-26', 'Encaminhar ao Hematologista para investigação de pancitopenia.')
//   if (
//     inc('G2-5') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-27',
//       `Provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI. Ferritina atual:${ferritine}, saturação transferritina atual: ${sat_transferrina}.`
//     )
//   if (
//     inc('G2-5') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-28', 'Encaminhar ao hematologista. Possível mielodisplasia.')
//   if (inc('G2-5') && B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100)
//     return defaultResp(
//       'G3-23',
//       'Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.'
//     )
//   if (inc('G2-5') && B12_GT_200 && FOLIC_GT_6 && LEOC_LT_4000 && PLAQ_GT_100)
//     return defaultResp(
//       'G3-24',
//       'Encaminhar ao Hematologista para investigação de anemia e leucopenia.'
//     )
//   if (inc('G2-5') && B12_LT_200 && FOLIC_LT_6)
//     return defaultResp(
//       'G3-20',
//       'Anemia megaloblástica. Iniciar reposição de vitamina B12 e ácido fólico.'
//     )
//   if (inc('G2-5') && B12_LT_200 && FOLIC_GT_6)
//     return defaultResp('G3-21', 'Anemia megaloblástica. Iniciar reposição de vitamina B12.')
//   if (inc('G2-5') && B12_GT_200 && FOLIC_LT_6)
//     return defaultResp('G3-22', 'Realizar reposição de ácido fólico 5mg/dia VO 3x por semana.')

//   // G2-6

//   if (
//     inc('G2-6') &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     FERR_LT_30 &&
//     SAT_LT_20 &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-34',
//       'Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500. Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico.'
//     )
//   if (
//     inc('G2-6') &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     FERR_30_100 &&
//     SAT_LT_20 &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-35',
//       'Provavél deficiência de ferro. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro. Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico.'
//     )
//   if (
//     inc('G2-6') &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     FERR_100_500 &&
//     SAT_LT_20 &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-36',
//       'Possível deficiência funcional de ferro se paciente com sangramento crônico.  Considerar teste terapêutico com ferro EV.  Plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
//     )

//   if (
//     inc('G2-6') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-34',
//       'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
//     )
//   if (
//     inc('G2-6') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-35', 'Encaminhar ao Hematologista para investigação de pancitopenia.')
//   if (
//     inc('G2-6') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-36',
//       `Provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI. Ferritina atual:${ferritine}, saturação transferritina atual: ${sat_transferrina}.`
//     )
//   if (
//     inc('G2-6') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-37', 'Encaminhar ao hematologista. Possível mielodisplasia.')
//   if (inc('G2-6') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-29',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-6') && FERR_30_100 && SAT_LT_20)
//     return defaultResp(
//       'G3-30',
//       'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
//     )
//   if (inc('G2-6') && FERR_100_500 && SAT_LT_20)
//     return defaultResp(
//       'G3-31',
//       'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
//     )
//   if (inc('G2-6') && FERR_GT_500)
//     return defaultResp(
//       'G3-32',
//       'Anemia por doença crônica, sem necessidade de reposição com ferro.'
//     )
//   if (inc('G2-6') && SAT_GT_20)
//     return defaultResp('G3-33', 'Sem necessidade de reposição com ferro.')

//   // G2-7
//   if (
//     inc('G2-7') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-43',
//       'Provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoterapêuta a necessidade de transfusão de CP a depender do procedimento cirúrgico.'
//     )
//   if (
//     inc('G2-7') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_LT_4000 &&
//     PLAQ_LT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-44', 'Encaminhar ao Hematologista para investigação de pancitopenia.')
//   if (
//     inc('G2-7') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     hasCronicHepatopatia
//   )
//     return defaultResp(
//       'G3-45',
//       `Provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI. Ferritina atual:${ferritine}, saturação transferritina atual: ${sat_transferrina}.`
//     )
//   if (
//     inc('G2-7') &&
//     B12_GT_200 &&
//     FOLIC_GT_6 &&
//     LEOC_GT_4000 &&
//     PLAQ_GT_100 &&
//     !hasCronicHepatopatia
//   )
//     return defaultResp('G3-46', 'Encaminhar ao hematologista. Possível mielodisplasia.')
//   if (inc('G2-7') && FERR_LT_30 && SAT_LT_20)
//     return defaultResp(
//       'G3-38',
//       'Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO.'
//     )
//   if (inc('G2-7') && FERR_30_100 && SAT_LT_20)
//     return defaultResp(
//       'G3-39',
//       'Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro.'
//     )
//   if (inc('G2-7') && FERR_100_500 && SAT_LT_20)
//     return defaultResp(
//       'G3-40',
//       'Possível deficiência funcional de ferro se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro.'
//     )
//   if (inc('G2-7') && FERR_GT_500)
//     return defaultResp(
//       'G3-41',
//       'Anemia por doença crônica, sem necessidade de reposição com ferro.'
//     )
//   if (inc('G2-7') && SAT_GT_20)
//     return defaultResp('G3-42', 'Sem necessidade de reposição com ferro.')

//   return {
//     ...group2Suggestion,
//     flow: group2Suggestion.flow + '/' + 'G3-00',
//     conductText:
//       'Infelizmente não foi possível processar uma sugestão de conduta, a combinação de exames não foi mapeada. Verifique se os dados fornecidos estão corretos e clique em Salvar para processar novamente.'
//   }
// }

// function processGroup4(suggestion, exams) {
//   let b12 = exams.selected_b12_vitamine
//   let folic_acid = exams.selected_folic_acid
//   let leococites = exams.selected_leucocito
//   let plaquetas = exams.selected_plaquetas

//   let B12_LT_200 = b12 == '< 200 ng/L'
//   let B12_GT_200 = b12 == '≥ 200 ng/L'

//   let FOLIC_LT_6 = folic_acid == '< 6 ng/ml'
//   let FOLIC_GT_6 = folic_acid == '≥ 6 ng/ml'

//   let LEOC_LT_4000 = leococites == '<4000'
//   let LEOC_GT_4000 = leococites == '≥4000'

//   let PLAQ_LT_100 = plaquetas == '<100'
//   let PLAQ_GT_100 = plaquetas == '≥100'

//   let isG2_6 = suggestion.flow.includes('G2-6')

//   if (B12_LT_200 && FOLIC_LT_6) {
//     suggestion.flow += '/G4-1'
//     suggestion.conductText2 =
//       '*  Anemia megaloblástica. Iniciar reposição de vitamina B12 e ácido fólico. Sugerimos B12 5mg/dia IM por 5 dias e ácido fólico 5mg/dia VO 3 vezes por semana.'
//     return suggestion
//   }

//   if (B12_LT_200 && FOLIC_GT_6) {
//     suggestion.flow += '/G4-2'
//     suggestion.conductText2 =
//       '* Anemia megaloblástica. Iniciar reposição de vitamina B12. Sugerimos a aplicação 5mg/dia IM por 5 dias e após 5mg IM a cada 3 meses.'
//     return suggestion
//   }

//   if (B12_GT_200 && FOLIC_LT_6) {
//     suggestion.flow += '/G4-3'
//     suggestion.conductText2 =
//       '* Anemia megaloblástica. Iniciar reposição com ácido fólico 5mg/dia vo 3 vezes na semana.'
//     return suggestion
//   }

//   if (isG2_6 && B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100) {
//     suggestion.flow += '/G4-4'
//     suggestion.conductText2 =
//       '* Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.'
//     return suggestion
//   }

//   if (isG2_6 && B12_GT_200 && FOLIC_GT_6 && LEOC_LT_4000 && PLAQ_GT_100) {
//     suggestion.flow += '/G4-5'
//     suggestion.conductText2 =
//       '* Encaminhar ao Hematologista para investigação de anemia e leucopenia.'
//     return suggestion
//   }
//   return suggestion
// }

function checkGroup1Filled(exams) {
  return (
    !!exams.selected_hb &&
    !!exams.comorbities.length &&
    !!exams.selected_physical_exam.length &&
    !!exams.selected_procedure &&
    !!exams.previous_hemoglobine_value.length &&
    !!exams.hemostasis_value.length &&
    !!exams.selected_medication &&
    !!exams.selected_transfusion
  )
}

function checkGroup2Filled(exams) {
  return (
    !!checkGroup1Filled(exams) &&
    !!exams.selected_vcm &&
    !!exams.selected_hcm &&
    !!exams.selected_leucocito &&
    !!exams.selected_plaquetas &&
    !!exams.selected_gloumerar
  )
}

function checkGroup3Filled(exams, group2Suggestion = {}) {
  if (!group2Suggestion.flow) {
    console.log('no flow found for group 2')
    return false
  }

  // if it is asked, it should be filled
  let ferritineSaturation = group2Suggestion.askFerritineSaturation
    ? !!exams.selected_transferrine_saturation
    : true
  let b12Vitamine = group2Suggestion.askB12Vitamine ? !!exams.selected_b12_vitamine : true
  let folicAcid = group2Suggestion.askFolicAcid ? !!exams.selected_folic_acid : true
  let ferritine = group2Suggestion.askFerritine ? !!exams.selected_ferritina : true
  let ferroSerico = group2Suggestion.askFerroSerico ? !!exams.selected_ferro_serico : true

  return (
    !!checkGroup2Filled(exams) &&
    ferritineSaturation &&
    b12Vitamine &&
    folicAcid &&
    ferritine &&
    ferroSerico
  )
}
