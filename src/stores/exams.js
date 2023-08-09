import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user'

const APIbasePath = import.meta.env.VITE_API_URL

export const useExamStore = defineStore('examStore', {
  state: () => ({
    userClickedInSave: false,
  }),
  persist: true,
  getters: {
    getPatientByID: (state) => (id) => {
      return state.patients.find((pt) => pt._id === id);
    },
  },
  actions: {
    hasSaved(v) {
      this.userClickedInSave = v
    }
  },
})
