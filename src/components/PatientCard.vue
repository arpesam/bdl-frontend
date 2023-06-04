<template>
    <v-sheet
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
      class="pa-4 text-center mx-auto"
      @click="$emit('cardClick', patient)"
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

      <!-- <v-divider class="mb-1"></v-divider> -->

      <div class="text-end"></div>
    </v-sheet>
</template>

<script>
export default {
  props: {
    patient: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
