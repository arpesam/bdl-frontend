<!-- InputPanel.vue -->
<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title style="margin-left: 0;" :style="style">
        <v-sheet style="background-color: transparent;">
          <div class="mb-2" style="display: inline-block; width: 100%;">{{ title }}</div>
          <div style="font-size: 10px; font-style: italic;">{{ value?.length > 0 ? value : '' }}</div>
        </v-sheet>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    value: {
      type: [String, Boolean, Number, Object]
    }
  },
  data: () => ({}),
  computed: {
    style() {
      return {
        background: this?.value?.length > 0 ? '#ebf5ea' : ''
      }
    }
  }
};
</script>
