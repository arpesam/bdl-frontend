      <!-- @click="$emit('cardClick', patient)" -->
<template>
    <v-sheet
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
      class="pa-4 text-center mx-auto"
      @click="hideDetails"
    >
      <img
        v-if="patient.genre === 'masculino'"
        src="../assets/man.png"
        width="50"
        style="opacity: 0.3"
      />
      <img v-else src="../assets/woman.png" width="50" style="opacity: 0.3" />

      <h2 class="text-h5 mb-3">{{ patient.initials }}</h2>

      <!-- registro -->
      <p class="mb-1 text-medium-emphasis text-body-2">
        {{ patient.register_num }}
      </p>

      <div v-if="showDetails">
        <!-- etnia -->
        <p class="mb-1 text-medium-emphasis text-body-2">
          {{ patient.ethnicity }}
        </p>

        <!-- peso -->
        <p class="mb-1 text-medium-emphasis text-body-2">
          {{ patient.weight }}
        </p>
        <!-- altura -->
        <p class="mb-1 text-medium-emphasis text-body-2">
          {{ patient.height }}
        </p>

        <!-- genero -->
        <p class="mb-1 text-medium-emphasis text-body-2">
          {{ patient.gender }}
        </p>
      </div>
      <div v-if="!showDetails">
          <v-btn color="red" @click="$emit('deletePatient', patient)" icon="mdi-trash-can-outline" class="mr-3" size="x-large"></v-btn>
          <v-btn color="blue" @click="goToPatientEdit" icon="mdi-pencil" class="mr-3" size="x-large"></v-btn>
          <v-btn color="green" @click="goToExams" icon="mdi-test-tube" class="ml-3" size="x-large"></v-btn>
      </div>
    </v-sheet>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      showDetails: true
    }
  },
  methods: {
    hideDetails(){
      this.showDetails = !this.showDetails
    },
    goToPatientEdit() {
      localStorage.setItem(`${this.patient._id}`, JSON.stringify(this.patient))
      this.$router.push({
        name: 'patient-edit',
        params: { id: this.patient._id}
      })
    },
    goToExams() {
      localStorage.setItem(`${this.patient._id}`, JSON.stringify(this.patient))
      this.$router.push({
        name: 'exams-view',
        params: { id: this.patient._id }
      })
    },
  }
}
</script>

<style></style>
