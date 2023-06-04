<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

    <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
  .main {
    height: 100vh;
  }

</style>
