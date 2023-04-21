<template>
  <v-date-picker
    v-model="selectedDate"
    :min="minDate"
    :max="maxDate"
    color="primary"
    :landscape="landscape"
    :disabled="disabled"
    :readonly="readonly"
    :full-width="fullWidth"
    :no-title="noTitle"
    :picker-date.sync="pickerDate"
    @input="emitInput"
  ></v-date-picker>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    value: {
      type: String,
      required: true
    },
    min: {
      type: String,
      default: null
    },
    max: {
      type: String,
      default: null
    },
    landscape: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    noTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedDate: this.value,
      pickerDate: this.value
    };
  },
  computed: {
    minDate() {
      return this.min ? new Date(this.min) : null;
    },
    maxDate() {
      return this.max ? new Date(this.max) : null;
    }
  },
  methods: {
    emitInput() {
      this.$emit('input', this.selectedDate);
    }
  }
};
</script>
