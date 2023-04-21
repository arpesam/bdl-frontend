<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar color="blue" density="compact">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Cadastrar paciente</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container fluid fill-height style="height: 94vh">
          <v-alert v-if="showAlert" title="Opps, ocorreu um erro!" :text="error" type="warning"></v-alert>
          <v-alert v-if="showSuccess" title="Sucesso!" text="Usuário cadastrado com sucesso!" type="success"></v-alert>
          <v-sheet class="d-flex flex-column align-center justify-center text-center">
            <v-form v-model="isFormValid">
              <br />
              <v-text-field
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
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.birth_date"
              ></v-text-field>
              <br />
              <v-text-field
                style="width: 250px"
                label="Peso (74)"
                :rules="rules.mandatory"
                hide-details="auto"
                v-model="patient.weight"
              ></v-text-field>
              <br />
              <!-- <v-date-picker v-model="picker" :landscape="landscape" :reactive="reactive"></v-date-picker> -->
              <br/>
              <v-text-field
                style="width: 250px"
                label="Altura (1,60)"
                :rules="rules.mandatory"
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
              <v-btn variant="flat" color="info" @click="register" :loading="btn.loading" :disabled="!enableBtn">
                Cadastrar
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
// import DatePicker from '../components/DatePicker.vue';

export default {
  // components: {
  //   DatePicker
  // },
  data() {
    return {
      isFormValid: false,
      patient: {
        initials: '',
        register_num: '',
        birth_date: '',
        weight: '',
        ethnicity: 'Pardo',
        genre: 'masculino',
        height: '',
        items: ['Branco', 'Preto', 'Pardo', 'Amarelo']
      },
      btn: {
        loading: false,
        disabled: false
      },
      rules: {
        mandatory: [(value) => !!value || 'Este campo é obrigatório']
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      error: '',
      showAlert: false,
      showSuccess: false,
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
        !!this.patient.items
      ) && this.isFormValid
    }
  },
  methods: {
    register() {
      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false
      axios
        .post(`${this.APIbasePath}/patient`, {
          ...this.patient
        })
        .then((response) => {
          if (response.status == 201) {
            console.log('Paciente cadastrado com sucesso', response)
            this.btn.loading = false
            this.showSuccess = true
            // setTimeout(() => {
            //   this.$router.push(`/dashboard`)
            // }, 1000);
            // localStorage.setItem('token', response.data.token)
          }
        })
        .catch((err) => {
          console.log(err)
          this.showAlert = true
          this.btn.disabled = false
          this.btn.loading = false
          this.error = err?.response?.data?.message
        })
    }
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
