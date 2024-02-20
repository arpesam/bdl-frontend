<template>
  <!-- CONDUTA -->
  <v-card
    v-if="!warningAlert"
    class="conduct-box" :elevation="0"
    :color="needTransfusion"
    ref="conductdiv"
    @click="showConduct = !showConduct"
  >
        <v-card-item style="padding-bottom: 0 !important; margin: 0;">
          <v-card-title style="font-size: 13px; font-weight: bold;">{{ `Sugestão de conduta [${flow}]` }}</v-card-title>
        </v-card-item>

        <v-card-text v-if="showConduct && !overlay" style="margin-bottom: 30px;">
          <div v-if="conductSuggestionText2">{{ conductSuggestionText2  }} <br/><br/></div>

          {{getConductSuggestionText}}
        </v-card-text>
        <v-card-text v-if="overlay" style="margin-bottom: 30px;">
          <LoadingComponent  :loading="overlay" height="50px" width="50px"/>
        </v-card-text>
        <v-card-actions

          style="margin: 0; min-height: 10px !important; position: absolute; bottom: 0; left: 0; right: 0;"
          class="d-flex justify-center"
        >
            <v-btn style="margin: 0;" rounded="0" block :icon="getExpandIcon" size="x-medium"></v-btn>
        </v-card-actions>
  </v-card>
  <Alert :warningAlert="warningAlert" />

  <!-- GRUPO 3 -->
  <div v-if="isGroup2Filled && !overlay && saveButtonClicked2" >
  <!-- <div v-if="isGroup2Filled"> -->
    <InputPanel v-if="askFerroSerico" title="Ferro sérico:" :value="selected_ferro_serico">
      <v-radio-group v-model="selected_ferro_serico">
        <v-radio label="< 60 mcg/dl" value="< 60 mcg/dl"></v-radio>
        <v-radio label="≥ 60 mcg/dl" value="≥ 60 mcg/dl"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel v-if="askFerritine" title="Ferritina:" :value="selected_ferritina">
      <v-radio-group v-model="selected_ferritina">
        <v-radio label="< 30 mcg/L" value="< 30 mcg/L"></v-radio>
        <v-radio label="≥ 30 e < 100 mcg/L" value="≥ 30 e < 100 mcg/L"></v-radio>
        <v-radio label="≥100 e < 500 mcg/L" value="≥100 e < 500 mcg/L"></v-radio>
        <v-radio label="≥ 500 mcg/L" value="≥ 500 mcg/L"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel v-if="askFerritineSaturation" title="Saturação transferrina:" :value="selected_transferrine_saturation">
      <v-radio-group v-model="selected_transferrine_saturation">
        <v-radio label="< 20%" value="< 20%"></v-radio>
        <v-radio label="≥ 20% e < 30%" value="≥ 20% e < 30%"></v-radio>
        <v-radio label="≥ 30%" value="≥ 30%"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel v-if="askB12Vitamine" title="Vitamina B12:" :value="selected_b12_vitamine">
      <v-radio-group v-model="selected_b12_vitamine">
        <v-radio label="< 200 ng/L" value="< 200 ng/L"></v-radio>
        <v-radio label="≥ 200 ng/L" value="≥ 200 ng/L"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel v-if="askFolicAcid" title="Ácido fólico:" :value="selected_folic_acid">
      <v-radio-group v-model="selected_folic_acid">
        <v-radio label="< 6 ng/ml" value="< 6 ng/ml"></v-radio>
        <v-radio label="≥ 6 ng/ml" value="≥ 6 ng/ml"></v-radio>
      </v-radio-group>
    </InputPanel>
  </div>

  <!-- GRUPO 2 -->
  <div calss="group2" v-if="isGroup1Filled && !overlay && saveButtonClicked == 1">
    <InputPanel title="VCM:" :value="selected_vcm">
      <v-radio-group v-model="selected_vcm">
        <v-radio label="< 80 fl" value="<80fl"></v-radio>
        <v-radio label="80-100 fl" value="80-100fl"></v-radio>
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
        <v-radio label="≥ 4000 x 109/L" value="≥4000"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel title="Plaquetas:" :value="selected_plaquetas">
      <v-radio-group v-model="selected_plaquetas">
        <v-radio label="< 100 x 109/L" value="<100"></v-radio>
        <v-radio label="≥ 100 x 109/L" value="≥100"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel title="Taxa de filtração glomerular:" :value="selected_gloumerar">
      <v-radio-group v-model="selected_gloumerar" inline>
        <v-radio label="TFG < 60 ml/min/1,73m2" value="TFG < 60 ml/min/1,73m2"></v-radio>
        <v-radio label="TFG > 60 ml/min/1,73m2" value="TFG > 60 ml/min/1,73m2"></v-radio>
      </v-radio-group>
    </InputPanel>
  </div>

  <!-- GRUPO 1 -->
  <div class="group1">
    <InputPanel title="Valor de Hemoglobina:" :value="selected_hb">
      <v-radio-group v-model="selected_hb">
        <v-radio label="Hb < 7 g/dl" value="Hb<7"></v-radio>
        <v-radio label="Hb > 7 e Hb < 8 g/dl" value="7<Hb<8"></v-radio>
        <v-radio label="Hb > 8 e < 13 g/dl" value="8<Hb<13"></v-radio>
      </v-radio-group>
    </InputPanel>

    <InputPanel title="Presença de comorbidades?" :value="comorbities">
      <div>
        <v-checkbox v-model="set_comorbities" label="Coronariopatia Isquêmica" value="Coronariopatia Isquêmica"></v-checkbox>
        <v-checkbox v-model="set_comorbities" label="Insuficiência Cardíaca" value="Insuficiência Cardíaca"></v-checkbox>
        <v-checkbox v-model="set_comorbities" label="DPOC" value="DPOC"></v-checkbox>
        <v-checkbox v-model="set_comorbities" label="Doença Renal Crônica" value="Doença Renal Crônica"></v-checkbox>
        <v-checkbox v-model="set_comorbities" label="Nenhuma das anteriores" value="Não"></v-checkbox>
      </div>
    </InputPanel>

    <InputPanel title="Exame físico: apresenta as alterações abaixo?" :value="selected_physical_exam" >
        <v-checkbox v-model="set_selected_physical_exam" label="Dispnéia e/ou sinais de insuficiência respiratória" value="Dispnéia e/ou sinais de insuficiência respiratória" ></v-checkbox>
        <v-checkbox v-model="set_selected_physical_exam" label="Má perfusão tecidual" value="Má perfusão tecidual"></v-checkbox>
        <v-checkbox v-model="set_selected_physical_exam" label="Sonolência e/ou alteração do nível da consciência" value="Sonolência e/ou alteração do nível da consciência" ></v-checkbox>
        <v-checkbox v-model="set_selected_physical_exam" label="PAM < 70 mmHg e/ou FC > 100 bpm" value="PAM < 70 mmHg e/ou FC > 100 bpm"></v-checkbox>
        <v-checkbox v-model="set_selected_physical_exam" label="Nenhuma das anteriores" value="Não"></v-checkbox>
    </InputPanel>

    <InputPanel title="Procedimento cirúrgico a ser realizado:" :value="selected_procedure">
      <v-radio-group v-model="selected_procedure">
        <v-radio label="Pequeno porte (ex: cirurgias dermatológicas, procedimentos dentários, cirurgias endoscópicas, herniorrafias, cirurgias ortopédicas e ginecológicas menores, endarterectomia, RTU)" value="Pequeno porte"></v-radio>
        <br>
        <v-radio label="Médio porte (ex: cirurgias intra-abdominais, angioplastia periférica, aneurisma endovascular, histerectomia, cirurgias plásticas maiores, cirurgia ortopédica de quadril ou coluna, transplante renal, neurocirurgia)" value="Médio porte"></v-radio>
        <br>
        <v-radio label="Grande porte (ex: cirurgia cardíaca, cirurgia vascular maior, transplante hepático ou pulmonar, cirurgia  de ressecção hepática, cirurgia duodeno-pancreática, cistectomia, pneumectomia, amputação de membro inferior, esofagectomia)" value="Grande porte"></v-radio>
        <br>
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

  <!-- BUTTONS -->
  <v-row class="mt-5">
    <v-sheet>
        <v-btn
          fab
          fixed
          size="x-large"
          color="#038C8C"
          style="color: white"
          :disabled="overlay"
          :style="{ position: 'fixed', bottom: '0.6rem', right: '0.6rem', zIndex: 1 }"
          @click="registerExam"
          :loading="overlay"
        >
        Salvar
        </v-btn>
        <v-btn class="ml-8 pl-4 pr-4" variant="flat" color="warning" @click="resetDialog = true" :disabled="overlay">
          Resetar valores
        </v-btn>
    </v-sheet>
  </v-row>

  <!-- RESET DIALOG -->
  <v-row justify="center">
      <v-dialog v-model="resetDialog" width="800">
        <v-card>
          <v-card-title>
            <span class="text-h5">Atenção!</span>
          </v-card-title>
          <v-card-text>
            Ao continuar, todos os dados clínicos deste paciente serão apagados. Deseja continuar?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-darken-1" variant="outlined" @click="resetDialog = false" :disabled="overlay" v-if="!overlay">
              Cancelar
            </v-btn>
            <v-btn color="green-darken-1" variant="outlined" @click="resetAllValues" :disabled="overlay" :loading="overlay">
              Sim, apagar
            </v-btn>
          </v-card-actions>
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
import { mapActions, mapWritableState } from 'pinia'
import { useExamStore } from '@/stores/exams'

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
      showConduct: true,
      flow: '',
      resetDialog: false,
      overlay: true,
      APIbasePath: import.meta.env.VITE_API_URL,
      warningAlert: '',
      conductDialog: false,

      conductSuggestionText: 'Por favor, complete os dados abaixo',
      conductSuggestionText2: '',
      conductSuggestionColor: '#2A3B4D',
      askFerroSerico: false,
      askFerritine: false,
      askFerritineSaturation: false,
      askB12Vitamine: false,
      askFolicAcid: false,
      isGroup1Filled: false,
      isGroup2Filled: false,
      isGroup3Filled: false,

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
    ...mapWritableState(useExamStore, ["saveButtonClicked", "saveButtonClicked2", "saveButtonClicked3"]),
    getConductSuggestionText() {
      this.overlay = true
      setTimeout(() => {
        this.overlay = false
      }, 400);
      return this.conductSuggestionText
    },
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
    getExpandIcon() {
      return !!this.showConduct ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    needTransfusion() {
        const processExamInputs = this.processExamInputsAction()
        const result = processExamInputs(this)
        this.conductSuggestionText = result.conductText
        this.conductSuggestionText2 = result.conductText2
        this.conductSuggestionColor = result.color
        this.askFerroSerico = result.askFerroSerico
        this.askFerritine = result.askFerritine
        this.askFerritineSaturation = result.askFerritineSaturation
        this.askB12Vitamine = result.askB12Vitamine
        this.askFolicAcid = result.askFolicAcid
        this.isGroup1Filled = result.isGroup1Filled
        this.isGroup2Filled = result.isGroup2Filled
        this.isGroup3Filled = result.isGroup3Filled
        this.flow = result.flow

        if (!this.isGroup1Filled) {
          this.saveButtonClicked = 0
        }

        if (this.$refs.conductdiv) {
          this.spacerHeight = this.$refs.conductdiv.$el.clientHeight + 'px';
        }

        return this.conductSuggestionColor
    },
  },
  methods: {
    ...mapActions(useExamStore, ["hasSaved", "processExamInputsAction"]),
    registerExam() {
      window.scrollTo(0,0)
      this.overlay = true
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
            this.saveButtonClicked = 1

            const processExamInputs = this.processExamInputsAction()

            let result = processExamInputs(this)

            this.conductSuggestionText = result.conductText
            this.conductSuggestionText2 = result.conductText2
            if (this.$refs.conductdiv) {
              this.spacerHeight = this.$refs.conductdiv.$el.clientHeight + 'px';
            }

            if (this.isGroup2Filled && this.saveButtonClicked == 1) {
              this.saveButtonClicked2 = 1
            }

            if (this.isGroup1Filled) {
              console.log("group 1 filled after exams register");
              this.saveButtonClicked = 1
            }

            this.showConduct = true
            this.overlay = false
            console.log("exams registered");
          }
        })
        .catch(this.handleErrors)
    },
    resetAllValues() {
      window.scrollTo(0,0)
      this.overlay = true
      this.warningAlert = ''
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
            this.saveButtonClicked = 0
            this.saveButtonClicked2 = 0
            this.clearData()
            this.showConduct = true
            this.overlay = false
            this.resetDialog = false
          }
        })
        .catch(this.handleErrors)
    },
    handleErrors(err) {
      console.log(err)
      this.overlay = false
      this.resetDialog = false

      if (err?.response?.status == 404) {
        return
      }

      if (err?.response?.status == 401) {
        setTimeout(() => {
          this.warningAlert = "Sua seção expirou, redirecionando para a página de login"
          this.$router.push(`/`)
        }, 3000);

        this.$router.push({
          name: 'home'
        })
      }
      this.warningAlert = err.message
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
  mounted() {
    window.scrollTo(0,0)
    this.warningAlert = ''

    this.overlay = true
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

        const processExamInputs = this.processExamInputsAction()
        const result = processExamInputs(this)
        this.flow = result.flow

        console.log("mounting - results", result);
        if (result.isGroup1Filled) {
          console.log("settin save button 1 to 1", );
          this.saveButtonClicked = 1
        } else {
          console.log("group 1 is not filled in mounting", );
          this.saveButtonClicked = 0
          this.saveButtonClicked2 = 0
        }

        if (result.isGroup1Filled && result.isGroup2Filled) {
          this.saveButtonClicked2 = 1
        } else {
          this.saveButtonClicked2 = 0
        }

        this.showConduct = true
        this.overlay = false

      })
      .catch(this.handleErrors)
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

.conduct-box {
  border-radius: 0px;
  position: sticky;
  top: 48px;
  right: 0;
  left: 0;
  z-index: 2;
  min-height: 70px;
  color: white
}

</style>
