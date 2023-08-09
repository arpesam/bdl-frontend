<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <!-- <div style="position: absolute;">
      <img src="./assets/login-background-img.png" alt="" srcset="" style="opacity: 0.3; object-fit: cover;">
    </div> -->
    <v-layout>
      <!-- NAVBAR -->
      <v-app-bar color="blue" density="compact" v-if="isLoggedIn && $route.name != 'Login' && $route.name != 'Cadastro'">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ $route.name }}</v-app-bar-title>
        <!-- <v-spacer></v-spacer> -->
        <template v-slot:append v-if="$route.name == 'Pacientes'">
          <RouterLink to="/register/patient" :user="user">
            <v-btn icon="mdi-account-multiple-plus" color="white" size="x-large"></v-btn>
          </RouterLink>
        </template>
        <template v-slot:append v-if="$route.name == 'Dados clínicos' || $route.name == 'Editar paciente' || $route.name == 'Add paciente' || $route.name == 'Minha conta'">
          <RouterLink to="/dashboard">
            <v-btn icon="mdi-arrow-left" color="white" size="x-large"></v-btn>
          </RouterLink>
        </template>
      </v-app-bar>

      <!-- SIDEBAR -->
      <v-navigation-drawer v-model="drawer" temporary v-if="isLoggedIn">
        <RouterLink style="text-decoration: none; color: black" to="/edit/doctor" >
          <v-list-item prepend-icon="mdi-account-box" title="Minha conta"></v-list-item>
        </RouterLink>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <RouterLink style="text-decoration: none; color: black" to="/dashboard" ><v-list-item prepend-icon="mdi-view-dashboard" title="Página inicial" value="home"></v-list-item></RouterLink>
          <v-list-item prepend-icon="mdi-forum" title="Sobre" value="about"></v-list-item>
          <v-list-item prepend-icon="mdi-logout" title="Sair" value="logout" @click="logoutAndClean"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- MAIN CONTENT -->
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
</template>


<script>
import { useUserStore } from '@/stores/user'
import { mapActions, mapState, mapWritableState } from 'pinia'
import LoginPage from '@/views/LoginView.vue'

export default {
  components: {
    LoginPage
  },
  data() {
    return {
      drawer: null,
    }
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    logoutAndClean() {
      localStorage.removeItem('token')
      this.$router.push(`/`)
      this.logout()
    }
  },
  computed: {
    ...mapWritableState(useUserStore, ["isLoggedIn"]),
    ...mapState(useUserStore, ['user'])
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      this.isLoggedIn = true
    }
  }
}
</script>
<style scoped>
</style>
