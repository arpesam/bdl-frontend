import { defineStore } from 'pinia'
import { processGroup1 } from './processGroup1'
import { processGroup2 } from './processGroup2'
import { processGroup3 } from './processGroup3'
import { processGroup4 } from './processGroup4'

import { neutral } from './utils'

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
      conductText: 'Complete todos os dados abaixo e clique em "Salvar". \n A conduta será mostrada aqui. Você pode salvar e retornar quando quiser.',
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
  // let b12 = exams.selected_b12_vitamine
  // let folic_acid = exams.selected_folic_acid
  console.log('leococites ', leococites, plaquetas)

  // if (leococites == '<4000' && plaquetas == '<100') {
  //   suggestion.askB12Vitamine = true
  //   suggestion.askFolicAcid = true
  // }

  // console.log('>>>> returnMiddleware', suggestion)
  // // G2-5 already takes care of the following logic, so we should not concatenate any othem conduct text
  // let isG2_5 = suggestion.flow.includes('G2-5')
  // if (
  //   isG2_5 ||
  //   !suggestion.isGroup1Filled ||
  //   !suggestion.isGroup2Filled ||
  //   !suggestion.isGroup3Filled
  // ) {
  //   console.log(
  //     '>>>> isG2_5 || !suggestion.isGroup1Filled || !suggestion.isGroup2Filled || !suggestion.isGroup3Filled'
  //   )
  //   return suggestion
  // }

  // console.log('end of processing')
  return processGroup4(suggestion, exams)
}

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
  return !!checkGroup1Filled(exams) && !!exams.selected_vcm && !!exams.selected_hcm && !!exams.selected_leucocito && !!exams.selected_plaquetas && !!exams.selected_gloumerar
}

function checkGroup3Filled(exams, group2Suggestion = {}) {
  if (!group2Suggestion.flow) {
    console.log('no flow found for group 2')
    return false
  }

  // if it is asked, it should be filled
  let ferritineSaturation = group2Suggestion.askFerritineSaturation ? !!exams.selected_transferrine_saturation : true
  let b12Vitamine = group2Suggestion.askB12Vitamine ? !!exams.selected_b12_vitamine : true
  let folicAcid = group2Suggestion.askFolicAcid ? !!exams.selected_folic_acid : true
  let ferritine = group2Suggestion.askFerritine ? !!exams.selected_ferritina : true
  let ferroSerico = group2Suggestion.askFerroSerico ? !!exams.selected_ferro_serico : true

  return !!checkGroup2Filled(exams) && ferritineSaturation && b12Vitamine && folicAcid && ferritine && ferroSerico
}
