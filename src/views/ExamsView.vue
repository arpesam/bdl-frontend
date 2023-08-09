<template>
  <!-- <v-container> -->
  <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
  <!-- <v-row v-if="loading">
    <v-col justify-center>
      <LoadingComponent :loading="loading" />
    </v-col>
  </v-row> -->

<!-- CONDUTA -->
<v-alert
  v-if="!overlay && !warningAlert"
  class="mt-1 mb-3"
  icon="$info"
  title="Sugestão de conduta"
  style="color: white;"
  :text="conductSuggestionText"
  :color="needTransfusion"
></v-alert>

<!-- GRUPO 3 -->
<div>
<!-- <div v-if="isGroup2Filled"> -->
  <InputPanel v-if="askFerroSerico" title="Ferro sérico:" :value="selected_ferro_serico">
    <v-radio-group v-model="selected_ferro_serico">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel v-if="askFerritine" title="Ferritina:" :value="selected_ferritina">
    <v-radio-group v-model="selected_ferritina">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel v-if="askFerritineSaturation" title="Saturação transferrina:" :value="selected_transferrine_saturation">
    <v-radio-group v-model="selected_transferrine_saturation">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel v-if="askB12Vitamine" title="Vatamina B12:" :value="selected_b12_vitamine">
    <v-radio-group v-model="selected_b12_vitamine">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel v-if="askFolicAcid" title="Ácido fólico:" :value="selected_folic_acid">
    <v-radio-group v-model="selected_folic_acid">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

</div>

<!-- GRUPO 2 -->
<div calss="group2" v-if="isGroup1Filled && saveClikedForGroup1 && !overlay">
  <InputPanel title="VCM:" :value="selected_vcm">
    <v-radio-group v-model="selected_vcm">
      <v-radio label="< 80 fl" value="<80fl"></v-radio>
      <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
      <v-radio label="> 100 fl" value=">100fl"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="HCM:" :value="selected_hcm">
    <v-radio-group v-model="selected_hcm">
      <v-radio label="< 27 pg" value="<27pg"></v-radio>
      <v-radio label="27-32 pg" value="27-32pg"></v-radio>
      <v-radio label="> 32 pg" value=">32pg"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Leucócito:" :value="selected_leucocito">
    <v-radio-group v-model="selected_leucocito">
      <v-radio label="< 4000 x 109/L" value="<4000"></v-radio>
      <v-radio label="> 4000 x 109/L" value=">4000"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Plaquetas:" :value="selected_plaquetas">
    <v-radio-group v-model="selected_plaquetas">
      <v-radio label="< 100 x 109/L" value="<100"></v-radio>
      <v-radio label="> 100 x 109/L" value=">100"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Taxa de filtração glomerular:" :value="selected_gloumerar">
    <v-radio-group v-model="selected_gloumerar" inline>
      <v-radio label="TGF < 60 ml/min/1,73m2" value="TGF < 60 ml/min/1,73m2"></v-radio>
      <v-radio label="TGF > 60 ml/min/1,73m2" value="TGF > 60 ml/min/1,73m2"></v-radio>
    </v-radio-group>
  </InputPanel>
</div>

