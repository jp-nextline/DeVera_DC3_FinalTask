<script setup>

defineProps({
  title: String,
  subtitle: String,
})

</script>

<template>

  <header class="page-header">

    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>

  </header>
</template>