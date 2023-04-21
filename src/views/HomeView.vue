<template>
  <div class="login-container">
    <img src="../assets/logo.png" alt="" srcset="../assets/logo.png" style="width: 70px" />
    <br />
    <v-alert v-if="showAlert" title="Opps!" :text="error" type="warning"></v-alert>
    <br />
    <v-text-field
      style="width: 250px"
      label="E-mail"
      :rules="rules.email"
      hide-details="auto"
      v-model="user.email"
    ></v-text-field>
    <br />
    <v-text-field
      style="width: 250px"
      label="Senha"
      type="password"
      :rules="rules.password"
      hide-details="auto"
      v-model="user.password"
    ></v-text-field>
    <br />
    <v-btn
      variant="flat"
      color="success"
      :disabled="btn.disabled"
      :loading="btn.loading"
      @click="login"
    >
      Entrar
    </v-btn>
    <RouterLink to="/register/doctor">
      <v-btn variant="flat" :disabled="btn.disabled" color="info">Cadastrar </v-btn>
    </RouterLink>
  </div>
</template>

<script>
import axios from 'axios'

// const APIbasePath = process.env.VUE_APP_API_BASEPATH

export default {
  data() {
    return {
      APIbasePath: import.meta.env.VITE_API_URL,
      user: {
        email: '',
        password: ''
      },
      btn: {
        loading: false,
        disabled: false
      },
      showAlert: false,
      rules: {
        email: [
          (v) => !!v || 'Preencha o seu e-mail ',
          (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido'
        ],
        password: [(v) => !!v || 'Preencha a sua senha']
      }
    }
  },
  methods: {
    login() {
      if (!this.user.email || !this.user.password) {
        this.error = "Preencha todos os campos"
        this.showAlert = true
        return
      }

      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false


      axios
        .post(`${this.APIbasePath}/login`, {
          ...this.user
        })
        .then((response) => {
          if (response.status == 200) {
            console.log('usuário cadastrado com sucesso', response)
            this.btn.loading = false
            localStorage.setItem('token', response.data.token)
            this.$router.push(`/dashboard`)
          }
        })
        .catch((err) => {
          console.log(err)
          this.showAlert = true
          this.btn.disabled = false
          this.btn.loading = false
          const message = err?.response?.data?.message
          if (message == 'Invalid email or password') {
            this.error = 'Email ou senha inválidos'
            setTimeout(() => {
              console.log('teste')
              this.showAlert = false
              this.error = ''
            }, 3000)
          } else {
            this.error = message || "Algo deu errado, tente novamente"
          }
        })
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
