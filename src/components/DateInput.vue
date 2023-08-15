<template>
  <v-text-field
    v-maska:[options]
    @change="$emit('input')"
    :value="value"
    :rules="rules"
    :placeholder="placeholder"
    :label="label"
  />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Data de nascimento',
      required: false
    },
    placeholder: {
      type: String,
      default: 'dd/mm/aaaa',
      required: false
    },
    rules: {
      type: Object,
      default: [],
      required: false
    },
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    options: { mask: '##/##/####' },
    date: ''
  }),
  methods: {
    emit(vv) {
      console.log('vv', vv)
    }
  }
}
</script>

<style scoped></style>
