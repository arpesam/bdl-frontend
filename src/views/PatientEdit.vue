<template>
  <v-container fluid fill-height>
    <v-alert v-if="showAlert" title="Opps, ocorreu um erro!" :text="error" type="warning"></v-alert>
    <v-alert
      v-if="showSuccess"
      title="Sucesso!"
      text="Paciente editado com sucesso!"
      type="success"
    ></v-alert>
    <v-sheet class="d-flex flex-column align-center justify-center text-center">
      <v-form v-model="isFormValid">
        <v-text-field
          class="mt-2"
          style="width: 250px; margin-bottom: 10px"
          label="Iniciais"
          :rules="rules.mandatory"
          hide-details="auto"
          v-model="patient.initials"
        ></v-text-field>

        <v-text-field
          style="width: 250px; margin-bottom: 10px"
          label="Núm. de registro"
          :rules="rules.mandatory"
          hide-details="auto"
          v-model="patient.register_num"
        ></v-text-field>

        <v-text-field
          style="width: 250px; margin-bottom: 10px"
          label="Peso"
          placeholder="74"
          :rules="rules.number"
          hide-details="auto"
          v-model="patient.weight"
        ></v-text-field>

        <v-text-field
          style="width: 250px; margin-bottom: 10px"
          label="Altura"
          placeholder="1,60"
          :rules="rules.number"
          hide-details="auto"
          v-model="patient.height"
        ></v-text-field>

        <v-select
          :items="patient.items"
          label="Etnia"
          style="width: 250px; margin-bottom: 10px"
          v-model="patient.ethnicity"
        ></v-select>

        <label for="calendar-div">Data de nascimento</label><br />
        <Datepicker
          v-model="patient.birth_date"
          language="pt"
          input-class="teste"
          style="width: 250px; margin-bottom: 20px"
        />

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
      <!-- <RouterLink to="/dashboard">
        <v-btn variant="text">Voltar</v-btn>
      </RouterLink> -->
    </v-sheet>
  </v-container>
</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'
import Datepicker from 'vuejs3-datepicker'

export default {
  components: {
    Alert,
    Datepicker
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
            const regex = /^\d{1,3}([,.]\d{1,5})?$/
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
      return (
        !!this.patient.initials &&
        !!this.patient.register_num &&
        !!this.patient.birth_date &&
        !!this.patient.weight &&
        !!this.patient.ethnicity &&
        !!this.patient.genre &&
        !!this.patient.height
      )
    }
  },
  methods: {
    register() {
      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false

      this.patient.height = `${this.patient.height}`.replace(/,/g, '.')
      this.patient.weight = `${this.patient.weight}`.replace(/,/g, '.')

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
            this.btn.loading = false
            this.showSuccess = true
            setTimeout(() => {
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
    }
  },
  mounted() {
    this.loading = true
    var patient = localStorage.getItem(this.$route.params.id)
    patient = JSON.parse(patient)

    // const date = new Date(patient.birth_date);

    // const day = String(date.getDate()).padStart(2, '0');
    // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we need to add 1
    // const year = date.getFullYear();

    // const formattedDate = `${day}/${month}/${year}`;
    this.patient = patient
    // this.patient.birth_date = formattedDate
  }
}
</script>

<style></style>
