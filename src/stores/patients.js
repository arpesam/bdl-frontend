import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const APIbasePath = import.meta.env.VITE_API_URL

export const usePatientStore = defineStore('patientStore', {
  state: () => ({
    patients: []
  }),
  getters: {
    getPatientByID: (state) => (id) => {
      return state.patients.find((pt) => pt._id === id);
    },
  },
  actions: {
    async fetchPatients() {
      const response = await fetchPatients()
      this.patients = response.patients
      return this.patients
    },
    async deletePatient(ID) {
      const resp = await deletePatient(ID)

      if (resp === true) {
        const idx = this.patients.findIndex((pt) => pt._id === ID);

        if (idx !== -1) {
          this.patients.splice(idx, 1);
        }
        return
      }
      return resp
    }
  },
})

async function fetchPatients() {
  return axios
    .get(`${APIbasePath}/patient`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
    .then((response) => {
      // debugger
      return response.data
    })
    .catch((err) => {
      // debugger
      if (err?.response?.status == 401) {
        return new Error("Sua sessão expirou, entre novamente")
      }
      return new Error("Algo deu errado: ", err)
    })
  }


  async function deletePatient(ID) {
    return axios
      .delete(`${APIbasePath}/patient/${ID}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((response) => {
        if (response.status == 200) {
          return true
        }
      })
      .catch((err) => {
        return err
      })
  }