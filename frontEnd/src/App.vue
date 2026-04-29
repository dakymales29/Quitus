<template>
  <!-- PRELOADER -->
  <Preloader v-if="loading" />

  <!-- APP -->
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Preloader from './components/preloader.vue'

const loading = ref(true)

onMounted(async () => {
  try {
    // aquí defines "cuando la app está lista"
    
    // ejemplo 1: esperar router (mínimo)
    await new Promise(resolve => requestAnimationFrame(resolve))

    // ejemplo 2 (MEJOR): esperar datos iniciales si tienes API global
    // await fetch(API_URL + "/health")

  } finally {
    loading.value = false
  }
})
</script>