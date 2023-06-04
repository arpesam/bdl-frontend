<template>
  <v-layout>
    <v-app-bar color="blue" density="compact" elevation="0">
      <v-app-bar-title style="font-size: 15px">Sugestão de conduta</v-app-bar-title>
      <template v-slot:append>
        <RouterLink to="/dashboard">
          <v-btn icon="mdi-arrow-left" color="white" size="x-large"></v-btn>
        </RouterLink>
      </template>
    </v-app-bar>

    <v-app-bar :color="needTransfusion || 'grey'" density="compact">
      <v-app-bar-title style="font-size: 15px">{{ needTransfusionText }}</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid fill-height>
        <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
        <v-row v-if="loading">
          <v-col justify-center>
            <LoadingComponent :loading="loading" />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-sheet>
            <v-form v-model="isFormValid">
              <v-radio-group v-model="exams.comorbities" name="comorbity">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>Presença de comorbidades</strong></div>
                </template>
                <v-radio
                  label="Coronariopatia Isquêmica"
                  value="coronariopatia-isquemica"
                ></v-radio>
                <v-radio label="Insuficiência Cardíaca" value="insuficiencia-cardiaca"></v-radio>
                <v-radio label="DPOC" value="dpoc"></v-radio>
                <v-radio label="Doença Renal Crônica" value="doenca-renal-cronica"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_physicalExam">
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong>Exame físico: apresenta as alterações abaixo?</strong>
                  </div>
                </template>
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

              <v-radio-group v-model="exams.previous_hemoglobine_value">
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong>Antecedente de hemoglobinopatia?</strong>
                  </div>
                </template>
                <v-radio label="Anemia falciforme" value="anemia"></v-radio>
                <v-radio label="Talassemia" value="talassemia"></v-radio>
                <v-radio label="Outro:" value="outro"></v-radio>
                <v-text-field
                  v-if="exams.previous_hemoglobine_value === 'outro'"
                  v-model="exams.previous_hemoglobine_text"
                  label="Especifique"
                ></v-text-field>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_procedure">
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong>Procedimento cirúrgico a ser realizado:</strong>
                  </div>
                </template>
                <v-radio label="Pequeno porte (colocar exemplos)" value="pequeno"></v-radio>
                <v-radio label="Médio porte (colocar exemplos)" value="medio"></v-radio>
                <v-radio label="Grande porte (colocar exemplos)" value="grande"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.hemostasis_value">
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong>Antecedente de alterações da hemostasia:</strong>
                  </div>
                </template>
                <v-radio label="Hemofilia" value="hemofilia"></v-radio>
                <v-radio label="Hepatopatia crônica" value="hepatopatia"></v-radio>
                <v-radio label="Disfunção plaquetária" value="disfuncao"></v-radio>
                <v-radio label="Outro:" value="outro"></v-radio>
                <v-text-field
                  v-if="exams.hemostasis_value === 'outro'"
                  v-model="exams.hemostasis_text"
                  label="Especifique"
                ></v-text-field>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_medication" inline>
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong
                      >Uso de medicações que aumentam risco de sangramento (anticoagulantes,
                      AAS):</strong
                    >
                  </div>
                </template>
                <v-radio label="Sim" value="sim"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_hb">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>Valor de Hb:</strong></div>
                </template>
                <v-radio label="Hb < 7 g/dl" value="Hb<7"></v-radio>
                <v-radio label="Hb > 7 e Hb < 9 g/dl" value="7<Hb<9"></v-radio>
                <v-radio label="Hb > 9 e < 13 g/dl" value="9<Hb<13"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_vcm">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>VCM:</strong></div>
                </template>
                <v-radio label="< 80 fl" value="<80fl"></v-radio>
                <v-radio label="normal 80-100 fl" value="80-100fl"></v-radio>
                <v-radio label="> 100 fl" value=">100fl"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_hcm">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>HCM:</strong></div>
                </template>
                <v-radio label="< 27 pg" value="<27pg"></v-radio>
                <v-radio label="27-32 pg" value="27-32pg"></v-radio>
                <v-radio label="> 32 pg" value=">32pg"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_leucocito">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>Leucócito:</strong></div>
                </template>
                <v-radio label="< 4000 x 109/L" value="<4000"></v-radio>
                <v-radio label="> 4000 x 109/L" value=">4000"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_plaquetas">
                <template v-slot:label>
                  <div style="white-space: wrap"><strong>Plaquetas:</strong></div>
                </template>
                <v-radio label="< 100 x 109/L" value="<100"></v-radio>
                <v-radio label="> 100 x 109/L" value=">100"></v-radio>
              </v-radio-group>

              <v-radio-group v-model="exams.selected_transfusion" inline>
                <template v-slot:label>
                  <div style="white-space: wrap">
                    <strong>Recebeu transfusão nos últimos 3 meses?</strong>
                  </div>
                </template>

                <v-radio label="Sim" value="sim"></v-radio>
                <v-radio label="Não" value=""></v-radio>
              </v-radio-group>

              <v-btn
                fab
                icon="mdi-content-save"
                size="x-large"
                fixed
                color="blue"
                :loading="btn.loading"
                :style="{ position: 'fixed', bottom: '0.1rem', right: '0.1rem' }"
                @click="registerExam"
              >
              </v-btn>

              <v-btn variant="flat" color="info" @click="registerExam" :loading="btn.loading">
                Salvar
              </v-btn>
            </v-form>
          </v-sheet>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbar">
      {{ snackBarText }}

      <template v-slot:actions>
        <v-btn :color="snackbarColor" variant="text" @click="snackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'
