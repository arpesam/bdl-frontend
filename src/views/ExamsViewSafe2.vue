<template>
  <!-- <v-container> -->
  <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
  <v-row v-if="loading">
    <v-col justify-center>
      <LoadingComponent :loading="loading" />
    </v-col>
  </v-row>

  <InputPanel title="Presença de comorbidades?" :value="comorbities">
    <div>
      <v-checkbox id="1" v-model="comorbities" label="Coronariopatia Isquêmica" value="Coronariopatia Isquêmica"></v-checkbox>
      <v-checkbox id="2" v-model="comorbities" label="Insuficiência Cardíaca" value="Insuficiência Cardíaca"></v-checkbox>
      <v-checkbox id="3" v-model="comorbities" label="DPOC" value="DPOC"></v-checkbox>
      <v-checkbox id="4" v-model="comorbities" label="Doença Renal Crônica" value="Doença Renal Crônica"></v-checkbox>
      <v-checkbox id="5" v-model="comorbities" label="Não" value="Não"></v-checkbox>
    </div>
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
    <v-radio-group v-model="previous_hemoglobine_value">
      <v-radio label="Anemia falciforme" value="Anemia falciforme"></v-radio>
      <v-radio label="Talassemia" value="Talassemia"></v-radio>
      <v-radio label="Outro:" value="Outro"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
      <v-text-field v-if="previous_hemoglobine_value === 'Outro'" v-model="previous_hemoglobine_text" label="Especifique" ></v-text-field>
    </v-radio-group>
  </InputPanel>

  <InputPanel title="Antecedente de alterações da hemostasia:" :value="hemostasis_value">
    <v-radio-group v-model="hemostasis_value">
      <v-radio label="Hemofilia" value="Hemofilia"></v-radio>
      <v-radio label="Hepatopatia crônica" value="Hepatopatia crônica"></v-radio>
      <v-radio label="Disfunção plaquetária" value="Disfunção plaquetária"></v-radio>
      <v-radio label="Outro:" value="Outro"></v-radio>
      <v-text-field
        v-if="hemostasis_value === 'Outro'"
        v-model="hemostasis_text"
        label="Especifique"
      ></v-text-field>
      <v-radio label="Não" value=""></v-radio>
    </v-radio-group>
  </InputPanel>


  <InputPanel
    title="Uso de medicações que aumentam risco de sangramento (anticoagulantes, AAS):"
    :value="selected_medication"
  >
    <v-radio-group v-model="selected_medication" inline>
      <v-radio label="Sim" value="Sim"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
    </v-radio-group>
  </InputPanel>

<!--







  <InputPanel title="Valor de Hb:" :value="selected_hb">
    <v-radio-group v-model="selected_hb">
      <v-radio label="Hb < 7 g/dl" value="Hb<7"></v-radio>
      <v-radio label="Hb > 7 e Hb < 9 g/dl" value="7<Hb<9"></v-radio>
      <v-radio label="Hb > 9 e < 13 g/dl" value="9<Hb<13"></v-radio>
    </v-radio-group>
  </InputPanel>

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

  <InputPanel title="Recebeu transfusão nos últimos 3 meses?" :value="selected_transfusion">
    <v-radio-group v-model="selected_transfusion" inline>
      <v-radio label="Sim" value="Sim"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
    </v-radio-group>
  </InputPanel>


  <InputPanel title="Taxa de filtração glomerular:" :value="selected_transfusion">
    <v-radio-group v-model="selected_transfusion" inline>
      <v-radio label="TGF &lt; 60 ml/min/1,73m2" value="TGF &lt; 60 ml/min/1,73m2"></v-radio>
      <v-radio label="TGF &gt; 60 ml/min/1,73m2" value="TGF &gt; 60 ml/min/1,73m2"></v-radio>
    </v-radio-group>
  </InputPanel>


  <InputPanel
    title="Exame físico: apresenta as alterações abaixo?"
    :value="selected_physical_exam"
  >
    <v-radio-group v-model="selected_physical_exam">
      <v-radio
        label="Dispnéia e/ou sinais de insuficiência respiratória"
        value="Dispnéia e/ou sinais de insuficiência respiratória"
      ></v-radio>
      <v-radio label="Má perfusão tecidual" value="Má perfusão tecidual"></v-radio>
      <v-radio
        label="Sonolência e/ou alteração do nível da consciência"
        value="Sonolência e/ou alteração do nível da consciência"
      ></v-radio>
      <v-radio label="PAM < 70 mmHg e/ou FC > 100 bpm" value="PAM < 70 mmHg e/ou FC > 100 bpm"></v-radio>
      <v-radio label="Não" value="Não"></v-radio>
    </v-radio-group>
  </InputPanel>




