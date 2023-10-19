import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const APIbasePath = import.meta.env.VITE_API_URL

export const useExamStore = defineStore('examStore', {
  state: () => ({
  }),
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


  if (!isGroup1Filled) { // check also if the button was clicked
    return {
      flow: "NO-INPUT",
      conductText: 'Complete todos os dados abaixo e clique em "Salvar". \n A conduta será mostrada aqui. Você pode salvar e retornar quando quiser.',
      color: neutral
    }
  }

  const  group1Suggestion =  processGroup1(exams)
  let isGroup2Filled = checkGroup2Filled(exams, group1Suggestion)

  if (isGroup1Filled && !isGroup2Filled) {
    group1Suggestion.isGroup1Filled = isGroup1Filled
    group1Suggestion.isGroup2Filled = isGroup2Filled
    return group1Suggestion
  }

  // debugger
  const group2Suggestion = processGroup2(exams, group1Suggestion)
  console.log("group2Suggestion", group2Suggestion);
  let isGroup3Filled = checkGroup3Filled(exams, group2Suggestion)

  if (isGroup1Filled && isGroup2Filled && !isGroup3Filled) {
    group2Suggestion.isGroup1Filled = isGroup1Filled
    group2Suggestion.isGroup2Filled = isGroup2Filled
    return group2Suggestion
  }

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


  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "<100") {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-1',
      conductText: "Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.",
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "≥100") {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-2',
      conductText: "Encaminhar ao Hematologista para investigação de anemia e leucopenia."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "<100" && hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-3',
      conductText: "Paciente com provável anemia da inflamação e plaquetopenia por hiperesplenismo se paciente com esplenomegalia e cirrose. Neste contexto, a contagem de plaquetas costuma se apresentar entre 30.000 e 50.000. Geralmente não há  necessidade de transfusão de CP para procedimentos cirúrgicos menores. Discutir com médico hemoteraPêuta a necessidade de transfusão de CP a depnder do procedimento cirúrgico."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "<4000" && plaquetas == "<100" && !hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-4',
      conductText: "Encaminhar ao Hematologista para investigação de pancitopenia."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "≥100" && hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-5',
      conductText: "Paciente com provável anemia da inflamção secundária a hepatopatia crônica. Solicitar perfil de ferro em caso de sangramento crônico de TGI."
    }
  }

  if (g2s.flow.includes('G2-5') && leococites == "≥4000" && plaquetas == "≥100" && !hasCronicHepatopatia) {
    return {
      ...group2Suggestion,
      flow: group2Suggestion.flow + '/' + 'G3-5',
      conductText: "Encaminhar ao hematologista. Possível mielodisplasia."
    }
  }


  return {
    ...group2Suggestion,
    flow: group2Suggestion.flow + '/' + 'G3-00',
    conductText: 'Infelizmente não foi possível processar uma sugestão de conduta, a combinação de exames não foi mapeada. Verifique se os dados fornecidos estão corretos e clique em Salvar para processar novamente.'
  }

}

