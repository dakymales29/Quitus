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
const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    await fetch(`${API_URL}/api/citas`) // o /health si tienes
  } catch (e) {
    // da igual si falla
  } finally {
    loading.value = false
  }
})
</script>