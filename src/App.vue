<script setup>
import {  RouterView } from 'vue-router'
import  TheHeader from './components/TheHeader.vue'
import  TheFooter from './components/TheFooter.vue'
</script>

<template>
  <TheHeader />
  <header>
    <nav>
    </nav>
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
