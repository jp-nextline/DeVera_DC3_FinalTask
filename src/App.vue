<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>

  <NavBar />

  <main class="container" :class="{ wide: $route.name === 'schedule' }">
    <RouterView />
  </main>
  
</template>