function processGroup2(exams, group1Suggestion) {
  let vcm = exams.selected_vcm
  let hcm = exams.selected_hcm
  let hasHemoglobinopatia = exams.length && !exams.includes('Não')

  let VCM_LT_80 = vcm == '<80fl'
  let VCM_80_100 = vcm == '80-100fl'
  let VCM_GT_80 = vcm == "80-100fl" || vcm == ">100fl"
  let VCM_GT_100 = vcm == ">100fl"

  let HCM_LT_32 = hcm == "<27pg" || hcm == "27-32pg"
  let HCM_LT_27 = hcm == "<27pg"
  let HCM_GT_27 = hcm == "27-32pg" || hcm == ">32pg"

  let TFG_LT_60 = exams.selected_gloumerar == "TFG < 60 ml/min/1,73m2"
  let TFG_GT_60 = exams.selected_gloumerar == "TFG > 60 ml/min/1,73m2"

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

  if (hasHemoglobinopatia) {
    return {
      conductText: "Encaminhar ao Hematologista para orientações perioperatórias e avisar o Serviço de Transfusão sobre o diagnóstico de Hemoglobinopatia para reserva cirúrgica adequada.",
      flow: group1Suggestion.flow + '/' + 'G2-6',
    }
  }

  return {
    ...group1Suggestion,
    flow: group1Suggestion.flow + '/' + 'G2-00',
    askFerroSerico: true,
    askFerritine: true,
    askFerritineSaturation: true,
    askB12Vitamine: true,
    askFolicAcid: true
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
      conductText: 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
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
      conductText: 'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
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

function testProcessExamsInputG1() {
  const exams = {}
  exams.selected_hb = 'xx'
  exams.comorbities = ['xx']
  exams.selected_physical_exam = ['xx']
  exams.selected_procedure = 'xx',
  exams.previous_hemoglobine_value = ['xx']
  exams.hemostasis_value = ['xx']
  exams.selected_medication = 'xx'
  exams.selected_transfusion = 'xx'
  const testCases = [
    {
      input: {
        ...exams,
        selected_hb: 'Hb<7',
        comorbities: ['Não'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-1',
        conductText:
          'A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
    {
      input: {
        ...exams,
        selected_hb: 'Hb<7',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Não'],
      },
      expected: {
        flow: 'G1-2',
        conductText:
          'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: alert
      },
    },
    {
      input: {
        ...exams,
        selected_hb: 'Hb<7',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-3',
        conductText:
          'Provavelmente se beneficiará com a transfusão. Porém é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Este é um paciente de maior risco pré-operatório. Solicite os exames abaixo e preencha os resultados.',
        color: danger
      },
    },
    {
      input: {
        ...exams,
        selected_hb: 'Hb<7',
        comorbities: ['Não'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-4',
        conductText:
          'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: alert
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '7<Hb<8',
        comorbities: ['Não'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-5',
        conductText:
          'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '7<Hb<8',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-6',
        conductText:
          'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: alert
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '7<Hb<8',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-7',
        conductText:
          'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: danger
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '7<Hb<8',
        comorbities: ['Não'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-8',
        conductText:
        'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '8<Hb<13',
        comorbities: ['Não'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-9',
        conductText:
          'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '8<Hb<13',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-10',
        conductText:
          'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Veja a sugestão de exames a serem coletados.',
        color: positive
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '8<Hb<13',
        comorbities: ['Hypertension'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-11',
        conductText:
          'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: alert
      },
    },
    {
      input: {
        ...exams,
        selected_hb: '8<Hb<13',
        comorbities: ['Não'],
        selected_physical_exam: ['Fever'],

      },
      expected: {
        flow: 'G1-12',
        conductText:
          'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
  ];

  for (const testCase of testCases) {
    const result = processExamInputs(testCase.input);

    // console.log("result", result.flow == );
    if (
      result.conductText !== testCase.expected.conductText ||
      result.color !== testCase.expected.color ||
      result.flow != testCase.expected.flow
    ) {
      console.error(`Test failed for input:`, testCase.input);
      console.error(`Expected output:`, testCase.expected);
      console.error(`Actual output:`, result);
    } else {
      console.log(`Test passed`);
    }
  }
}

function testProcessExamsInput() {
  const exams = {}
  exams.selected_hb = 'xx'
  exams.comorbities = ['xx']
  exams.selected_physical_exam = ['xx']
  exams.selected_procedure = 'xx',
  exams.previous_hemoglobine_value = ['xx']
  exams.hemostasis_value = ['xx']
  exams.selected_medication = 'xx'
  exams.selected_transfusion = 'xx'
  const testCases = [
    {
      input: {
        ...exams,
        selected_hb: 'Hb<7',
        comorbities: ['Não'],
        selected_physical_exam: ['Não'],

      },
      expected: {
        flow: 'G1-1',
        conductText:
          'A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.',
        color: positive
      },
    },
  ];

  for (const testCase of testCases) {
    const result = processExamInputs(testCase.input);

    // console.log("result", result.flow == );
    if (
      result.conductText !== testCase.expected.conductText ||
      result.color !== testCase.expected.color ||
      result.flow != testCase.expected.flow
    ) {
      console.error(`Test failed for input:`, testCase.input);
      console.error(`Expected output:`, testCase.expected);
      console.error(`Actual output:`, result);
    } else {
      console.log(`Test passed`);
    }
  }
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

function checkGroup2Filled(exams) { return (
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
  console.log("group2", group2Suggestion);
  // ensure group2 is returning something
  if (!group2Suggestion.flow) {
    return false
  }

  // if it is asked, it should be filled
  let ferritineSaturation = group2Suggestion.askFerritineSaturation ? !!exams.selected_transferrine_saturation : true
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
