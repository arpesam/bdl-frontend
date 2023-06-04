<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar color="blue" density="compact">
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        </template>

        <v-app-bar-title>Editar paciente</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid fill-height style="height: 94vh">
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
              <br />
              <v-text-field
              class="mt-2"
                style="width: 250px"
                label="Iniciais"
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.initials"
              ></v-text-field>
              <br />
              <v-text-field
                style="width: 250px"
                label="Núm. de registro"
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.register_num"
              ></v-text-field>
              <br />
              <v-text-field
                style="width: 250px"
                label="Data de nascimento"
                v-mask="'##/##/####'"
                placeholder="DD/MM/YYYY"
                :rules="rules.birth"
                hide-details="auto"
                v-model="patient.birth_date"
              ></v-text-field>
              <br />
              <v-text-field
                style="width: 250px"
                label="Peso"
                placeholder="74"
                :rules="rules.number"
                hide-details="auto"
                v-model="patient.weight"
              ></v-text-field>
              <br />
              <!-- <v-date-picker v-model="picker" :landscape="landscape" :reactive="reactive"></v-date-picker> -->
              <v-text-field
                style="width: 250px"
                label="Altura"
                placeholder="1,60"
                :rules="rules.number"
                hide-details="auto"
                v-model="patient.height"
              ></v-text-field>
              <br />
              <v-select
                :items="patient.items"
                label="Etnia"
                style="width: 250px"
                v-model="patient.ethnicity"
              ></v-select>
              <br />
              <v-radio-group v-model="patient.genre" inline>
                <v-radio label="Masculino" value="masculino"></v-radio>
                <v-radio label="Feminino" value="feminino"></v-radio>
              </v-radio-group>
              <v-btn
                variant="flat"
                color="info"
                @click="register"
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
  // props: ['patient'],
  data() {
    return {
      isFormValid: false,
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
    }
  },
  methods: {
    register() {
      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false
      console.log("----", this.patient._id);
      axios
        .put(
          `${this.APIbasePath}/patient/${this.patient._id}`,
          {
            ...this.patient
          },
          {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }
        )
        .then((response) => {
          if (response.status == 200) {
            console.log('Paciente editado com sucesso', response)
            this.btn.loading = false
            this.showSuccess = true
            // let patients = sessionStorage.getItem('patients')
            // if (patients) {
            //   patients = JSON.parse(patients)
            //   patients.push(this.patient)
            // }
            // sessionStorage.setItem('patients', JSON.stringify(patients));
            setTimeout(() => {
              // this.$router.push(`/dashboard`)
              this.showSuccess = false
              this.btn.loading = false
            }, 2000)
          }
        })
        .catch((err) => {
          console.log(err)
          this.showAlert = true
          this.btn.disabled = false
          this.btn.loading = false
          this.error = err?.response?.data?.message
          setTimeout(() => {
            // this.$router.push(`/`)
            this.showAlert = false
          }, 5000)


        })
    },
  },
  mounted() {
    this.loading = true
    console.log("params-", this.$route.params);
    var patient = localStorage.getItem(this.$route.params.id)
    patient = JSON.parse(patient)

    console.log("pateint", patient);
    const date = new Date(patient.birth_date);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we need to add 1
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    this.patient = patient
    this.patient.birth_date = formattedDate
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
