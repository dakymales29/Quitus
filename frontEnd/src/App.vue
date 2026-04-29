<template>
  <Preloader v-if="loading" />
  <router-view v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Preloader from './components/preloader.vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>