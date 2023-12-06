import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const APIbasePath = import.meta.env.VITE_API_URL

export const useExamStore = defineStore('examStore', {
  state: () => ({
    saveButtonClicked: 0,
    saveButtonClicked2: 0,
    saveButtonClicked3: 0,
  }),
  persist: true,
  getters: {
    getPatientByID: (state) => (id) => {
      return state.patients.find((pt) => pt._id === id);
    },
  },
  actions: {
    processExamInputsAction: (state) => (exams) => {
      return processExamInputs(exams)
    },
    hasSaved(v) {
      this.userClickedInSave = v
    }
  },
})


const neutral = '#455775'
const positive = 'success'
const info = 'info'
const alert = 'orange'
const danger = '#e64562'

const red = '#e64562'
const orange = 'orange'
const success = 'success'
const warning = 'warning'

function processExamInputs(exams = {}) {
  let isGroup1Filled = checkGroup1Filled(exams)
  // console.log("isGroup1Filled", isGroup1Filled);
  // console.log("isGroup2Filled", isGroup2Filled);
  const examStore = useExamStore()

  // Access the saveButtonClicked state
  const saveButtonClicked = examStore.saveButtonClicked

  console.log("saveButtonClicked", saveButtonClicked);

  let isGroup2Filled = checkGroup2Filled(exams)
  if (!isGroup1Filled || saveButtonClicked == 0) { // check also if the button was clicked
    let resp = {
      flow: "NO-INPUT",
      conductText: 'Complete todos os dados abaixo e clique em "Salvar". \n A conduta será mostrada aqui. Você pode salvar e retornar quando quiser.',
      color: neutral
    }

    if (isGroup1Filled) {
      resp.isGroup1Filled = true
    }

    if (isGroup2Filled) {
      resp.isGroup2Filled = true
    }
    return resp
  }

  const saveButtonClicked2 = examStore.saveButtonClicked2
  console.log("group 1 filled and save button clicked", );
  const  group1Suggestion =  processGroup1(exams)
  isGroup2Filled = checkGroup2Filled(exams)

  console.log("saveButtonClicked2", saveButtonClicked2);
  if (isGroup1Filled && !isGroup2Filled) {
    group1Suggestion.isGroup1Filled = isGroup1Filled
    group1Suggestion.isGroup2Filled = isGroup2Filled
    console.log("group 2 not filled, returning group 1 suggestion", );
    return group1Suggestion
  }

  console.log("processing group 2", );
  const group2Suggestion = processGroup2(exams, group1Suggestion)


  if (isGroup1Filled && isGroup2Filled && saveButtonClicked2 == 0) {
    group1Suggestion.isGroup1Filled = isGroup1Filled
    group1Suggestion.isGroup2Filled = isGroup2Filled
    console.log("group 1 and 2 filled, button not clicked", );
    return group1Suggestion
  }

  // console.log("group2Suggestion", group2Suggestion);
  let isGroup3Filled = checkGroup3Filled(exams, group2Suggestion)

  console.log("isGroup1Filled && isGroup2Filled && !isGroup3Filled", isGroup1Filled, isGroup2Filled, isGroup3Filled);
  if (isGroup1Filled && isGroup2Filled && !isGroup3Filled) {
    group2Suggestion.isGroup1Filled = isGroup1Filled
    group2Suggestion.isGroup2Filled = isGroup2Filled
    console.log("group 3 not filled, returning group 2 suggestion", );
    return group2Suggestion
  }

  console.log("processing group 3", );
  const group3Suggestion = processGroup3(exams, group2Suggestion)
  group1Suggestion.isGroup3Filled = isGroup3Filled

  if (isGroup1Filled && isGroup2Filled && isGroup3Filled) {
    group3Suggestion.isGroup1Filled = isGroup1Filled
    group3Suggestion.isGroup2Filled = isGroup2Filled
    return group3Suggestion
  }

  return {
    flow: "NO-INPUT",
    color: '#8607ed'
  }
}

