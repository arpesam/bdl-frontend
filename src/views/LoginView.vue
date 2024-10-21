<template>
  <v-container>
    <v-row no-gutters>
      <v-col align-self="center" class="d-flex flex-column justify-center align-center">
        <v-sheet class="d-flex flex-column justify-center align-center px-8 mt-6">
          <!-- <img src="../assets/logo-1.png" alt="" srcset="../assets/logo-1.png" style="width: 70px" /> -->
          <!-- <img src="../assets/logo-2.png" alt="" srcset="../assets/logo-2.png" style="width: 50px" /> -->
          <!-- <img src="../assets/logo-3.png" alt="" srcset="../assets/logo-3.png" style="width: 50px" /> -->
          <img src="../assets/logo-4.png" alt="" srcset="../assets/logo-4.png" style="width: 50px" />
          <h1 class="sitename">PeopAssist</h1>
          <p class="welcome">Olá, digite abaixo o seu e-mail e senha ou cadastre-se</p>
          <v-alert v-if="showAlert" title="Opps!" :text="error" type="warning"></v-alert>
          <br />
          <v-form v-model="isFormValid">
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
          </v-form>
          <v-btn
            variant="flat"
            style="color: white;"
            color="#038C8C"
            :disabled="btn.disabled"
            :loading="btn.loading"
            @click="login"
          >
            Entrar
          </v-btn>
          <RouterLink to="/register/doctor">
            <v-btn variant="flat" :disabled="btn.disabled" color="info">Criar conta </v-btn>
          </RouterLink>
          <a style="margin-top: 20px; color: grey;" href="https://api.whatsapp.com/send/?phone=5511941411913" target="_blank"><v-icon style="color: green;" icon="mdi-whatsapp"></v-icon> Fale conosco</a>

        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  data() {
    return {
      isFormValid: false,
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
  computed: {
    ...mapState(useUserStore, ['token'])
  },
  methods: {
    ...mapActions(useUserStore, ['setToken', 'setUser', 'login']),
    login() {
      if (!this.user.email || !this.user.password || !this.isFormValid) {
        this.error = 'Preencha todos os campos'
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
            this.btn.loading = false
            localStorage.setItem('token', response.data.token)
            this.setToken(response.data.token)
            this.setUser(response.data.user)
            console.log('setToken', this.token)
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
              this.showAlert = false
              this.error = ''
            }, 3000)
          } else {
            this.error = message || 'Algo deu errado, tente novamente'
          }
        })
    }
  }
}
</script>

<style>

.v-progress-linear__bar, .v-progress-linear__bar__determinate {
  transition: none;
}

.sitename {
  font-family: "Roboto", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 30px;
  font-weight: 400;
  color: #2c465e;
  letter-spacing: 0.05cap;
  margin: 0;
}

.welcome{
  font-family: "Roboto", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  margin: 0;
  /* font-size: 30px; */
  /* font-weight: 400; */
  color: #2c465e;
  letter-spacing: 0.05cap;
}

</style>
