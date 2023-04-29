<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar color="blue" density="compact">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleLogoutDropdown"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Pacientes</v-app-bar-title>

        <template v-slot:append>
          <RouterLink to="/register/patient">
            <v-btn class="ma-2" color="white" variant="flat">
              <v-icon start icon="mdi-plus"></v-icon>
              Cadastrar
            </v-btn>
          </RouterLink>
        </template>
      </v-app-bar>

      <v-menu v-model="logoutDropdown" bottom left>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- CODE -->
      <v-main>
        <v-container fluid class="fill-height">
          <v-row  v-if="loading">
            <v-col justify-center>
              <LoadingComponent :loading="loading" />
            </v-col>
          </v-row>
          <v-row v-else>
              <v-col v-if="patients.length === 0" justify-center cols="12" sm="12">
                <div class="empty-message">Voce ainda não cadastrou nenhum paciente, clique em Cadastrar para adicionar novos pacientes</div>
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
                  <v-sheet
                    elevation="12"
                    max-width="600"
                    rounded="lg"
                    width="100%"
                    class="pa-4 text-center mx-auto"
                  >
                    <img
                      v-if="usr.genre === 'masculino'"
                      src="../assets/man.png"
                      width="50"
                      style="opacity: 0.3"
                    />
                    <img v-else src="../assets/woman.png" width="50" style="opacity: 0.3" />

                    <h2 class="text-h5 mb-3">{{ usr.initials }}</h2>

                    <!-- registro -->
                    <p class="mb-1 text-medium-emphasis text-body-2">
                      {{ usr.register_num }}
                    </p>

                    <!-- etnia -->
                    <p class="mb-1 text-medium-emphasis text-body-2">
                      {{ usr.ethnicity }}
                    </p>

                    <!-- peso -->
                    <p class="mb-1 text-medium-emphasis text-body-2">
                      {{ usr.weight }}
                    </p>
                    <!-- altura -->
                    <p class="mb-1 text-medium-emphasis text-body-2">
                      {{ usr.height }}
                    </p>

                    <!-- genero -->
                    <p class="mb-1 text-medium-emphasis text-body-2">
                      {{ usr.gender }}
                    </p>

                    <!-- <v-divider class="mb-1"></v-divider> -->

                    <div class="text-end"></div>
                  </v-sheet>
                </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import axios from 'axios'
import LoadingComponent from '@/components/Loading.vue'

export default {
  components: {
    LoadingComponent
  },
  data() {
    return {
      APIbasePath: import.meta.env.VITE_API_URL,
      logoutDropdown: false,
      menu: 'fa-list',
      password: '',
      patients: [],
      loading: false
    }
  },
  methods: {
    toggleLogoutDropdown() {
      this.logoutDropdown = !this.logoutDropdown
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push(`/`)
    }
  },

  mounted() {
    this.loading = true
    // const patients = sessionStorage.getItem('patients')

    // if (patients) {
    //   debugger
    //   this.patients = JSON.parse(patients)
    //   return
    // }

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
        // sessionStorage.setItem('patients', response.data.patients)
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