function processGroup3(exams, group2Suggestion) {
  const g2s = group2Suggestion
  let hasCronicHepatopatia = exams.set_hemostasis_value.includes("Hepatopatia crônica")
  let leococites = exams.selected_leucocito
  let plaquetas = exams.selected_plaquetas
  let ferro = exams.selected_ferro_serico
  let ferritine = exams.selected_ferritina
  let sat_transferrina = exams.selected_transferrine_saturation
  let b12 = exams.selected_b12_vitamine
  let folic_acid = exams.selected_folic_acid

  if (g2s.flow.includes('G2-6')) {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-1',
      conductText: "Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.",
    }
  }

  if (g2s.flow.includes('G2-4') && ferritine == "< 30 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-2',
      conductText: "Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-4') && ferritine.trim() != "" && ferritine != "≥ 500 mcg/L" && sat_transferrina.trim() != "" && sat_transferrina == "≥ 20% e < 30%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-3',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso."
    }
  }

  if (g2s.flow.includes('G2-4') && sat_transferrina == "≥ 30%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-4',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-4') && ferritine == "≥ 500 mcg/L") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-5',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-4') && ferritine == "≥ 30 e < 100 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-26',
      conductText: "Anemia ferropriva + anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para ferro endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }


  if (g2s.flow.includes('G2-7') && ferritine == "< 30 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-27',
      conductText: "Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-7') && ferritine.trim() != "" && ferritine != "≥ 500 mcg/L" && sat_transferrina.trim() != "" && sat_transferrina == "≥ 20% e < 30%") {
    console.log("-----------xxxx-----------", ferritine, sat_transferrina);
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-28',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO e ferro endovenoso."
    }
  }

  if (g2s.flow.includes('G2-7') && sat_transferrina == "≥ 30%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-29',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-7') && ferritine == "≥ 500 mcg/L") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-30',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-7') && ferritine == "≥ 30 e < 100 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-31',
      conductText: "Anemia ferropriva + anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para ferro endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-3') && ferritine == "≥100 e < 500 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-6',
      conductText: "Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro."
    }
  }

  if (g2s.flow.includes('G2-3') && ferritine == "≥ 30 e < 100 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-7',
      conductText: "Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro."
    }
  }

  if (g2s.flow.includes('G2-3') && ferritine == "< 30 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-8',
      conductText: "Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500. Exemplo: 13-7 X 2,4 X 70 + 500 = 1508. Administrar dose total de 15 ampolas. Prescrição sugerida: 2 ampolas + SF 0,9% 250 ml ev em 30 minutos, 2 a 3 vezes por semana com intervalo mínimo de 1 dia entre as aplicações."
    }
  }

  if (g2s.flow.includes('G2-3') && ferritine == "≥ 500 mcg/L") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-9',
      conductText: "Anemia por doença crônica, sem necessidade de reposição com ferro."
    }
  }

  if (g2s.flow.includes('G2-3') && (sat_transferrina == "≥ 20% e < 30%" || sat_transferrina == "≥ 30%")) {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-10',
      conductText: "Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista."
    }
  }


  if (g2s.flow.includes('G2-2') && ferritine == "< 30 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-11',
      conductText: "Anemia ferropriva + anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-2') && ferritine.trim() != "" && ferritine != "≥ 500 mcg/L" && sat_transferrina.trim() != "" && sat_transferrina != "≥ 30%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-12',
      conductText: "Anemia ferropriva e anemia da doença renal crônica. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500.  Após tratamento, encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-2') && sat_transferrina == "≥ 30%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-13',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }

  if (g2s.flow.includes('G2-2') && ferritine == "≥ 500 mcg/L") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-14',
      conductText: "Anemia da doença renal cronica. Encaminhar ao nefrologista para avaliar inicio de EPO."
    }
  }


  if (g2s.flow.includes('G2-1') && (sat_transferrina == "≥ 20% e < 30%" || sat_transferrina == "≥ 30%")) {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-15',
      conductText: "Sem necessidade de reposição com ferro, possivel talasemia. Encaminhar ao Hematologista."
    }
  }

  if (g2s.flow.includes('G2-1') && ferritine == "≥100 e < 500 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-16',
      conductText: "Deficiência de ferro possível se paciente com doença inflamatória crônica e causa evidente de ferropenia ou com DRC em uso de EPO ± diálise ou com insuficiência cardíaca. Avaliar contexto clínico e  considerar teste terapêutico com ferro."
    }
  }

  if (g2s.flow.includes('G2-1') && ferritine == "≥ 30 e < 100 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-17',
      conductText: "Provavél deficiência de ferro se paciente com doença inflamatória crônica e/ou PCR aumentado. Realizar reposição e reavaliar resposta com HMG e novo perfil de ferro."
    }
  }

  if (g2s.flow.includes('G2-1') && ferritine == "< 30 mcg/L" && sat_transferrina == "< 20%") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-18',
      conductText: "Anemia ferropriva. Inciar reposição de ferro. Sugerimos dar preferência para fero endovenoso em caso de cirurgia próxima. Para calculo da dose total de hidróxifo de ferro: (13-Hb) X 2,4 X peso + 500. Exemplo: 13-7 X 2,4 X 70 + 500 = 1508. Administrar dose total de 15 ampolas. Prescrição sugerida: 2 ampolas + SF 0,9% 250 ml ev em 30 minutos, 2 a 3 vezes por semana com intervalo mínimo de 1 dia entre as aplicações.",
    }
  }
  // G1-6/ G2-00/ G3-00
  if (g2s.flow.includes('G2-1') && ferritine == "≥ 500 mcg/L") {
    return {
      ...group2Suggestion,
      color: info,
      flow: group2Suggestion.flow + '/' + 'G3-19',
      conductText: "Anemia por doença crônica, sem necessidade de reposição com ferro."
    }
  }


  // $$$$$$$$$$$$$$$$$$$
  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "<100") {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-20',
      conductText: "Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.",
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "≥100") {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-21',
      conductText: "Encaminhar ao Hematologista para investigação de anemia e leucopenia."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "<100" && hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-22',
      conductText: "Paciente com provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "<100" && !hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-23',
      conductText: "Encaminhar ao Hematologista para investigação de pancitopenia."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "≥100" && hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-24',
      conductText: "Paciente com provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "≥100" && !hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-25',
      conductText: "Encaminhar ao hematologista. Possível mielodisplasia."
    }
  }

  return {
    ...group2Suggestion,
    flow: group2Suggestion.flow + '/' + 'G3-00',
    conductText: 'Infelizmente não foi possível processar uma sugestão de conduta, a combinação de exames não foi mapeada. Verifique se os dados fornecidos estão corretos e clique em Salvar para processar novamente.'
  }

}
// G1-6/ G2-00/ G3-00
function processGroup2(exams, group1Suggestion) {
  let vcm = exams.selected_vcm
  let hcm = exams.selected_hcm
  let hasHemoglobinopatia = exams.previous_hemoglobine_value.length && !exams.previous_hemoglobine_value.includes('Não')

  // debugger
  let VCM_LT_80 = vcm == '<80fl'
  let VCM_80_100 = vcm == '80-100fl'
  let VCM_GT_80 = vcm == "80-100fl" || vcm == ">100fl"
  let VCM_GT_100 = vcm == ">100fl"

  let HCM_LT_32 = hcm == "<27pg" || hcm == "27-32pg"
  let HCM_LT_27 = hcm == "<27pg"
  let HCM_GT_27 = hcm == "27-32pg" || hcm == ">32pg"

  let TFG_LT_60 = exams.selected_gloumerar == "TFG < 60 ml/min/1,73m2"
  let TFG_GT_60 = exams.selected_gloumerar == "TFG > 60 ml/min/1,73m2"

  // debugger
  if (hasHemoglobinopatia) {
    return {
      conductText: "Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.",
      flow: group1Suggestion.flow + '/' + 'G2-6',
      color: info,
    }
  }


  // flow1
  if (VCM_LT_80 && TFG_GT_60 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-1',
      askFerroSerico: true,
      askFerritine: true,
      askFerritineSaturation: true,
    }
  }

  if (VCM_80_100 && HCM_LT_32 && TFG_LT_60 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-2',
      askFerroSerico: true,
      askFerritine: true,
      askFerritineSaturation: true,
    }
  }

  if (VCM_GT_80 && HCM_LT_27 && TFG_GT_60 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-3',
      askFerroSerico: true,
      askFerritine: true,
      askFerritineSaturation: true,
    }
  }


  if (VCM_GT_80 && HCM_LT_32 && TFG_LT_60 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-4',
      askFerroSerico: true,
      askFerritine: true,
      askFerritineSaturation: true,
    }
  }


  if (VCM_GT_100 && HCM_GT_27 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-5',
      askB12Vitamine: true,
      askFolicAcid: true
    }
  }

  if (VCM_LT_80 && TFG_LT_60 && !hasHemoglobinopatia) {
    return {
      ...group1Suggestion,
      flow: group1Suggestion.flow + '/' + 'G2-7',
      askFerroSerico: true,
      askFerritine: true,
      askFerritineSaturation: true,
    }
  }

  return {
    ...group1Suggestion,
    flow: group1Suggestion.flow + '/' + 'G2-00',
    askFerroSerico: true,
    askFerritine: true,
    askFerritineSaturation: true,
    // askB12Vitamine: true,
    // askFolicAcid: true
  }
}

