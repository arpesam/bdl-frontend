<template>
  <div class="login-container">
    <img src="../assets/logo.png" alt="" srcset="../assets/logo.png" style="width: 70px" />
    <br />
    <v-alert v-if="showAlert" title="Opps, ocorreu um erro!" :text="error" type="warning"></v-alert>
    <v-alert v-if="showSuccess" title="Sucesso!" text="Usuário cadastrado com sucesso!" type="success"></v-alert>
    <br />
    <v-form v-model="isFormValid">
      <v-text-field
        style="width: 250px"
        label="Nome*"
        :rules="rules.name"
        hide-details="auto"
        v-model="user.name"
        required
      ></v-text-field>
      <br />
      <v-text-field
        style="width: 250px"
        label="Email*"
        :rules="rules.email"
        hide-details="auto"
        v-model="user.email"
        required
      ></v-text-field>
      <br />
      <v-text-field
        style="width: 250px"
        label="Reg. Profissional*"
        :rules="rules.professional_id"
        hide-details="auto"
        v-model="user.professional_id"
        required
      ></v-text-field>
      <br />
      <v-text-field
        style="width: 250px"
        label="Senha*"
        :rules="rules.password"
        hide-details="auto"
        type="password"
        v-model="user.password"
        required
      ></v-text-field>
      <br />

      <v-text-field
        style="width: 250px"
        label="Repita a senha"
        :rules="rules.confirmPassword"
        hide-details="auto"
        type="password"
        v-model="user.confirmPassword"
        required
      ></v-text-field>
      <br />
    </v-form>
    <v-btn
      variant="flat"
      color="info"
      @click="signup"
      :loading="btn.loading"
      :disabled="!enableBtn"
    >
      Enviar
    </v-btn>
    <RouterLink to="/">
      <v-btn variant="flat" color="default" icon="mdi-arrow-left"></v-btn>
    </RouterLink>
  </div>
</template>

<script>
import { findProp } from '@vue/compiler-core'
import axios from 'axios'

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        professional_id: '',
        password: '',
        confirmPassword: '',
      },
      btn: {
        loading: false,
        disabled: false
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      error: '',
      showAlert: false,
      showSuccess: false,
      isFormValid: false,
      rules: {
        email: [
          (value) => !!value || 'Preencha um email válido',
          (value) => /.+@.+\..+/.test(value) || 'Preencha um email válido'
        ],
        name: [
          (value) => !!value || 'Campo obrigatório',
        ],
        password: [
          (value) => !!value || 'Campo obrigatório',
        ],
        confirmPassword: [
          (value) => value === this.user.password || "As senhas estão diferentes"
        ],
        professional_id: [
          (value) => !!value || 'Campo obrigatório',
        ]
      }
    }
  },
  computed: {
    enableBtn() {

      return (
        !!this.user.email &&
        !!this.user.name &&
        !!this.user.professional_id &&
        !!this.user.confirmPassword &&
        !!this.user.password
      ) && this.isFormValid
    },
    passwordMatchRule() {
      return (value) => value === this.password || 'Passwords do not match';
    },
  },
  methods: {
    signup() {
      this.btn.loading = true
      this.btn.disabled = true
      this.showAlert = false
      delete this.user.confirmPassword
      axios
        .post(`${this.APIbasePath}/signup`, {
          ...this.user
        })
        .then((response) => {
          if (response.status == 201) {
            console.log('usuário cadastrado com sucesso', response)
            this.btn.loading = false
            this.showSuccess = true
            setTimeout(() => {
              this.$router.push(`/dashboard`)
            }, 1000);
            localStorage.setItem('token', response.data.token)
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
