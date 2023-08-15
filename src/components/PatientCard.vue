<!-- @click="$emit('cardClick', patient)" -->
<template>
  <v-sheet
    elevation="6"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 text-center mx-auto"
    @click="hideDetails"
  >
    <div v-if="!showDetails" class="trash-btn">
      <v-btn
        @click="$emit('deletePatient', patient)"
        icon="mdi-trash-can-outline"
        style="margin: 0"
        elevation="0"
      ></v-btn>
    </div>
    <img
      v-if="patient.genre === 'masculino'"
      src="../assets/man.png"
      width="50"
      style="opacity: 0.3"
    />
    <img v-else src="../assets/woman.png" width="50" style="opacity: 0.3" />

    <h2 class="text-h5 mb-3">{{ patient.initials }}</h2>

    <!-- registro -->

    <div class="d-flex flex-row justify-center align-center mb-2 pl-3">
      <p class="text-disabled text-body-2">
        <v-icon icon="mdi-list-box-outline"></v-icon> {{ patient.register_num }}
      </p>
      <p class="text-disabled text-body-2">
        <v-icon icon="mdi-baby-face-outline"></v-icon> {{ patient.birth_date }}
      </p>
      <!-- etnia -->
      <p class="text-disabled text-body-2">
        <v-icon icon="mdi-account-group"></v-icon> {{ patient.ethnicity }}
      </p>

      <!-- peso -->
      <p class="text-disabled text-body-2">
        <v-icon icon="mdi-weight"></v-icon> {{ patient.weight }}
      </p>
      <!-- altura -->
      <p class="text-disabled text-body-2">
        <v-icon icon="mdi-human-male-height-variant"></v-icon> {{ patient.height }}
      </p>

      <!-- genero -->
      <p class="text-disabled text-body-2">
        {{ patient.gender }}
      </p>
    </div>

    <div v-if="!showDetails" class="mb-7">
      <v-btn
        prepend-icon="mdi-pencil"
        variant="tonal"
        size="large"
        color="blue"
        @click="goToPatientEdit"
        density="comfortable"
        style="width: 200px"
        >Editar</v-btn
      >
      <v-btn
        prepend-icon="mdi-plus"
        variant="tonal"
        size="large"
        color="green"
        @click="dialog = true"
        density="comfortable"
        style="width: 200px"
        >Dados clinicos</v-btn
      >
    </div>

    <v-row justify="center">
      <v-dialog v-model="dialog" width="800">
        <v-card>
          <v-card-title>
            <span class="text-h5">Sobre os dados clínicos</span>
          </v-card-title>
          <v-card-text>
            O fornecimento dos dados clínicos de forma adequada é fundamental para análise das informações e sugestão de conduta. Este sistema não substitui a avaliação médica e que o objetivo é auxiliar o profissional a tomar uma melhor decisão.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green-darken-1" variant="text" @click="goToExams">
              Entendi
            </v-btn>
            <!-- <v-btn color="green-darken-1" variant="text" @click="dialog = false">
              Cancelar
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      showDetails: true
    }
  },
  methods: {
    hideDetails() {
      this.showDetails = !this.showDetails
    },
    goToPatientEdit() {
      localStorage.setItem(`${this.patient._id}`, JSON.stringify(this.patient))
      this.$router.push({
        name: 'Editar paciente',
        params: { id: this.patient._id }
      })
    },
    goToExams() {
      localStorage.setItem(`${this.patient._id}`, JSON.stringify(this.patient))
      this.$router.push({
        name: 'Dados clínicos',
        params: { id: this.patient._id }
      })
    }
  }
}
</script>

<style>
.trash-btn {
  text-align: left;
  margin: 0;
  padding: 0;
  /* border: 1px solid red; */
}
</style>