function processGroup1(exams) {
  let hb = exams.selected_hb
  let comorbidity = exams.comorbities.length > 0 && !exams.comorbities.includes('Não')
  let physicalSymptoms = exams.selected_physical_exam.length > 0 && !exams.selected_physical_exam.includes('Não')

  if (hb == 'Hb<7' && !comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-1',
      conductText: 'A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive
    }
  }

  if (hb == 'Hb<7' && comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-2',
      conductText: 'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: alert
    }
  }

  if (hb == 'Hb<7' && comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-3',
      conductText: 'Provavelmente se beneficiará com a transfusão. Porém é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Este é um paciente de maior risco pré-operatório. Solicite os exames abaixo e preencha os resultados.',
      color: danger
    }
  }

  if (hb == 'Hb<7' && !comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-4',
      conductText: 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: alert
    }
  }

  if (hb === '7<Hb<8' && !comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-5',
      conductText: 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive
    }
  }

  if (hb === '7<Hb<8' && comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-6',
      conductText: 'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: alert
    }
  }

  if (hb === '7<Hb<8' && comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-7',
      conductText: 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: danger
    }
  }

  if (hb === '7<Hb<8' && !comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-8',
      conductText: 'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive
    }
  }

  if (hb === '8<Hb<13' && !comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-9',
      conductText: 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive,
    }
  }

  if (hb === '8<Hb<13' && comorbidity && !physicalSymptoms) {
    return {
      flow: 'G1-10',
      conductText: 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive,
    }
  }

  if (hb === '8<Hb<13' && comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-11',
      conductText: 'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: alert,
    }
  }

  if (hb === '8<Hb<13' && !comorbidity && physicalSymptoms) {
    return {
      flow: 'G1-12',
      conductText: 'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
      color: positive,
    }
  }

  return {}
}

