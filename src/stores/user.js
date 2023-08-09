import { defineStore } from 'pinia'
import axios from 'axios'

const APIbasePath = import.meta.env.VITE_API_URL

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: '',
    user: {},
    isLoggedIn: false,
  }),
  persist: true,
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
  actions: {
    setToken(token) {
      console.log("trying to set token", );
      this.isLoggedIn = true
      this.token = token
    },
    setUser(user) {
      console.log("set user");
      this.user = user
      // fake a password to the user for text field purpose
      this.user.password = '123'
    },
    logout() {
      // console.log("trying to set token", );
      this.isLoggedIn = false
      this.user = {}
      this.token = ''
    },
    login: async () => {
      const response = await loginRequest(user)
      if (!response.user) {
        return response.error
      }
      this.token = response.token
      this.user = response.user
      console.log("user set", );
      return response
    },
  },
})

async function loginRequest(user) {
  if (!user.email || !user.password) {
    return new Error("preencha todos os dados")
  }

  console.log("loginRequest");

  return axios
    .post(`${APIbasePath}/login`, {
      ...user,
    })
    .then((response) => {
      if (response.status == 200) {
        return response.data
      }
    })
    .catch((err) => {
      console.log(err)
      const message = err?.response?.data?.message
      if (message == 'Invalid email or password') {
        return new Error('Email ou senha inválidos')
      } else {
        return new Error("Algo deu errado, tente novamente")
      }
    })

  }