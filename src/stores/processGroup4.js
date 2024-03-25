import { neutral, positive, info, alert, danger } from './utils'

export function processGroup4(suggestion, exams) {
  // These flows are the only ones that do not handle leococites and b12
  const shoulProcessG4 = () => {
    return (
      suggestion.flow.includes('G2-1') ||
      suggestion.flow.includes('G2-2') ||
      suggestion.flow.includes('G2-3') ||
      suggestion.flow.includes('G2-4') ||
      suggestion.flow.includes('G2-6') ||
      suggestion.flow.includes('G2-7') ||
      suggestion.flow.includes('G2-15')
    )
  }

  if (!shoulProcessG4()) {
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

  let isG2_6 = suggestion.flow.includes('G2-6')

  if (B12_LT_200 && FOLIC_LT_6) {
    suggestion.flow += '/G4-1'
    suggestion.conductText2 =
      '*  Anemia megaloblástica. Iniciar reposição de vitamina B12 e ácido fólico. Sugerimos B12 5mg/dia IM por 5 dias e ácido fólico 5mg/dia VO 3 vezes por semana.'
    return suggestion
  }

  if (B12_LT_200 && FOLIC_GT_6) {
    suggestion.flow += '/G4-2'
    suggestion.conductText2 =
      '* Anemia megaloblástica. Iniciar reposição de vitamina B12. Sugerimos a aplicação 5mg/dia IM por 5 dias e após 5mg IM a cada 3 meses.'
    return suggestion
  }

  if (B12_GT_200 && FOLIC_LT_6) {
    suggestion.flow += '/G4-3'
    suggestion.conductText2 =
      '* Anemia megaloblástica. Iniciar reposição com ácido fólico 5mg/dia vo 3 vezes na semana.'
    return suggestion
  }

  if (isG2_6 && B12_GT_200 && FOLIC_GT_6 && LEOC_GT_4000 && PLAQ_LT_100) {
    suggestion.flow += '/G4-4'
    suggestion.conductText2 =
      '* Encaminhar ao Hematologista para investigação de anemia e plaquetopenia.'
    return suggestion
  }

  if (isG2_6 && B12_GT_200 && FOLIC_GT_6 && LEOC_LT_4000 && PLAQ_GT_100) {
    suggestion.flow += '/G4-5'
    suggestion.conductText2 =
      '* Encaminhar ao Hematologista para investigação de anemia e leucopenia.'
    return suggestion
  }
  return suggestion
}