import LoadingComponent from '@/components/Loading.vue'

export default {
  components: {
    Alert,
    LoadingComponent
  },
  data() {
    return {
      isFormValid: false,
      exams: {
        comorbities: '',
        previous_hemoglobine_value: '',
        previous_hemoglobine_text: '',
        selected_procedure: null,
        hemostasis_value: '',
        hemostasis_text: '',
        selected_medication: null,
        selected_hb: null,
        selected_vcm: null,
        selected_hcm: null,
        selected_leucocito: null,
        selected_plaquetas: null,
        selected_transfusion: null,
        selected_physicalExam: ''
      },
      patient: {
        _id: ''
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      successAlert: '',
      warningAlert: '',
      loading: false,
      snackbar: false,
      snackBarText: '',
      snackbarColor: 'green',
      btn: {
        loading: false
      }
    }
  },
  computed: {
    needTransfusion() {
      let hb = this.exams.selected_hb
      let comorbidity = this.exams.comorbities
      let physicalExamSymptoms = this.exams.selected_physicalExam

      console.log(
        'hb',
        hb,
        '- comorbidity',
        comorbidity,
        '- physicalExamSymptoms',
        physicalExamSymptoms
      )

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
      switch (color) {
        case 'green':
          return 'Transfusão não necessária'
        case 'yellow':
          return 'Necessário mais acompanhamento'
        case 'orange':
          return 'Existe risco de transfusão'
        case 'red':
          return 'A transfusão pode ser necessária'
        default:
          return 'Preencha mais campos'
      }
    }
  },
  methods: {
    registerExam() {
      this.btn.loading = true
      this.btn.disabled = true
      this.successAlert = ''
      this.warningAlert = ''
      axios
        .post(
          `${this.APIbasePath}/patient/${this.patient._id}/exam`,
          {
            patient_id: this.patient._id,
            ...this.exams
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
            this.snackBarText = 'Atualizado com sucesso'
            this.btn.loading = false
          }
        })
        .catch((err) => {
          console.log(err)
          this.btn.loading = false
          this.snackbarColor = 'orange'
          this.snackbar = true
          this.snackBarText = err?.response?.data?.message || 'Erro desconhecido'
        })
    }
  },
  mounted() {
    var patient = localStorage.getItem(this.$route.params.id)
    patient = JSON.parse(patient)
    this.patient._id = patient._id
    this.loading = true
    axios
      .get(`${this.APIbasePath}/patient/${this.patient._id}/exam`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        this.loading = false
        console.log(response.data)
        this.exams = response.data.exam[0]
      })
      .catch((err) => {
        if (err?.response?.status == 404) {
          this.loading = false
          return
        }

        this.warningAlert =
          'Não foi possível encontrar este registro, experimente sair e entrar novamente. Erro: ' +
          err?.response?.data?.message
        if (err?.response?.status == 401) {
          // this.$router.push({
          //   name: 'home'
          // })
        }
      })
  }
}
</script>

<style></style>
