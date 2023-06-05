<template>
  <v-card class="mx-auto" elevation="0">
    <v-layout>
      <v-app-bar color="blue" density="compact" elevation="0">
        <v-app-bar-title>Cadastrar paciente</v-app-bar-title>

        <template v-slot:append>
          <RouterLink to="/dashboard">
          <v-btn icon="mdi-arrow-left" color="white" size="x-large"></v-btn>
          </RouterLink>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid fill-height>
          <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
          <v-sheet class="d-flex flex-column align-center justify-center text-center">
            <v-form v-model="isFormValid">
              <v-text-field
                style="width: 250px; margin-bottom: 10px;"
                label="Iniciais do paciente"
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.initials"
              ></v-text-field>
              <!-- <br /> -->
              <v-text-field
                style="width: 250px; margin-bottom: 10px;"
                label="Núm. de registro do paciente"
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.register_num"
              ></v-text-field>

              <v-text-field
                style="width: 250px; margin-bottom: 10px;"
                label="Data de nascimento"
                placeholder="DD/MM/YYYY"
                :rules="rules.birth"
                hide-details="auto"
                v-model="patient.birth_date"
              ></v-text-field>

              <v-text-field
                style="width: 250px; margin-bottom: 10px;"
                label="Peso"
                placeholder="74"
                :rules="rules.number"
                hide-details="auto"
                v-model="patient.weight"
              ></v-text-field>

              <v-text-field
                style="width: 250px; margin-bottom: 10px;"
                label="Altura"
                placeholder="1,60"
                :rules="rules.number"
                hide-details="auto"
                v-model="patient.height"
              ></v-text-field>
              <!-- <br /> -->
              <v-select
                :items="patient.items"
                label="Etnia"
                style="width: 250px; margin-bottom: 10px;"
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
                Cadastrar
              </v-btn>
            </v-form>
          </v-sheet>
          <!-- </v-row> -->
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'

export default {
  components: {
    Alert
  },
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
            const regex = /^\d{1,3}([,.]\d{1,5})?$/
            return regex.test(value) || 'Peso deve ser um número'
          }
        ],
        birth: [
          (value) => !!value || 'Este campo é obrigatório',
          (value) => {
            const regex = /^\d{2}\/\d{2}\/\d{4}$/
            return regex.test(value) || 'Preencha a data nesse formato DD/MM/YYYY'
          }
        ]
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      error: '',
      showAlert: false,
      showSuccess: false,
      successAlert: '',
      warningAlert: ''
    }
  },
  computed: {
    enableBtn() {
      return (
        !!this.patient.initials &&
        !!this.patient.register_num &&
        !!this.patient.birth_date &&
        !!this.patient.weight &&
        !!this.patient.ethnicity &&
        !!this.patient.genre &&
        !!this.patient.height &&
        !!this.patient.items &&
        this.isFormValid
      )
    }
  },
  methods: {
    register() {
      this.btn.loading = true
      this.btn.disabled = true
      this.successAlert = ''
      this.warningAlert = ''

      this.patient.height = `${this.patient.height}`.replace(/,/g, '.')
      this.patient.weight = `${this.patient.weight}`.replace(/,/g, '.')

      axios
        .post(
          `${this.APIbasePath}/patient`,
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
          if (response.status == 201) {
            this.btn.loading = false
            this.successAlert = 'Paciente cadastrado com sucesso!'
            setTimeout(() => {
              this.$router.push(`/dashboard`)
              this.successAlert = ''
              this.btn.loading = false
            }, 2000)
          }
        })
        .catch((err) => {
          console.log(err)
          this.warningAlert = err?.response?.data?.message || "Erro desconhecido"
          this.btn.disabled = false
          this.btn.loading = false
          setTimeout(() => {
            // this.$router.push(`/`)
            this.warningAlert = ''
          }, 5000)
        })
    },
    clearInfo() {
      this.patient = {
        initials: '',
        register_num: '',
        birth_date: '',
        weight: '',
        ethnicity: 'Parda',
        genre: 'masculino',
        height: '',
        items: ['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena']
      }
    }
  }
}
</script>

<style>
.login-container {
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

.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