function checkGroup1Filled(exams) {
  // console.log("!!exams.selected_hb &&", !!exams.selected_hb);
  // console.log("!!exams.comorbities.length &&", !!exams.comorbities.length);
  // console.log("!!exams.selected_physical_exam.length &&", !!exams.selected_physical_exam.length);
  // console.log("!!exams.selected_procedure &&", !!exams.selected_procedure);
  // console.log("!!exams.previous_hemoglobine_value.length &&", !!exams.previous_hemoglobine_value.length);
  // console.log("!!exams.hemostasis_value.length &&", !!exams.hemostasis_value.length);
  // console.log("!!exams.selected_medication &&", !!exams.selected_medication);
  // console.log("!!exams.selected_transfusion", !!exams.selected_transfusion);
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
  console.log("checking group2", (
    !!checkGroup1Filled(exams) &&
    !!exams.selected_vcm &&
    !!exams.selected_hcm &&
    !!exams.selected_leucocito &&
    !!exams.selected_plaquetas &&
    !!exams.selected_gloumerar
  ));
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
  // debugger
  // console.log("group2", group2Suggestion);
  // ensure group2 is returning something
  if (!group2Suggestion.flow) {
    console.log("no flow found for group 2", );
    return false
  }

  // if it is asked, it should be filled
  let ferritineSaturation = group2Suggestion.askFerritineSaturation ? !!exams.selected_transferrine_saturation : true
  let b12Vitamine = group2Suggestion.askB12Vitamine ? !!exams.selected_b12_vitamine : true
  let folicAcid = group2Suggestion.askFolicAcid ? !!exams.selected_folic_acid : true
  let ferritine = group2Suggestion.askFerritine ? !!exams.selected_ferritina : true
  let ferroSerico = group2Suggestion.askFerroSerico ? !!exams.selected_ferro_serico : true
  console.log("ferritineSaturation", ferritineSaturation);
  console.log("b12Vitamine", b12Vitamine);
  console.log("folicAcid", folicAcid);
  console.log("ferritine", ferritine);
  console.log("ferroSerico", ferroSerico);


  console.log("group 3 filled", );
  return (
    !!checkGroup2Filled(exams) &&
    ferritineSaturation &&
    b12Vitamine &&
    folicAcid &&
    ferritine &&
    ferroSerico
  )
}

function checkConductAbsense(group2Suggestion) {
  const g2s = group2Suggestion
  return (
    g2s.flow.includes('G2-1') ||
    g2s.flow.includes('G2-4') ||
    g2s.flow.includes('G2-5') ||
    g2s.flow.includes('G2-6') ||
    g2s.flow.includes('G2-7') ||
    g2s.flow.includes('G2-8') ||
    g2s.flow.includes('G2-9') ||
    g2s.flow.includes('G2-10') ||
    g2s.flow.includes('G2-11') ||
    g2s.flow.includes('G2-13') ||
    g2s.flow.includes('G2-14')
  )

}

// testProcessExamsInputG1();
