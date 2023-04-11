<template>
  <div class="login-container">
    <img src="../assets/logo.png" alt="" srcset="../assets/logo.png" style="width: 70px" />
    <br />
    <v-text-field
      style="width: 250px"
      label="email"
      :rules="rules"
      hide-details="auto"
    ></v-text-field>
    <br />
    <v-text-field
      style="width: 250px"
      label="senha"
      :rules="rules"
      hide-details="auto"
    ></v-text-field>
    <br />
    <RouterLink to="dashboard">
      <v-btn variant="flat" color="success"> Entrar </v-btn>
    </RouterLink>
    <RouterLink to="/register/doctor">
      <v-btn variant="flat" color="info">Cadastrar </v-btn>
    </RouterLink>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
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
