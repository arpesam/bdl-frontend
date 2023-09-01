<template>
  <v-container fluid class="fill-height">
    <Alert :successAlert="successAlert" :warningAlert="warningAlert" />
    <v-row v-if="loading">
      <v-col justify-center>
        <LoadingComponent :loading="loading" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="patients.length === 0" justify-center cols="12" sm="12">

        <v-timeline v-if="showWelcome" side="end" align="start" style="max-height: 400px;">
            <v-timeline-item dot-color="grey-lighten-4" size="small" >
              <template v-slot:opposite>
                <div :class="`pt-1 headline font-weight-bold text-grey-lighten-1`" v-text="'Olá'" ></div>
              </template>
                <div class="d-flex text-grey-lighten-1"> <strong class="me-4">Bem vindo!</strong> </div>
            </v-timeline-item>

            <v-timeline-item dot-color="grey-lighten-4" size="small" >
              <template v-slot:opposite>
                <div :class="`pt-1 headline font-weight-bold text-grey-lighten-1`" v-text="'Passo 1'" ></div>
              </template>
                <div class="d-flex text-grey-lighten-1"> <strong class="me-4">Cadastre-se</strong> </div>
            </v-timeline-item>

            <v-timeline-item dot-color="info" size="small" >
              <template v-slot:opposite>
                <div :class="`pt-1 headline font-weight-bold text-info`" v-text="'Passo 2'" ></div>
              </template>
                <div class="d-flex text-info"> <strong class="me-4">Cadastre o primeiro paciente</strong></div>
            </v-timeline-item>

            <v-timeline-item dot-color="teal-lighten-3" size="small" >
              <template v-slot:opposite>
                <div :class="`pt-1 headline font-weight-bold text-teal-lighten-3`" v-text="'Passo 3'" ></div>
              </template>
                <div class="d-flex text-teal-lighten-3"> <strong class="me-4">Cadastre os dados clinicos deles</strong> </div>
            </v-timeline-item>

            <v-timeline-item dot-color="teal-lighten-3" size="small" >
              <template v-slot:opposite>
                <div :class="`pt-1 headline font-weight-bold text-teal-lighten-3`" v-text="'Passo 4'" ></div>
              </template>
                <div class="d-flex text-teal-lighten-3"> <strong class="me-4">Uma sugestão de conduta será gerada</strong> </div>
            </v-timeline-item>
          </v-timeline>
          <div class="d-flex justify-center">
            <v-btn v-if="showWelcome" variant="outlined" color="info" @click="showWelcome=false">Entendi</v-btn>
          </div>

        <div v-if="!showWelcome" class="empty-message">
          Para cadastrar um paciente, clique em <br/> <RouterLink to="/register/patient">
      <v-btn icon="mdi-account-multiple-plus" variant="text" color="black" size="x-large"></v-btn>
    </RouterLink><br>Após isso você poderá registrar os dados clínicos do paciente e receber sugestões de conduta.
        </div>
      </v-col>
      <v-col
        v-else
        v-for="usr in patients"
        :key="usr.id"
        cols="12"
        xs="6"
        sm="6"
        md="3"
        lg="3"
        xl="4"
      >
        <PatientCard :patient="usr"  @deletePatient="removePatient(usr._id)" />
      </v-col>
    </v-row>
  </v-container>
<v-snackbar v-model="snackbar">
  {{ snackBarText }}

  <template v-slot:actions>
    <v-btn :color="snackbarColor" variant="text" @click="snackbar = false"> Fechar </v-btn>
  </template>
</v-snackbar>
</template>

<script>
import axios from 'axios'
import LoadingComponent from '@/components/Loading.vue'
import PatientCard from '@/components/PatientCard.vue'
import Alert from '@/components/Alert.vue'

import { mapActions, mapState, mapWritableState } from 'pinia'
import { usePatientStore } from '@/stores/patients'

export default {
components: {
  LoadingComponent,
  PatientCard,
  Alert
},
data() {
  return {
    showWelcome: true,
    setDetails: true,
    APIbasePath: import.meta.env.VITE_API_URL,
    logoutDropdown: false,
    menu: 'fa-list',
    password: '',
    loading: false,
    successAlert: '',
    warningAlert: '',
    snackbar: false,
    snackBarText: '',
    snackbarColor: 'green'
  }
},
computed: {
  ...mapState(usePatientStore, ['patients'])
},
methods: {
  details() {
    console.log("blue", );
    this.setDetails = false
  },
  toggleLogoutDropdown() {
    this.logoutDropdown = !this.logoutDropdown
  },
  goToEdit(patient) {
    localStorage.setItem(`${patient._id}`, JSON.stringify(patient))
    this.$router.push({
      name: 'exams-view',
      params: { id: patient._id }
    })
  },
  ...mapActions(usePatientStore, ['deletePatient']),
  async removePatient(ID) {
    this.warningAlert = ''
    this.successAlert = ''
    this.loading = true
    await this.deletePatient(ID).then(data => {
      this.loading = false
      this.snackbar = true
      this.snackBarText = 'Removido com sucesso'
    }).catch(err => {
        this.loading = false
        this.snackbarColor = 'orange'
        this.snackbar = true
        this.snackBarText = err?.response?.data?.message
    })
  }
},

async mounted() {
  this.loading = true
  const store = usePatientStore()
  let warningAlert;
  await store.fetchPatients().catch((err) => {
    warningAlert = err
  })
  this.warningAlert = warningAlert
  this.loading = false
}
}
</script>

<style>
.container {
color: #3d3d3d !important;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}
.empty-message {
text-align: center;
color: #3d3d3d;
}
</style>
