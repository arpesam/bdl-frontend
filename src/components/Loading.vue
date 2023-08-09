<template>
  <div v-if="loading" class="loading-overlay" >
    <div class="loading-spinner" :style="style"></div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    height: {
      type: String,
      default: '100px'
    },
    width: {
      type: String,
      default: '100px'
    }
  },
  computed: {
    style() {
      return {
        height: this.height || '100px',
        width: this.width || '100px',
      }
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 10px solid rgba(0, 38, 80, 0.3);
  border-top: 10px solid #6492f6;
  border-radius: 50%;
  /* width: 100px;
  height: 100px; */
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
