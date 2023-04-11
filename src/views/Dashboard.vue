<template>
  <v-card class="mx-auto">
    <v-layout>
      <v-app-bar color="blue" density="compact">
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Pacientes</v-app-bar-title>

        <template v-slot:append>
          <!-- <v-btn class="ma-2" icon="mdi-plus" style="background-color: blue;"></v-btn> -->
              <RouterLink to="/register/patient">
                <v-btn
                class="ma-2"
                color="white"
                variant="flat"
                >
                <v-icon
                start
                icon="mdi-plus"
                ></v-icon>
                Cadastrar
              </v-btn>
            </RouterLink>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid class="fill-height">
          <v-row>
            <v-col v-for="n in 8" :key="n" cols="12" xs="6" sm="6" md="3" lg="3" xl="4">
              <v-sheet color="grey-lighten-2" height="300"> </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      menu: 'fa-list',
      password: ''
    }
  },
  methods: {
    login() {
      // TODO: Implement login functionality
      console.log('Logging in with email', this.email, 'and password', this.password)
    },
    signup() {
      // TODO: Implement signup functionality
      console.log('Redirecting to signup page')
    }
  }
}
</script>

<style>
.container {
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
</style>
