<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { useCerealStore } from '@/stores/cerealStore' // Adjust path as needed
import { onMounted } from 'vue'

const cerealStore = useCerealStore()

onMounted(async () => {
  // Check token expiration when the app component is mounted
  // This handles the case where a token exists in localStorage from a previous session
  if (cerealStore.authToken) {
    cerealStore.checkTokenExpiration()
  }
  await cerealStore.initializeAuth()
})
</script>

<template>
  <TheHeader />
  <header>
    <nav></nav>
  </header>
  <main>
    <RouterView />
  </main>
  <TheFooter />
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the footer stays at the bottom */
  padding-top: 3rem;
}
</style>
