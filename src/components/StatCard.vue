<script setup>

defineProps({
  label: String,
  value: Number,
})

</script>

<template>

  <div class="stat-card">

    <h3>{{ value }}</h3>
    <p>{{ label }}</p>

  </div>
  
</template>