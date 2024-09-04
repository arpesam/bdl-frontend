import { neutral, positive, info, alert, danger } from './utils'

export function processGroup1(exams) {
  let hb = exams.selected_hb
  let comorbidity = exams.comorbities.length > 0 && !exams.comorbities.includes('Não')
  let physicalSymptoms = exams.selected_physical_exam.length > 0 && !exams.selected_physical_exam.includes('Não')
  let HB_LT_7 = hb == 'Hb<7'
  let HB_7_8 = hb == '7≤Hb<8'
  let HB_8_13 = hb === '8≤Hb<13'

  const defaultResp = (flow, color, conductText) => ({
    flow: flow,
    color: color,
    conductText: conductText
  })

  if (HB_LT_7 && !comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-1',
      positive,
      'A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_LT_7 && comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-2',
      alert,
      'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_LT_7 && comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-3',
      danger,
      'Este é um paciente de maior risco no pré-operatório. O médico deve avaliar os riscos e benefícios do suporte transfusional. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
      // 'Provavelmente se beneficiará com a transfusão. Porém é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Este é um paciente de maior risco pré-operatório. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_LT_7 && !comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-4',
      alert,
      'É necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção e distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo.  O médico deve avaliar os riscos e benefícios do suporte transfusional. Paciente de maior risco pré-operatório. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
      // 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_7_8 && !comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-5',
      positive,
      'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_7_8 && comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-6',
      alert,
      'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_7_8 && comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-7',
      danger,
      'É necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção e distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. O médico deve avaliar os riscos e benefícios do suporte transfusional. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. Deve-se investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Veja a sugestão de exames a serem coletados.'
      // 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_7_8 && !comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-8',
      positive,
      'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_8_13 && !comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-9',
      positive,
      'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_8_13 && comorbidity && !physicalSymptoms)
    return defaultResp(
      'G1-10',
      positive,
      'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_8_13 && comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-11',
      alert,
      'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  if (HB_8_13 && !comorbidity && physicalSymptoms)
    return defaultResp(
      'G1-12',
      positive,
      'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
    )
  return {}
}