-->

  <br>
  <br>
  <br>
  <br>
  <!-- Repeat the same for the rest of your v-radio-groups -->

  <!-- <v-row v-else> -->
  <v-row>
    <v-sheet>
      <v-form v-model="isFormValid">
        <v-btn
          fab
          icon="mdi-content-save"
          size="x-large"
          fixed
          color="blue"
          :loading="btn.loading"
          :style="{ position: 'fixed', bottom: '0.1rem', right: '0.6rem' }"
          @click="registerExam"
        >
        </v-btn>

        <v-btn variant="flat" color="info" @click="registerExam" :loading="btn.loading">
          Salvar
        </v-btn>
      </v-form>
    </v-sheet>
  </v-row>
  <!-- </v-container> -->
  <v-snackbar v-model="snackbar">
    {{ snackBarText }}
    <template v-slot:actions>
      <v-btn :color="snackbarColor" variant="text" @click="snackbar = false"> Fechar </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'
import LoadingComponent from '@/components/Loading.vue'
import InputPanel from '@/components/InputPanel.vue'

export default {
  components: {
    Alert,
    LoadingComponent,
    InputPanel
  },
  data() {
    return {
      isFormValid: false,
      trip: {
        name: '',
        location: null,
        start: null,
        end: null
      },
      comorbities: [],
      previous_hemoglobine_value: '',
      previous_hemoglobine_text: '',
      selected_procedure: null,
      selected_procedure_text: '',
      hemostasis_value: '',
      hemostasis_text: '',
      selected_medication: null,
      selected_hb: null,
      selected_vcm: null,
      selected_hcm: null,
      selected_leucocito: null,
      selected_plaquetas: null,
      selected_transfusion: null,
      selected_physical_exam: '',
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
    getComorbities: {
      get() {
        return this.comorbities
      },
      set(v) {
        console.log("this", this.comorbities);
        this.comorbities
        return v
      }
    },
    needTransfusion() {
      return false
      // let hb = this.selected_hb
      // let comorbidity = this.comorbities
      // let physicalmptoms = this.selected_physical_exam

      // console.log(
      //   'hb',
      //   hb,
      //   '- comorbidity',
      //   comorbidity,
      //   '- physicalmptoms',
      //   physicalmptoms
      // )

      // if (hb === 'Hb<7') {
      //   if (!comorbidity && !physicalmptoms) {
      //     return 'green'
      //   } else if (comorbidity && !physicalmptoms) {
      //     return 'yellow'
      //   } else if (comorbidity && physicalmptoms) {
      //     return 'red'
      //   } else if (!comorbidity && physicalmptoms) {
      //     return 'orange'
      //   }
      // } else if (hb === '7<Hb<9') {
      //   if (!comorbidity && !physicalmptoms) {
      //     return 'green'
      //   } else if (comorbidity && !physicalmptoms) {
      //     return 'yellow'
      //   } else if (comorbidity && physicalmptoms) {
      //     return 'red'
      //   } else if (!comorbidity && physicalmptoms) {
      //     return 'green'
      //   }
      // } else if (hb === '9<Hb<13') {
      //   if (!comorbidity && !physicalmptoms) {
      //     return 'green'
      //   } else if (comorbidity && !physicalmptoms) {
      //     return 'green'
      //   } else if (comorbidity && physicalmptoms) {
      //     return 'orange'
      //   } else if (!comorbidity && physicalmptoms) {
      //     return 'green'
      //   }
      // } else {
      //   return null
      // }
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
    handleNaoOptionChange(event) {
      debugger
      let comorbitiesSafe = this.comorbities
      if (this.comorbities.length == 0) {
        this.comorbities = []
      } else if (event.target.value == 'Não') {
        this.comorbities = ['Não']
      } else {
        let indexToRemove = this.comorbities.findIndex((el) => el === 'Não');
        if (indexToRemove !== -1) {
          comorbitiesSafe = this.comorbities.splice(indexToRemove, 1);
          this.comorbities = comorbitiesSafe
        }
      }
    },
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
            selected_physical_exam: this.selected_physical_exam,
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
    },
    calcular() {

    }
  },
  mounted() {
    debugger
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
        const { exam } = response.data
        this.comorbities.push( exam[0].comorbities)
        this.previous_hemoglobine_value = exam[0].previous_hemoglobine_value
        this.previous_hemoglobine_text = exam[0].previous_hemoglobine_text
        this.selected_procedure = exam[0].selected_procedure
        this.selected_procedure_text = exam[0].selected_procedure_text
        this.hemostasis_value = exam[0].hemostasis_value
        this.hemostasis_text = exam[0].hemostasis_text
        this.selected_medication = exam[0].selected_medication
        this.selected_hb = exam[0].selected_hb
        this.selected_vcm = exam[0].selected_vcm
        this.selected_hcm = exam[0].selected_hcm
        this.selected_leucocito = exam[0].selected_leucocito
        this.selected_plaquetas = exam[0].selected_plaquetas
        this.selected_transfusion = exam[0].selected_transfusion
        this.selected_physical_exam = exam[0].selected_physical_exam
      })
      .catch((err) => {
        console.log("--------------", err);
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
