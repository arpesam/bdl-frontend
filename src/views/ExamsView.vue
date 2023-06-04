<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar :color="needTransfusion || 'blue'" density="compact">
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        </template>

        <!-- <v-app-bar-title>Sugestão de conduta:</v-app-bar-title> -->
        <v-app-bar-title>{{ needTransfusionText }}</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid fill-height>
          <v-alert
            v-if="showAlert"
            title="Opps, ocorreu um erro!"
            :text="error"
            type="warning"
          ></v-alert>
          <v-alert
            v-if="showSuccess"
            title="Sucesso!"
            text="Paciente editado com sucesso!"
            type="success"
          ></v-alert>

          <v-sheet class="d-flex flex-column align-center justify-center text-center">
            <v-form v-model="isFormValid">
              <v-radio-group v-model="exams.comorbities" label="Presença de comorbidades">
                <v-radio
                  label="Coronariopatia Isquêmica"
                  value="coronariopatia-isquemica"
                ></v-radio>
                <v-radio label="Insuficiência Cardíaca" value="insuficiencia-cardiaca"></v-radio>
                <v-radio label="DPOC" value="dpoc"></v-radio>
                <v-radio label="Doença Renal Crônica" value="doenca-renal-cronica"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group
                v-model="exams.previousHemoglobine.value"
                label="Antecedente de hemoglobinopatia?"
              >
                <v-radio label="Anemia falciforme" value="anemia"></v-radio>
                <v-radio label="Talassemia" value="talassemia"></v-radio>
                <v-radio label="Outro:" value="outro"></v-radio>
                <v-text-field
                  v-if="exams.previousHemoglobine.value === 'outro'"
                  v-model="exams.previousHemoglobine.othersText"
                  label="Especifique"
                ></v-text-field>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group
                v-model="exams.selectedProcedure"
                label="Procedimento cirúrgico a ser realizado:"
              >
                <v-radio label="Pequeno porte (colocar exemplos)" value="pequeno"></v-radio>
                <v-radio label="Médio porte (colocar exemplos)" value="medio"></v-radio>
                <v-radio label="Grande porte (colocar exemplos)" value="grande"></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group
                v-model="exams.hemostasis.value"
                label="Antecedente de alterações da hemostasia:"
              >
                <v-radio label="Hemofilia" value="hemofilia"></v-radio>
                <v-radio label="Hepatopatia crônica" value="hepatopatia"></v-radio>
                <v-radio label="Disfunção plaquetária" value="disfuncao"></v-radio>
                <v-radio label="Outro:" value="outro"></v-radio>
                <v-text-field
                  v-if="exams.hemostasis.value === 'outro'"
                  v-model="exams.hemostasis.othersText"
                  label="Especifique"
                ></v-text-field>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group
                v-model="exams.selectedMedication"
                label="Uso de medicações que aumentam risco de sangramento (anticoagulantes, AAS):"
                inline
              >
                <v-radio label="Sim" value="sim"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group v-model="exams.selectedHb" label="Valor de Hb:">
                <v-radio label="Hb < 7 g/dl" value="Hb<7"></v-radio>
                <v-radio label="Hb > 7 e Hb < 9 g/dl" value="7<Hb<9"></v-radio>
                <v-radio label="Hb > 9 e < 13 g/dl" value="9<Hb<13"></v-radio>
              </v-radio-group>

              <br />

              <v-radio-group v-model="exams.selectedVCM" label="VCM:">
                <v-radio label="< 80 fl" value="<80fl"></v-radio>
                <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
                <v-radio label="> 100 fl" value=">100fl"></v-radio>
              </v-radio-group>
              <br />

              <v-radio-group v-model="exams.selectedHCM" label="HCM:">
                <v-radio label="< 27 pg" value="<27pg"></v-radio>
                <v-radio label="27-32 pg" value="27-32pg"></v-radio>
                <v-radio label="> 32 pg" value=">32pg"></v-radio>
              </v-radio-group>
              <br />

              <v-radio-group v-model="exams.selectedLeucocito" label="Leucócito:">
                <v-radio label="< 4000 x 109/L" value="<4000"></v-radio>
                <v-radio label="> 4000 x 109/L" value=">4000"></v-radio>
              </v-radio-group>
              <br />

              <v-radio-group v-model="exams.selectedPlaquetas" label="Plaquetas:">
                <v-radio label="< 100 x 109/L" value="<100"></v-radio>
                <v-radio label="> 100 x 109/L" value=">100"></v-radio>
              </v-radio-group>
              <br />

              <v-radio-group
                v-model="exams.selectedTransfusion"
                label="Recebeu transfusão nos últimos 3 meses?"
              >
                <v-radio label="Sim" value="sim"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>
              <br />

              <v-radio-group
                v-model="exams.selectedPhysicalExam"
                label="Exame físico: apresenta as alterações abaixo?"
              >
                <v-radio
                  label="Dispnéia e/ou sinais de insuficiência respiratória"
                  value="dispnéia"
                ></v-radio>
                <v-radio label="Má perfusão tecidual" value="máPerfusão"></v-radio>
                <v-radio
                  label="Sonolência e/ou alteração do nível da consciência"
                  value="sonolência"
                ></v-radio>
                <v-radio label="PAM < 70 mmHg e/ou FC > 100 bpm" value="PAM/FC"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>
              <br />

              <v-btn
                variant="flat"
                color="info"
                @click="submit"
                :loading="btn.loading"
                :disabled="!enableBtn"
              >
                Salvar
              </v-btn>
            </v-form>
            <RouterLink to="/dashboard">
              <v-btn variant="flat" color="default" icon="mdi-arrow-left"></v-btn>
            </RouterLink>
          </v-sheet>
          <!-- </v-row> -->
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios'
import VueMask from 'vue-the-mask'

