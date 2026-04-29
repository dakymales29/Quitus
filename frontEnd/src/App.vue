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