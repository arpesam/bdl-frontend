<template>
  <div class="login-container">
    Test page
    <!-- <datepicker></datepicker> -->
    <!-- <datepicker :value="date"></datepicker>
    <VueDatePicker v-model="date"></VueDatePicker> -->
    <VueDatePicker v-model="date" hide-offset-dates range :year-range="[2020, 2024]"></VueDatePicker>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'

const date = ref();

export default {
  components: {
    Datepicker,
    VueDatePicker
  },
  data() {
    return {
        date: ref()
    }
  },
  mounted: () => {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    date.value = [startDate, endDate];
  },
  methods: {

  }
}
</script>

<style>
.login-container {
  color: #3d3d3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  width: 150px;
}

.login-button {
  background-color: #28a745;
}

.signup-button {
  background-color: #007bff;
}
</style>
