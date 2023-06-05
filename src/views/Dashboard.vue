<template>
  <v-card class="mx-auto" elevation="0">
    <v-layout>
      <v-app-bar color="blue" density="compact">
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon @click="toggleLogoutDropdown"></v-app-bar-nav-icon> -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item @click="logout">
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-app-bar-title>Pacientes</v-app-bar-title>

        <template v-slot:append>
          <RouterLink to="/register/patient">
            <v-btn icon="mdi-account-multiple-plus" color="white" size="x-large"></v-btn>
          </RouterLink>
        </template>
      </v-app-bar>

      <!-- CODE -->
      <v-main>
        <v-container fluid class="fill-height">
          <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
          <v-row v-if="loading">
            <v-col justify-center>
              <LoadingComponent :loading="loading" />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col v-if="patients.length === 0" justify-center cols="12" sm="12">
              <div class="empty-message">
                Voce ainda não cadastrou nenhum paciente, clique em <br/> <RouterLink to="/register/patient">
            <v-btn icon="mdi-account-multiple-plus" color="white" size="x-large"></v-btn>
          </RouterLink> <br/>para adicionar novos
                pacientes
              </div>
            </v-col>
            <v-col
              v-else
              v-for="usr in patients"
              :key="usr.id"
              cols="12"
              xs="6"
              sm="6"
              md="3"
              lg="3"
              xl="4"
            >
              <PatientCard :patient="usr" @deletePatient="deletePatient(usr)" />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
  <v-snackbar v-model="snackbar">
    {{ snackBarText }}

    <template v-slot:actions>
      <v-btn :color="snackbarColor" variant="text" @click="snackbar = false"> Fechar </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import axios from 'axios'
import LoadingComponent from '@/components/Loading.vue'
import PatientCard from '@/components/PatientCard.vue'
import Alert from '@/components/Alert.vue'

export default {
  components: {
    LoadingComponent,
    PatientCard,
    Alert
  },
  data() {
    return {
      APIbasePath: import.meta.env.VITE_API_URL,
      logoutDropdown: false,
      menu: 'fa-list',
      password: '',
      patients: [],
      loading: false,
      successAlert: '',
      warningAlert: '',
      snackbar: false,
      snackBarText: '',
      snackbarColor: 'green'
    }
  },
  methods: {
    toggleLogoutDropdown() {
      this.logoutDropdown = !this.logoutDropdown
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push(`/`)
    },
    goToEdit(patient) {
      localStorage.setItem(`${patient._id}`, JSON.stringify(patient))
      this.$router.push({
        name: 'exams-view',
        params: { id: patient._id, patient }
      })
    },
    deletePatient(patient) {
      this.warningAlert = ''
      this.successAlert = ''
      this.loading = true
      axios
        .delete(`${this.APIbasePath}/patient/${patient._id}`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        .then((response) => {
          if (response.status == 200) {
            this.patients = this.patients.map((pt) => {
              if (pt._id != patient._id) {
                return pt
              }
            })
            this.loading = false
            // this.successAlert = 'Removido com sucesso'
            this.snackbar = true
            this.snackBarText = 'Removido com sucesso'
          }
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
          this.snackbarColor = 'orange'
          this.snackbar = true
          this.snackBarText = err?.response?.data?.message
        })
    }
  },

  mounted() {
    this.loading = true
    axios
      .get(`${this.APIbasePath}/patient`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        this.loading = false
        console.log(response.data.patients)
        this.patients = response.data.patients
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          this.$router.push({
            name: 'home'
          })
        }
      })
  }
}
</script>

<style>
.container {
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
.empty-message {
  text-align: center;
  margin: 100px;
}
</style>
