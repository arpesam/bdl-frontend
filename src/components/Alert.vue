<template>
  <v-alert
    v-if="warningAlert"
    title="Opps, ocorreu um erro!"
    :text="warningAlert"
    type="warning"
  ></v-alert>
  <v-alert
    v-if="successAlert"
    title="Sucesso!"
    :text="successAlert"
    type="success"
  ></v-alert>
</template>

<script>
export default {
  props: {
    successAlert:  {
      type: String,
      required: false
    },
    warningAlert:  {
      type: String,
      required: false
    }
  }
}
</script>

<style></style>
