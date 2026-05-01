<template>
  <Preloader :visible="loading" />
  <router-view v-if="!loading" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Preloader from './components/preloader.vue'

const API_URL = import.meta.env.VITE_API_URL
const loading = ref(true)

onMounted(async () => {
  try {
    await fetch(`${API_URL}/api/health`)
  } catch (e) {
    // no importa si falla
  } finally {
    loading.value = false
  }
})
</script>