export default {
  directives: {
    mask: VueMask.directive // Registre a diretiva de máscara globalmente
  },
  data() {
    return {
      isFormValid: false,
      exams: {
        comorbities: '',
        previousHemoglobine: {
          value: '',
          othersText: ''
        },
        selectedProcedure: null,
        hemostasis: {
          value: '',
          othersText: ''
        },
        selectedMedication: null,
        selectedHb: null,
        selectedVCM: null,
        selectedHCM: null,
        selectedLeucocito: null,
        selectedPlaquetas: null,
        selectedTransfusion: null,
        selectedPhysicalExam: ''
      },
      patient: {
        initials: '',
        register_num: '',
        birth_date: '',
        weight: '',
        ethnicity: 'Parda',
        genre: 'masculino',
        height: '',
        _id: '',
        items: ['Parda', 'Branca', 'Preta', 'Amarela', 'Indígena']
      },
      btn: {
        loading: false,
        disabled: false
      },
      rules: {
        mandatory: [(value) => !!value || 'Este campo é obrigatório'],
        number: [
          (value) => !!value || 'Este campo é obrigatório',
          (value) => {
            const regex = /^\d{1,3}(,\d{1,5})?$/
            return regex.test(value) || 'Peso deve ser um número'
          }
        ],
        birth: [
          (value) => !!value || 'Este campo é obrigatório',
          (value) => {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/
            return regex.test(value) || 'Esta data é inválida'
          }
        ]
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      error: '',
      showAlert: false,
      showSuccess: false
    }
  },
  methods: {
    submit() {
      console.log('sumit')
    }
  },
  computed: {
    enableBtn() {
      // debugger
      return (
        !!this.patient.initials &&
        !!this.patient.register_num &&
        !!this.patient.birth_date &&
        !!this.patient.weight &&
        !!this.patient.ethnicity &&
        !!this.patient.genre &&
        !!this.patient.height
        // !!this.patient.items
        // this.isFormValid
      )
    },
    needTransfusion() {

      let hb = this.exams.selectedHb;
      let comorbidity = this.exams.comorbities;
      let physicalExamSymptoms = this.exams.selectedPhysicalExam;

      console.log("hb", hb, "- comorbidity", comorbidity, "- physicalExamSymptoms", physicalExamSymptoms);

      if (hb === 'Hb<7') {
        if (!comorbidity && !physicalExamSymptoms) {
          return 'green'
        } else if (comorbidity && !physicalExamSymptoms) {
          return 'yellow'
        } else if (comorbidity && physicalExamSymptoms) {
          return 'red'
        } else if (!comorbidity && physicalExamSymptoms) {
          return 'orange'
        }
      } else if (hb === '7<Hb<9') {
        if (!comorbidity && !physicalExamSymptoms) {
          return 'green'
        } else if (comorbidity && !physicalExamSymptoms) {
          return 'yellow'
        } else if (comorbidity && physicalExamSymptoms) {
          return 'red'
        } else if (!comorbidity && physicalExamSymptoms) {
          return 'green'
        }
      } else if (hb === '9<Hb<13') {
        if (!comorbidity && !physicalExamSymptoms) {
          return 'green'
        } else if (comorbidity && !physicalExamSymptoms) {
          return 'green'
        } else if (comorbidity && physicalExamSymptoms) {
          return 'orange'
        } else if (!comorbidity && physicalExamSymptoms) {
          return 'green'
        }
      } else {
        return null
      }
    },
    needTransfusionText() {
      let color = this.needTransfusion
      console.log("color", color);
      switch (color) {
        case 'green':
          return 'Transfusão não necessária'
        case 'yellow':
          return 'Necessário mais acompanhamento'
        case 'orange':
          return 'Existe um risco de transfusão'
        case 'red':
          return 'A transfusão pode ser necessária'
        default:
          return 'Sugestão de conduta: Preencha os campos'
      }
    }
  },
  methods: {
    register() {
      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false
      console.log('to implement')
    }
  },
  mounted() {
    this.loading = true
  }
}
</script>

<style>
.login-container {
  /* border: 2px solid red; */
  color: #3d3d3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

button {
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  width: 150px;
}

.login-button {
  background-color: #28a745;
}

.signup-button {
  background-color: #007bff;
}
</style>
