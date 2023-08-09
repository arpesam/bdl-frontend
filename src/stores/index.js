import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const APIbasePath = import.meta.env.VITE_API_URL

export const useLoginStore = defineStore('loginStore', () => {
  const isLogged = ref(false)
  const loggedUser = ref(null)
  const token = ref(null)

  async function login(user) {
    const response = await loginRequest(user)
    if (!response.user) {
      return response.error
    }
    isLogged.value = true
    loggedUser.value = response.user
    token.value = response.token
    return response
  }

  return { isLogged, loggedUser, token, login }
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