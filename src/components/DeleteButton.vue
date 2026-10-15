<script setup>

const emit = defineEmits(['confirmed'])

function askFirst() {
  if (confirm('Are you sure you want to delete this?')) {
    emit('confirmed')
  }
}

</script>

<template>

  <button class="btn btn-danger" @click="askFirst">Delete</button>
  
</template>