<!-- GRUPO 1 -->
<div class="group1">
  <InputPanel title="Valor de HB:" :value="selected_hb">
    <v-radio-group v-model="selected_hb">
      <v-radio label="Hb < 7 g/dl" value="Hb<7"></v-radio>
      <v-radio label="Hb > 7 e Hb < 9 g/dl" value="7<Hb<9"></v-radio>
      <v-radio label="Hb > 9 e < 13 g/dl" value="9<Hb<13"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Presença de comorbidades?" :value="comorbities">
    <div>
      <v-checkbox v-model="set_comorbities" label="Coronariopatia Isquêmica" value="Coronariopatia Isquêmica"></v-checkbox>
      <v-checkbox v-model="set_comorbities" label="Insuficiência Cardíaca" value="Insuficiência Cardíaca"></v-checkbox>
      <v-checkbox v-model="set_comorbities" label="DPOC" value="DPOC"></v-checkbox>
      <v-checkbox v-model="set_comorbities" label="Doença Renal Crônica" value="Doença Renal Crônica"></v-checkbox>
      <v-checkbox v-model="set_comorbities" label="Não" value="Não"></v-checkbox>
    </div>
  </InputPanel>

  <InputPanel title="Exames físicos apresentam as alterações abaixo?" :value="selected_physical_exam" >
      <v-checkbox v-model="set_selected_physical_exam" label="Dispnéia e/ou sinais de insuficiência respiratória" value="Dispnéia e/ou sinais de insuficiência respiratória" ></v-checkbox>
      <v-checkbox v-model="set_selected_physical_exam" label="Má perfusão tecidual" value="Má perfusão tecidual"></v-checkbox>
      <v-checkbox v-model="set_selected_physical_exam" label="Sonolência e/ou alteração do nível da consciência" value="Sonolência e/ou alteração do nível da consciência" ></v-checkbox>
      <v-checkbox v-model="set_selected_physical_exam" label="PAM < 70 mmHg e/ou FC > 100 bpm" value="PAM < 70 mmHg e/ou FC > 100 bpm"></v-checkbox>
      <v-checkbox v-model="set_selected_physical_exam" label="Não" value="Não"></v-checkbox>
  </InputPanel>

  <InputPanel title="Procedimento cirúrgico a ser realizado:" :value="selected_procedure">
    <v-radio-group v-model="selected_procedure">
      <v-radio label="Pequeno porte (colocar exemplos)" value="Pequeno porte"></v-radio>
      <v-radio label="Médio porte (colocar exemplos)" value="Médio porte"></v-radio>
      <v-radio label="Grande porte (colocar exemplos)" value="Grande porte"></v-radio>
      <v-text-field
        v-if="selected_procedure"
        v-model="previous_hemoglobine_text"
        label="Especifique"
      ></v-text-field>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Antecedente de hemoglobinopatia?" :value="previous_hemoglobine_value">
      <v-checkbox v-model="set_previous_hemoglobine_value" label="Anemia falciforme" value="Anemia falciforme"></v-checkbox>
      <v-checkbox v-model="set_previous_hemoglobine_value" label="Talassemia" value="Talassemia"></v-checkbox>
      <v-checkbox v-model="set_previous_hemoglobine_value" label="Outro:" value="Outro"></v-checkbox>
      <v-text-field v-if="previous_hemoglobine_value.includes('Outro')" v-model="previous_hemoglobine_text" label="Especifique" ></v-text-field>
      <v-checkbox v-model="set_previous_hemoglobine_value" label="Não" value="Não"></v-checkbox>
  </InputPanel>

  <InputPanel title="Antecedente de alterações da hemostasia:" :value="hemostasis_value">
      <v-checkbox v-model="set_hemostasis_value" label="Hemofilia" value="Hemofilia"></v-checkbox>
      <v-checkbox v-model="set_hemostasis_value" label="Hepatopatia crônica" value="Hepatopatia crônica"></v-checkbox>
      <v-checkbox v-model="set_hemostasis_value" label="Disfunção plaquetária" value="Disfunção plaquetária"></v-checkbox>
      <v-checkbox v-model="set_hemostasis_value" label="Outro:" value="Outro"></v-checkbox>
      <v-text-field v-if="hemostasis_value.includes('Outro')" v-model="hemostasis_text" label="Especifique" ></v-text-field>
      <v-checkbox v-model="set_hemostasis_value" label="Não" value="Não"></v-checkbox>
  </InputPanel>

  <InputPanel title="Uso de medicações que aumentam risco de sangramento (anticoagulantes, AAS):" :value="selected_medication" >
    <v-radio-group v-model="selected_medication" inline>
      <v-radio label="Sim" value="Sim"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Recebeu transfusão nos últimos 3 meses?" :value="selected_transfusion">
    <v-radio-group v-model="selected_transfusion" inline>
      <v-radio label="Sim" value="Sim"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
    </v-radio-group>
  </InputPanel>
</div>
<!-- <p style="color: red !important">isGroup1Filled={{isGroup1Filled}}  saveClicked1={{saveClikedForGroup1}} overlay={{!overlay}}</p>
<p style="color: red !important">isGroup2Filled={{isGroup2Filled}}  saveClicked2={{saveClikedForGroup2}} overlay={{!overlay}}</p> -->

