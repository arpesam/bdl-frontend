<template>
  <v-container>
    <v-row no-gutters>
      <v-col align-self="center">
        <v-sheet class="d-flex flex-column justify-center align-center">
          <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
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
              label="Reg. Profissional (CRM)*"
              :rules="rules.professional_id"
              hide-details="auto"
              v-model="user.professional_id"
              required
            ></v-text-field>
            <br />

            <div class="d-flex">
              <v-text-field
                style="width: 150px"
                :label="disabledPswd ? 'Senha' : 'Nova senha'"
                :rules="rules.password"
                hide-details="auto"
                type="password"
                v-model="user.password"
                :disabled="disabledPswd"
                required
              ></v-text-field>

              <v-btn icon="mdi-pencil" variant="text" color="info" @click="disablePswd"> </v-btn>
            </div>
            <br />

            <v-text-field
              v-if="!disabledPswd"
              style="width: 250px"
              label="Repita a senha"
              :rules="rules.confirmPassword"
              hide-details="auto"
              type="password"
              v-model="user.confirmPassword"
              required
            ></v-text-field>
          </v-form>

          <v-btn
            variant="flat"
            color="info"
            @click="signup"
            :loading="btn.loading"
            :disabled="!enableBtn"
          >
            Atualizar
          </v-btn>
          <RouterLink to="/dashboard">
            <v-btn variant="text">Voltar</v-btn>
          </RouterLink>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import Alert from '@/components/Alert.vue'
import { useUserStore } from '@/stores/user'
import { mapActions, mapState, mapWritableState } from 'pinia'

export default {
  components: {
    Alert
  },
  data() {
    return {
      disabledPswd: true,
      btn: {
        loading: false,
        disabled: false
      },
      APIbasePath: import.meta.env.VITE_API_URL,
      warningAlert: '',
      successAlert: '',
      isFormValid: false,
      rules: {
        email: [
          (value) => !!value || 'Preencha um email válido',
          (value) => /.+@.+\..+/.test(value) || 'Preencha um email válido'
        ],
        name: [(value) => !!value || 'Campo obrigatório'],
        // password: [(value) => ((!this.disabledPswd && !!value) || this.disabledPswd)|| 'Campo obrigatório'],
        confirmPassword: [(value) => value === this.user.password || 'As senhas estão diferentes'],
        professional_id: [(value) => !!value || 'Campo obrigatório']
      }
    }
  },
  computed: {
    ...mapWritableState(useUserStore, ['user']),
    enableBtn() {
      console.log('----', this.disabledPswd)
      if (this.disabledPswd) {
        return !!this.user.email && !!this.user.name && !!this.user.professional_id
      } else {
        return (
          !!this.user.email &&
          !!this.user.name &&
          !!this.user.professional_id &&
          !!this.user.confirmPassword &&
          !!this.user.password &&
          this.isFormValid &&
          this.user.confirmPassword == this.user.password
        )
      }
    },
    passwordMatchRule() {
      return (value) => value === this.password || 'Passwords do not match'
    }
  },
  methods: {
    disablePswd() {
      this.disabledPswd = !this.disabledPswd
      if (this.disablePswd) {
        console.log('delete')
        this.user.password = ''
      }
    },
    signup() {
      this.btn.loading = true
      this.btn.disabled = true
      this.warningAlert = ''
      this.successAlert = ''
      delete this.user.confirmPassword
      axios
        .put(
          `${this.APIbasePath}/doctor/${this.user._id}`,
          {
            ...this.user
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
            this.successAlert = 'Dados atualizados com sucesso!'
            this.disabledPswd = true
            // setTimeout(() => {
            //   this.$router.push(`/dashboard`)
            // }, 1000)
            // localStorage.setItem('token', response.data.token)
          }
        })
        .catch((err) => {
          console.log(err)
          this.warningAlert = err?.response?.data?.message
          this.btn.disabled = false
          this.btn.loading = false
        })
    }
  }
}
</script>

<style scoped>
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
