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
        <!-- <template v-slot:activator="{ on }"> -->
          <!-- Use a custom icon for the dropdown menu -->
          <!-- <v-icon v-bind="on">mdi-dots-vertical</v-icon> -->
        <!-- </template> -->

        <!-- Add your logout options in the dropdown menu -->
        <v-list>
          <v-list-item @click="logout">
            <!-- <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon> -->
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-main>
        <v-container fluid class="fill-height">
          <v-row>
            <v-col v-for="usr in users" :key="usr.id" cols="12" xs="6" sm="6" md="3" lg="3" xl="4">
              <v-sheet
                elevation="12"
                max-width="600"
                rounded="lg"
                width="100%"
                class="pa-4 text-center mx-auto"
              >

                <img v-if="usr.gender === 'Masculino'" src="../assets/man.png" width="50" style="opacity: 0.3;">
                <img v-else src="../assets/woman.png" width="50" style="opacity: 0.3;">

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

                <v-divider class="mb-1"></v-divider>

                <div class="text-end">
                </div>
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

export default {
  data() {
    return {
      logoutDropdown: false,
      menu: 'fa-list',
      password: '',
      users: []
    }
  },
  methods: {
    toggleLogoutDropdown() {
      this.logoutDropdown = !this.logoutDropdown;
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push(`/`)
    }
  },

  mounted() {
    axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
      // Iniciais
      // Num. registro
      // Nascimento
      // Sexo
      // Peso
      // Altura
      // Etnia
      response.data.forEach((element, idx) => {
        element.initials = (element.name[0] + element.name[1] + element.name[4] + element.name[5]).toUpperCase()
        element.register_num = "012345"
        element.height = "1,70"
        element.weight = "65"
        element.ethnicity = "Amarela"

        console.log(idx);
        if (idx > 0 && response.data[idx-1].gender == "Masculino") {
          element.gender = "Feminino"
        } else {
          element.gender = "Masculino"
        }
      });
      console.log(response.data)
      this.users = response.data
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
</style>