<!-- BUTTONS -->
<v-row class="mt-5">
  <v-sheet>
    <!-- <v-form v-model="isFormValid"> -->
      <v-btn
        fab
        icon="mdi-content-save"
        size="x-large"
        fixed
        color="blue"
        :disabled="overlay"
        :style="{ position: 'fixed', bottom: '0.6rem', right: '0.6rem', zIndex: 1 }"
        @click="registerExam"
      >
      </v-btn>
      <v-btn class="ml-8 pl-4 pr-4" variant="flat" color="warning" @click="dialog = true" :disabled="overlay">
        Resetar valores
      </v-btn>
      <v-btn class="ml-10" variant="flat" color="info" @click="registerExam" :disabled="overlay">
        Salvar
      </v-btn>
    <!-- </v-form> -->
  </v-sheet>
</v-row>

<!-- SNACKBAR -->
<v-snackbar v-model="snackbar">
  {{ snackBarText }}
  <template v-slot:actions>
    <v-btn :color="snackbarColor" variant="text" @click="snackbar = false"> Fechar </v-btn>
  </template>
</v-snackbar>

<!-- DIALOG -->
<v-row justify="center">
    <v-dialog v-model="dialog" width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">Atenção!</span>
        </v-card-title>
        <v-card-text>
          Ao continuar, todos os dados clínicos deste paciente serão apagados. Deseja continuar?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="outlined" @click="dialog = false" :disabled="overlay" v-if="!overlay">
            Cancelar
          </v-btn>
          <v-btn color="green-darken-1" variant="outlined" @click="resetAllValues" :disabled="overlay" :loading="overlay">
            Sim, apagar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-row>

<!-- OVERLAY -->
<v-row justify="center">
    <v-dialog v-model="overlay" width="300">
      <v-card>
        <v-card-title>
          <span class="text-h5">Processando, aguarde</span>
        </v-card-title>
        <v-card-text>
          <LoadingComponent :loading="overlay" height="50px" width="50px"/>
        </v-card-text>
      </v-card>
    </v-dialog>
</v-row>

<template>
  <div class="text-center">
    <v-overlay v-model="overlay"></v-overlay>
  </div>
</template>

</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'
import LoadingComponent from '@/components/Loading.vue'
import InputPanel from '@/components/InputPanel.vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useExamStore } from '@/stores/exams'

const neutral = '#455775'
const positive = 'success'
const info = 'info'
const alert = 'orange'
const danger = '#e64562'


const red = '#e64562'
const orange = 'orange'
const success = 'success'
const warning = 'warning'

