<template>
  <!-- PRELOADER -->
  <Preloader :visible="loading" />

  <!-- APP -->
  <div v-if="!loading">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Preloader from './components/preloader.vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>