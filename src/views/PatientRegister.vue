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
          <v-sheet class="d-flex flex-column align-center justify-center text-center">
            <br />
            <v-text-field
              style="width: 250px"
              label="Iniciais"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <br />
            <v-text-field
              style="width: 250px"
              label="Núm. de registro"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <br />
            <v-text-field
              style="width: 250px"
              label="Data de nascimento"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <br />
            <v-text-field
              style="width: 250px"
              label="Peso"
              :rules="rules"
              hide-details="auto"
            ></v-text-field>
            <br />
            <v-select
            :items="items"
            label="Etnia"
            style="width: 250px"
            ></v-select>
            <br />
            <v-radio-group v-model="inline" inline>
              <v-radio label="Masculino" value="radio-1"></v-radio>
              <v-radio label="Feminino" value="radio-2"></v-radio>
            </v-radio-group>
            <v-btn variant="flat" color="info"> Cadastrar </v-btn>
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
export default {
  data() {
    return {
      email: '',
      password: '',
      inline: '',
      items: ['Branco', 'Preto', 'Pardo', 'Amarelo']
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