export default {
  components: {
    Alert,
    LoadingComponent,
    InputPanel
  },
  props: {
    id: String
  },
  data() {
    return {
      saveClikedForGroup1: false,
      saveClikedForGroup2: false,
      dialog: false,
      overlay: false,
      snackbar2: true,
      APIbasePath: import.meta.env.VITE_API_URL,
      isFormValid: false,
      successAlert: '',
      warningAlert: '',
      loading: false,
      snackbar: false,
      snackBarText: '',
      snackbarColor: 'green',
      btn: {
        loading: false
      },
      conductSuggestionText: 'Por favor, complete os dados abaixo',
      conductSuggestionColor: '#2A3B4D',

      comorbities: [],
      previous_hemoglobine_value: [],
      hemostasis_value: [],
      selected_physical_exam: [],
      previous_hemoglobine_text: '',
      selected_procedure: null,
      selected_procedure_text: '',
      hemostasis_text: '',
      selected_medication: null,
      selected_hb: null,
      selected_vcm: null,
      selected_hcm: null,
      selected_leucocito: null,
      selected_plaquetas: null,
      selected_transfusion: null,
      selected_gloumerar: null,

      selected_ferro_serico: null,
      selected_ferritina: null,
      selected_transferrine_saturation: null,
      selected_b12_vitamine: null,
      selected_folic_acid: null,

    }
  },
  computed: {
    set_comorbities: {
      get() {
        return this.comorbities
      },
      set(v) {
        if (v.includes('Não') && v.length == 1) {
          return this.comorbities = ["Não"]
        }
        if (v.includes('Não') && v[0] != 'Não') {
          return this.comorbities = ["Não"]
        }
        this.comorbities = v.filter((item) => item !== "Não");
      }
    },
    set_previous_hemoglobine_value: {
      get() {
        return this.previous_hemoglobine_value
      },
      set(v) {
        if (v.includes('Não') && v.length == 1) {
          return this.previous_hemoglobine_value = ["Não"]
        }
        if (v.includes('Não') && v[0] != 'Não') {
          return this.previous_hemoglobine_value = ["Não"]
        }
        this.previous_hemoglobine_value = v.filter((item) => item !== "Não");
      }
    },
    set_hemostasis_value: {
      get() {
        return this.hemostasis_value
      },
      set(v) {
        if (v.includes('Não') && v.length == 1) {
          return this.hemostasis_value = ["Não"]
        }
        if (v.includes('Não') && v[0] != 'Não') {
          return this.hemostasis_value = ["Não"]
        }
        this.hemostasis_value = v.filter((item) => item !== "Não");
      }
    },
    set_selected_physical_exam: {
      get() {
        return this.selected_physical_exam
      },
      set(v) {
        if (v.includes('Não') && v.length == 1) {
          return this.selected_physical_exam = ["Não"]
        }
        if (v.includes('Não') && v[0] != 'Não') {
          return this.selected_physical_exam = ["Não"]
        }
        this.selected_physical_exam = v.filter((item) => item !== "Não");
      }
    },
    isGroup1Filled() {
      return (
        !!this.selected_hb &&
        !!this.comorbities.length &&
        !!this.selected_physical_exam.length &&
        !!this.selected_procedure &&
        !!this.previous_hemoglobine_value.length &&
        !!this.hemostasis_value.length &&
        !!this.selected_medication &&
        !!this.selected_transfusion
      )
    },
    isGroup2Filled() {
      return (
        !!this.isGroup1Filled &&
        !!this.selected_vcm &&
        !!this.selected_hcm &&
        !!this.selected_leucocito &&
        !!this.selected_plaquetas &&
        !!this.selected_gloumerar
      )
    },
    needTransfusion() {
      if (!this.isGroup1Filled || !this.saveClikedForGroup1) {
        this.conductSuggestionText = 'Por favor, complete todos os dados abaixo e clique em "Salvar" para uma avalição prévia. Você pode salvar e retornar quando quiser.'
        return neutral
      }

      if (this.isGroup2Filled && this.saveClikedForGroup2) {
        if (this.selected_vcm == "<80fl" && this.hasTalassemia && this.hasReveivedTransfusion) {
          this.conductSuggestionText = 'Se paciente em programa de transfusão regular, será necessário avaliação do hematologista e programar reserva cirurgica com CH fenotipado. Comunicar Serviço de Hemoterapia.'
          return alert
        }

        if (this.selected_vcm == "<80fl" && this.hasTalassemia && !this.hasHemoglobinopatia && !this.hasReveivedTransfusion) {
          this.conductSuggestionText = 'Provavél talassemia menor se paciente com anemia leve e sem necessidade transfusionar. Solicitar avaliação do Hematologista.'
          return alert
        }

        if (this.selected_vcm == "<80-100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF < 60 ml/min/1,73m2") {
          this.conductSuggestionText = 'Iniciar EPO se hb < 10 g/dl e avaliar perfil de ferro. Iniciar ferro se sat < 20%.'
          return info
        }

        if (this.selected_vcm == ">100fl" && this.selected_hcm == "27-32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF < 60 ml/min/1,73m2") {
          this.conductSuggestionText = 'Iniciar EPO se hb < 10 g/dl e avaliar perfil de ferro. Iniciar ferro se sat < 20%.'
          return info
        }

        if (this.selected_vcm == ">100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) {
          this.conductSuggestionText = 'Solicite vitamina B12 e acido fólico e realize tratamento em caso de deficiência.'
          return info
        };

        if (this.selected_vcm == ">100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_b12_vitamine == "Normal" && this.selected_folic_acid == "Normal" && !this.hasCronicHepatopatia) {
          this.conductSuggestionText = 'Considerar diagnóstico de sindrome mielodisplásica e encaminhar ao hematologista.'
          return info
        };

        if (this.selected_vcm == ">100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_b12_vitamine == "Normal" && this.selected_folic_acid == "Normal" && this.hasCronicHepatopatia) {
          this.conductSuggestionText = 'Provável macrocitose pela hepatopatia. Descartar outras causas de anemia macrocítica como Hipotiroidismo. Encaminhar ao Hematologista.'
          return info
        };

        if (this.hasTalassemia && !this.hasHemoglobinopatia && this.hasReveivedTransfusion) {
          this.conductSuggestionText = 'Se paciente em programa de transfusão regular, será necessário avaliação do hematologista e programar reserva cirurgica com CH fenotipado. Comunicar Serviço de Hemoterapia.'
          return info
        };
      }

      let hb = this.selected_hb
      let comorbidity = this.comorbities.length > 0 && !this.comorbities.includes('Não')
      let physicalmptoms = this.selected_physical_exam.length > 0 && !this.selected_physical_exam.includes('Não')
      if (hb === 'Hb<7') {
        if (!comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'xxx1 A transfusão não é recomendada neste caso, mas é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return positive
        } else if (comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'xxx2 Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return alert
        } else if (comorbidity && physicalmptoms) {
          // Nao seria o caso de deixar essa sugestao mais branda?
          this.conductSuggestionText = 'Provavelmente se beneficiará com a transfusão. Porém é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Este é um paciente de maior risco pré-operatório. Solicite os exames abaixo e preencha os resultados.'
          return danger
        } else if (!comorbidity && physicalmptoms) {
          this.conductSuggestionText = 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return alert
        }
      } else if (hb === '7<Hb<9') {
        if (!comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return positive
        } else if (comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'Provavelmente não deverá ser transfundido por não apresentar repercussão clínica da anemia. Paciente de maior risco pré-operatório por apresentar comorbidade  e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return alert
        } else if (comorbidity && physicalmptoms) {
          this.conductSuggestionText = 'Pode precisar de transfusão, mas é necessário fazer uma avaliação clínica para investigar se os sintomas estão relacionados a outras causas além da anemia, como infecção, distúrbios metabólicos, principalmente em pacientes com anemia crônica e sem sangramento agudo (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return danger
        } else if (!comorbidity && physicalmptoms) {
          this.conductSuggestionText = 'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return positive
        }
      } else if (hb === '9<Hb<13') {
        if (!comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return positive
        } else if (comorbidity && !physicalmptoms) {
          this.conductSuggestionText = 'Transfusão não recomendada. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Veja a sugestão de exames a serem coletados.'
          return positive
        } else if (comorbidity && physicalmptoms) {
          this.conductSuggestionText = 'Provavelmente não deverá ser transfundido, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado (laranja). Paciente de maior risco pré-operatório por apresentar comorbidade e anemia. É fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return alert
        } else if (!comorbidity && physicalmptoms) {
          this.conductSuggestionText = 'Provavelmente não precisa de transfusão, principalmente em pacientes com anemia crônica e sem sangramento agudo. Recomendamos avaliação clínica para identificar as possíveis causas dos sintomas apresentados e tratamento adequado. Além disso, é fundamental investigar a etiologia da anemia e prosseguir com o tratamento antes da cirurgia. Solicite os exames abaixo e preencha os resultados.'
          return positive
        }
      } else {
        return '#2A3B4D'
      }
    },
    askFerroSerico() {
      if (!this.isGroup2Filled || !this.saveClikedForGroup2) return false;
      if (this.selected_vcm == "<80fl" && !this.hasTalassemia && !this.hasHemoglobinopatia && !this.hasFalciformeAnemia) return true;
      if (this.selected_vcm == "<80-100fl" && this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true;
      if (this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true
    },
    askFerritine() {
      if (!this.isGroup2Filled || !this.saveClikedForGroup2) return false;
      if (this.selected_vcm == "<80fl" && !this.hasTalassemia && !this.hasHemoglobinopatia && !this.hasFalciformeAnemia) return true;
      if (this.selected_vcm == "<80-100fl" && this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true;
      if (this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true
    },
    askFerritineSaturation() {
      if (!this.isGroup2Filled || !this.saveClikedForGroup2) return false;
      if (this.selected_vcm == "<80fl" && !this.hasTalassemia && !this.hasHemoglobinopatia && !this.hasFalciformeAnemia) return true;
      if (this.selected_vcm == "<80-100fl" && this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true;
      if (this.selected_hcm == "<27pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true
    },
    askB12Vitamine(){
      if (!this.isGroup2Filled || !this.saveClikedForGroup2) return false;
      if (this.selected_vcm == "<80-100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF > 60 ml/min/1,73m2") return true;
      if (this.selected_vcm == ">100fl" && this.selected_hcm == "27-32pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF > 60 ml/min/1,73m2") return true;
      if (this.selected_vcm == ">100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true;
    },
    askFolicAcid() {
      if (!this.isGroup2Filled || !this.saveClikedForGroup2) return false;
      if (this.selected_vcm == "<80-100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF > 60 ml/min/1,73m2") return true;
      if (this.selected_vcm == ">100fl" && this.selected_hcm == "27-32pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia && this.selected_gloumerar == "TGF > 60 ml/min/1,73m2") return true;
      if (this.selected_vcm == ">100fl" && this.selected_hcm == ">32pg" && !this.hasTalassemia && !this.hasTalassemia && !this.hasFalciformeAnemia && !this.hasHemoglobinopatia) return true;
    },
    hasTalassemia() {
      return this.previous_hemoglobine_value.includes("Talassemia")
    },
    hasHemoglobinopatia() {
      return this.set_previous_hemoglobine_value.includes("Não")
    },
    hasFalciformeAnemia() {
      return this.set_previous_hemoglobine_value.includes("Anemia falciformeão")
    },
    hasReveivedTransfusion() {
      return this.selected_transfusion == "Sim"
    },
    hasCronicHepatopatia() {
      return this.set_hemostasis_value.includes("Hepatopatia crônica")
    }
  },
  methods: {
    ...mapActions(useExamStore, ["hasSaved"]),
    registerExam() {
      this.overlay = true
      this.btn.loading = true
      this.btn.disabled = true
      this.successAlert = ''
      this.warningAlert = ''
      axios
        .post(
          `${this.APIbasePath}/patient/${this.id}/exam`,
          {
            patient_id: this.id,
            comorbities: this.comorbities,
            previous_hemoglobine_value: this.previous_hemoglobine_value,
            previous_hemoglobine_text: this.previous_hemoglobine_text,
            selected_procedure: this.selected_procedure,
            selected_procedure_text: this.selected_procedure_text,
            hemostasis_value: this.hemostasis_value,
            hemostasis_text: this.hemostasis_text,
            selected_medication: this.selected_medication,
            selected_hb: this.selected_hb,
            selected_vcm: this.selected_vcm,
            selected_hcm: this.selected_hcm,
            selected_leucocito: this.selected_leucocito,
            selected_plaquetas: this.selected_plaquetas,
            selected_transfusion: this.selected_transfusion,
            selected_gloumerar: this.selected_gloumerar,
            selected_physical_exam: this.selected_physical_exam,

            selected_ferro_serico: this.selected_ferro_serico,
            selected_ferritina: this.selected_ferritina,
            selected_transferrine_saturation: this.selected_transferrine_saturation,
            selected_b12_vitamine: this.selected_b12_vitamine,
            selected_folic_acid: this.selected_folic_acid,
          },
          {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }
        )
        .then((response) => {
          if (response.status == 201) {
            // this.overlay = false
            this.snackbar = true
            this.snackBarText = 'Atualizado com sucesso'
            this.saveClikedForGroup1 = true

            setTimeout(() => { this.overlay = false }, 600)

            if (this.isGroup2Filled && this.saveClikedForGroup1) {
              this.saveClikedForGroup2 = true
            }
          }
        })
        .catch((err) => {
          console.log(err)
          this.btn.loading = false
          this.snackbarColor = 'orange'
          this.snackbar = true
          this.snackBarText = err?.response?.data?.message || 'Erro desconhecido'
        })
    },
    resetAllValues() {
      this.btn.loading = true
      this.btn.disabled = true
      this.successAlert = ''
      this.warningAlert = ''
      console.log("id", this.id);
      axios
        .post(
          `${this.APIbasePath}/patient/${this.id}/exam`,
          {
            patient_id: this.id,

            comorbities: [],
            previous_hemoglobine_value: [],
            hemostasis_value: [],
            selected_physical_exam: [],
            previous_hemoglobine_text: '',
            selected_procedure: null,
            selected_procedure_text: '',
            hemostasis_text: '',
            selected_medication: null,
            selected_hb: null,
            selected_vcm: null,
            selected_hcm: null,
            selected_leucocito: null,
            selected_plaquetas: null,
            selected_transfusion: null,
            selected_gloumerar: null,

            selected_ferro_serico: null,
            selected_ferritina: null,
            selected_transferrine_saturation: null,
            selected_b12_vitamine: null,
            selected_folic_acid: null,
          },
          {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }
        )
        .then((response) => {
          if (response.status == 201) {
            this.btn.loading = false
            this.snackbar = true
            this.snackBarText = 'Dados clínicos restaurados com sucesso!'
            this.btn.loading = false
            this.saveClikedForGroup1 = false
            this.saveClikedForGroup2 = false
            this.clearData()
            this.dialog = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.btn.loading = false
          this.snackbarColor = 'orange'
          this.snackbar = true
          this.snackBarText = err?.response?.data?.message || 'Erro desconhecido'
          this.dialog = false
        })
    },
    clearData() {
      this.comorbities = []
      this.previous_hemoglobine_value = []
      this.hemostasis_value = []
      this.selected_physical_exam = []
      this.previous_hemoglobine_text = ''
      this.selected_procedure = null
      this.selected_procedure_text = ''
      this.hemostasis_text = ''
      this.selected_medication = null
      this.selected_hb = null
      this.selected_vcm = null
      this.selected_hcm = null
      this.selected_leucocito = null
      this.selected_plaquetas = null
      this.selected_transfusion = null
      this.selected_gloumerar = null

      this.selected_ferro_serico = null
      this.selected_ferritina = null
      this.selected_transferrine_saturation = null
      this.selected_b12_vitamine = null
      this.selected_folic_acid = null
    },
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 600)
    },
  },
  mounted() {
    this.overlay = true
    this.loading = true
    axios
      .get(`${this.APIbasePath}/patient/${this.id}/exam`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        this.loading = false
        const { exam } = response.data

        this.comorbities = exam.comorbities || []
        this.previous_hemoglobine_value = exam.previous_hemoglobine_value || []
        this.hemostasis_value = exam.hemostasis_value || []
        this.selected_physical_exam = exam.selected_physical_exam || []

        this.previous_hemoglobine_text = exam.previous_hemoglobine_text
        this.selected_procedure = exam.selected_procedure
        this.selected_procedure_text = exam.selected_procedure_text
        this.hemostasis_text = exam.hemostasis_text
        this.selected_medication = exam.selected_medication
        this.selected_hb = exam.selected_hb
        this.selected_vcm = exam.selected_vcm
        this.selected_hcm = exam.selected_hcm
        this.selected_leucocito = exam.selected_leucocito
        this.selected_plaquetas = exam.selected_plaquetas
        this.selected_transfusion = exam.selected_transfusion
        this.selected_gloumerar = exam.selected_gloumerar

        this.selected_ferro_serico = exam.selected_ferro_serico
        this.selected_ferritina = exam.selected_ferritina
        this.selected_transferrine_saturation = exam.selected_transferrine_saturation
        this.selected_b12_vitamine = exam.selected_b12_vitamine
        this.selected_folic_acid = exam.selected_folic_acid

        if (this.isGroup1Filled) {
          this.saveClikedForGroup1 = true
        } else {
          this.saveClikedForGroup1 = false
          this.saveClikedForGroup2 = false
        }

        if (this.isGroup1Filled && this.isGroup2Filled) {
          this.saveClikedForGroup2 = true
        } else {
          this.saveClikedForGroup2 = false
        }
      })
      .catch((err) => {
        if (err?.response?.status == 404) {
          this.loading = false
          return
        }

        this.warningAlert =
          'Occorreu um erro ou não foi possível os dados clínicos, experimente sair e entrar novamente. Erro: ' +
          err?.response?.data?.message
        if (err?.response?.status == 401) {
          setTimeout(() => {
            this.warningAlert = "Sua seção expirou, redirecionando para a página de login"
            this.$router.push(`/`)
          }, 3000);

          this.$router.push({
            name: 'home'
          })
        }
      })
  }
}
</script>

<style scoped>
label{
  font-size: 14px !important;
  margin: 0;
}

.v-input--selection-controls .v-input--checkbox {
  margin: 0; /* Set margin to zero to remove the default margin */
}
.v-label {
  /* background-color: red; */
  margin: 0;
  padding: 0;
  height: 0%;
}

.v-checkbox .v-selection-control {
    min-height: 0;
    max-height: 15px;
}

</style>
