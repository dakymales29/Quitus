<template>
  <section class="w-full">

    <!-- TÍTULO -->
    <div class="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">
          Propietarios / Arrendatarios
        </h1>
        <p class="text-gray-500 text-sm">
          Gestión de datos personales y contacto
        </p>
      </div>
    </div>

    <!-- BOTÓN CREAR PROPIETARIO -->
    <button
      v-if="rol === 'super'"
      @click="nuevo()"
      class="mt-4 mb-3 sm:mt-0 px-5 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
    >
      ➕ Nuevo Propietario
    </button>

    <!-- FORMULARIO CREAR / EDITAR -->
    <div v-if="mostrarFormulario" class="mb-10 bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-4 text-gray-800">
        {{ editando ? 'Editar Propietario' : 'Crear nuevo Propietario' }}
      </h2>

      <form @submit.prevent="editando ? actualizarPropietario() : crearPropietario()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input v-model="nuevoPropietario.nombre" placeholder="Nombre del Propietario/Arrendatario" class="input" required />
        <input v-model="nuevoPropietario.apellido" placeholder="Apellido del Propietario/Arrendatario" class="input" required />
        <input v-model="nuevoPropietario.cedula" placeholder="Cédula del Propietario/Arrendatario" class="input" required />
        <input v-model="nuevoPropietario.correo" placeholder="Correo del Propietario/Arrendatario" class="input" required />
        <input v-model="nuevoPropietario.contacto" placeholder="Contacto Propietario/Arrendatario" class="input" required />

        <div class="sm:col-span-2 flex justify-end gap-3 mt-4">
          <button type="button" @click="cancelarFormulario" class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">
            Cancelar
          </button>

          <!-- BOTÓN GUARDAR -->
          <button
            type="submit"
            v-if="(!editando && rol === 'super') || (editando && (rol === 'super' || rol === 'editor'))"
            class="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>

    <!-- LOADING -->
    <div v-if="cargando" class="flex justify-center items-center py-24">
      <div class="animate-pulse text-gray-500 text-lg">Cargando propietarios...</div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="bg-red-100 text-red-600 p-4 rounded-xl text-center">
      {{ error }}
    </div>

    <!-- FILTROS -->
<div class="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow">
  <input
    v-model="filtroNombre"
    type="text"
    placeholder="🔍 Buscar por nombre o apellido"
    class="input"
  />

  <input
    v-model="filtroCedula"
    type="text"
    placeholder="🪪 Buscar por cédula"
    class="input"
  />

  <input
    v-model="filtroCorreo"
    type="text"
    placeholder="📧 Buscar por correo"
    class="input"
  />
</div>


    <!-- GRID -->
    <div v-if="!cargando && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="propietario in propietariosFiltrados" :key="propietario.id_propietario" class="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden">

        <!-- HEADER -->
        <div class="px-6 py-4 bg-gray-50 border-b">
          <p class="text-xs text-gray-400">ID #{{ propietario.id_propietario }}</p>
          <h2 class="text-lg font-semibold text-gray-800">{{ propietario.nombre }} {{ propietario.apellido }}</h2>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-3 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span class="text-gray-400">👤</span>
            <span>{{ propietario.cedula }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">📧</span>
            <span class="break-all">{{ propietario.correo }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-400">📞</span>
            <span>{{ propietario.contacto }}</span>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="px-6 pb-4 text-right">
          <!-- BOTÓN EDITAR: solo super o editor -->
          <button
            v-if="rol === 'super' || rol === 'editor'"
            @click="editarPropietario(propietario)"
            class="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600"
          >
            ✏️ Editar
          </button>

          <!-- BOTÓN ELIMINAR: solo super -->
          <button
            v-if="rol === 'super'"
            @click="eliminarPropietario(propietario.id_propietario)"
            class="w-full mt-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            🗑️ Eliminar
          </button>
        </div>

      </div>
    </div>

  </section>
</template>

<script>
export default {
  name: 'Propietarios',
  data() {
    return {
     
   // 🔎 FILTROS
    filtroNombre: "",
    filtroCedula: "",
    filtroCorreo: "",

      rol: localStorage.getItem('rol'), // <-- para saber rol del usuario
      propietarios: [],
      cargando: true,
      error: null,
      mostrarFormulario: false,
      nuevoPropietario: { nombre:"", apellido:"", cedula:"", correo:"", contacto:"" },
      editando: false,
      propietarioEditandoId: null
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token')
      const conexion = await fetch('http://localhost:3000/api/propietarios', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!conexion.ok) throw new Error()
      this.propietarios = await conexion.json()
    } catch (err) {
      this.error = 'Error al obtener propietarios'
    } finally {
      this.cargando = false
    }
  },
  methods: {
    async crearPropietario() {
      try {
        const token = localStorage.getItem("token")
        const conexion = await fetch("http://localhost:3000/api/propietarios",{
          method:'POST',
          headers:{
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify(this.nuevoPropietario),
        });
        if(!conexion.ok) throw new Error("Error al conectar a la API"); 
        const propietarioCreado = await conexion.json()
        this.propietarios.push(propietarioCreado)
        this.nuevoPropietario={ nombre:"", apellido:"", cedula:"", correo:"", contacto:"" }
        this.mostrarFormulario= false
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
    async actualizarPropietario() {
      try {
        const token = localStorage.getItem("token")
        const conexion = await fetch(`http://localhost:3000/api/propietarios/${this.propietarioEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(this.nuevoPropietario),
        })
        if (!conexion.ok) throw new Error("Error al actualizar")
        const propietarioActualizado = await conexion.json()
        const index = this.propietarios.findIndex(p => p.id_propietario === this.propietarioEditandoId)
        this.propietarios[index] = propietarioActualizado
        this.mostrarFormulario = false
        this.editando = false
        this.propietarioEditandoId = null
        this.nuevoPropietario = { nombre:"", apellido:"", cedula:"", correo:"", contacto:"" }
      } catch (err) {
        console.error(err)
        alert(err.message)
      }
    },
    cancelarFormulario() { this.mostrarFormulario=false; this.editando=false; this.propietarioEditandoId=null },
    editarPropietario(propietario) {
      this.nuevoPropietario = { ...propietario }
      this.propietarioEditandoId = propietario.id_propietario
      this.editando = true
      this.mostrarFormulario = true
    },
    resetFormulario() { this.nuevoPropietario={ nombre:"", apellido:"", cedula:"", correo:"", contacto:"" } },
    nuevo() { this.resetFormulario(); this.editando=false; this.propietarioEditandoId=null; this.mostrarFormulario=true },
    async eliminarPropietario(id) {
      if (!confirm("¿Seguro que deseas eliminar este propietario?")) return
      try {
        const token = localStorage.getItem("token")
        const conexion = await fetch(`http://localhost:3000/api/propietarios/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
        if (!conexion.ok) throw new Error("Error al eliminar")
        this.propietarios = this.propietarios.filter(p => p.id_propietario !== id)
      } catch (err) {
        console.error(err)
        alert("No se pudo eliminar el propietario")
      }
    }
  },
  computed: {
  propietariosFiltrados() {
    return this.propietarios.filter(p => {
      const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase()

      const nombreMatch = nombreCompleto.includes(
        this.filtroNombre.toLowerCase()
      )

      const cedulaMatch = p.cedula
        .toLowerCase()
        .includes(this.filtroCedula.toLowerCase())

      const correoMatch = p.correo
        .toLowerCase()
        .includes(this.filtroCorreo.toLowerCase())

      return nombreMatch && cedulaMatch && correoMatch
    })
  }
},

}
</script>
