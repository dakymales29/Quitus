<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">

    <!-- SIDEBAR -->
    <aside
      class="w-full md:w-64
             bg-gradient-to-b from-indigo-600 to-purple-700
             text-white flex md:flex-col"
    >

      <!-- HEADER -->
      <div class="p-4 md:p-6 text-center border-b border-white/20">
        <h2 class="text-lg md:text-xl font-bold">ADMINISTRACIÓN</h2>
        <p class="text-xs md:text-sm opacity-80">Centro Comercial Quitus</p>
        <p class="mt-2 text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
          Rol: {{ rol }}
        </p>
      </div>

      <!-- NAV -->
      <nav
        class="flex md:flex-col
               flex-row gap-2
               overflow-x-auto md:overflow-visible
               p-3 md:p-4 flex-1"
      >

        <!-- SUPER: todo -->
        <template v-if="rol === 'super'">
          <button class="btn whitespace-nowrap" @click="mostrarComponente('locales')">🏬 Locales</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('propietarios')">👤 Propietarios</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('titulares')">📄 Titulares</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('usuarios')">🔐 Usuarios</button>
        </template>

        <!-- EDITOR: todo menos usuarios -->
        <template v-if="rol === 'editor'">
          <button class="btn whitespace-nowrap" @click="mostrarComponente('locales')">🏬 Locales</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('propietarios')">👤 Propietarios</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('titulares')">📄 Titulares</button>
        </template>

        <!-- INVITADO: solo ver, todo menos usuarios -->
        <template v-if="rol === 'invitado'">
          <button class="btn whitespace-nowrap" @click="mostrarComponente('locales')">🏬 Locales</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('propietarios')">👤 Propietarios</button>
          <button class="btn whitespace-nowrap" @click="mostrarComponente('titulares')">📄 Titulares</button>
        </template>

      </nav>

      <!-- LOGOUT -->
      <div class="p-3 md:p-4 border-t border-white/20">
        <button
          @click="logout"
          class="w-full bg-red-500 hover:bg-red-600 transition
                 text-white py-2 rounded-xl font-semibold text-sm md:text-base"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- CONTENIDO -->
    <main class="flex-1 p-4 md:p-8">
      <div class="bg-white rounded-2xl shadow p-4 md:p-6 min-h-[70vh]">
        <component :is="componenteActivo" />
      </div>
    </main>

  </div>
</template>

<script>
import Locales from './locales.vue'
import Propietarios from './propietarios.vue'
import Titulares from './titular.vue'
import Usuarios from './usuario.vue'

export default {
  components: {
    Locales,
    Propietarios,
    Titulares,
    Usuarios
  },
  data() {
    return {
      rol: localStorage.getItem('rol'),
      componenteActivo: 'Locales'
    }
  },
  methods: {
    mostrarComponente(nombre) {
      // Si es invitado o editor y quiere usuarios, lo bloqueamos
      if ((this.rol === 'editor' || this.rol === 'invitado') && nombre === 'usuarios') {
        alert('No tienes permiso para acceder a esta sección.')
        return
      }
      this.componenteActivo =
        nombre.charAt(0).toUpperCase() + nombre.slice(1)
    },
    logout() {
      localStorage.clear()
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
.btn {
  @apply w-full flex items-center gap-3 px-4 py-2 rounded-xl
         bg-white/10 hover:bg-white/20 transition text-left font-medium;
}
</style>
