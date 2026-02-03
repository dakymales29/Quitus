<template>
  <section class="w-full">
    <!-- TÍTULO -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Titulares</h1>
      <p class="text-gray-500 text-sm">Personal encargado de los locales comerciales</p>
    </div>

    <!-- BOTÓN CREAR -->
    <button
      v-if="rol === 'super'"
      @click="nuevoTitularForm()"
      class="mt-4 mb-3 sm:mt-0 px-5 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
    >
      ➕ Nuevo titular
    </button>

    <!-- FORMULARIO CREAR / EDITAR -->
    <div v-if="mostrarFormulario" class="mb-10 bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-4 text-gray-800">
        {{ editando ? 'Editar titular' : 'Crear nuevo titular' }}
      </h2>

      <form @submit.prevent="editando ? actualizarTitular() : crearTitular()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input v-model="nuevoTitular.nombre" placeholder="Nombre del titular" class="input" required />
        <input v-model="nuevoTitular.apellido" placeholder="Apellido del titular" class="input" required />
        <input v-model="nuevoTitular.cedula" placeholder="Cédula del titular" class="input" required />
        <input v-model="nuevoTitular.correo" placeholder="Correo del titular" class="input" required />
        <input v-model="nuevoTitular.contacto" placeholder="Contacto del titular" class="input" required />

        <select v-model="nuevoTitular.tipo_titular" class="input" required>
          <option disabled value="">Tipo</option>
          <option>Propietario</option>
          <option>Arrendatario</option>
        </select>

        <input v-model="nuevoTitular.id_propietario" placeholder="ID propietario" class="input" required />

        <div class="sm:col-span-2 flex justify-end gap-3 mt-4">
          <button type="button" @click="cancelarFormulario()" class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">Cancelar</button>

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
      <div class="animate-pulse text-gray-500 text-lg">Cargando titulares...</div>
    </div>

    <!-- ERROR -->
    <div v-if="error" class="bg-red-100 text-red-600 p-4 rounded-xl text-center">{{ error }}</div>

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

  <select v-model="filtroTipo" class="input">
    <option value="">Todos los tipos</option>
    <option value="Propietario">Propietario</option>
    <option value="Arrendatario">Arrendatario</option>
  </select>
</div>

    <!-- GRID -->
    <div v-if="!cargando && !error" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="titular in titularesFiltrados" :key="titular.titular_id" class="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden">
        <!-- HEADER -->
        <div class="px-6 py-4 bg-indigo-50 border-b">
          <p class="text-xs text-indigo-400">TITULAR #{{ titular.titular_id }}</p>
          <h2 class="text-lg font-semibold text-gray-800">{{ titular.nombre }} {{ titular.apellido }}</h2>
        </div>

        <!-- BODY -->
        <div class="p-6 space-y-3 text-sm text-gray-600">
          <div class="flex items-center gap-2"><span>👤</span><span>{{ titular.cedula }}</span></div>
          <div class="flex items-center gap-2"><span>📧</span><span class="break-all">{{ titular.correo }}</span></div>
          <div class="flex items-center gap-2"><span>📞</span><span>{{ titular.contacto }}</span></div>
          <div class="flex items-center gap-2"><span>✅</span><span class="font-medium capitalize">{{ titular.tipo_titular }}</span></div>
          <div class="flex items-center gap-2"><span>🏠</span><span class="text-gray-500">Propietario ID: {{ titular.id_propietario }}</span></div>

          <!-- BOTONES -->
          <button
            v-if="rol === 'super' || rol === 'editor'"
            @click="editarTitular(titular)"
            class="mt-4 w-full px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
          >
            ✏️ Editar
          </button>

          <button
            v-if="rol === 'super'"
            @click="eliminarTitular(titular.titular_id)"
            class="mt-2 w-full px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
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
  name: "Titular",
  data() {
    return {
      // 🔎 FILTROS
    filtroNombre: "",
    filtroCedula: "",
    filtroTipo: "",

      rol: localStorage.getItem("rol"), // <-- rol del usuario
      titular: [],
      error: null,
      cargando: true,
      mostrarFormulario: false,
      editando: false,
      titularEditandoId: null,
      nuevoTitular: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        contacto: "",
        tipo_titular: "",
        id_propietario: "",
      },
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("token");
      const conexion = await fetch(`${import.meta.env.VITE_API_URL}/api/titular`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!conexion.ok) throw new Error();
      this.titular = await conexion.json();
    } catch {
      this.error = "Error al obtener titulares";
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    resetFormulario() {
      this.nuevoTitular = { nombre: "", apellido: "", cedula: "", correo: "", contacto: "", tipo_titular: "", id_propietario: "" };
    },
    nuevoTitularForm() { this.resetFormulario(); this.editando = false; this.mostrarFormulario = true; },
    cancelarFormulario() { this.resetFormulario(); this.editando = false; this.mostrarFormulario = false; },
    async crearTitular() {
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch(`${import.meta.env.VITE_API_URL}/api/titular`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(this.nuevoTitular),
        });
        if (!conexion.ok) throw new Error();
        const titularCreado = await conexion.json();
        this.titular.push(titularCreado);
        this.cancelarFormulario();
      } catch { alert("Error al crear titular"); }
    },
    editarTitular(titular) { this.mostrarFormulario = true; this.editando = true; this.titularEditandoId = titular.titular_id; this.nuevoTitular = { ...titular }; },
    async actualizarTitular() {
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch(`${import.meta.env.VITE_API_URL}/api/titular/${this.titularEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(this.nuevoTitular),
        });
        if (!conexion.ok) throw new Error();
        const titularActualizado = await conexion.json();
        const index = this.titular.findIndex(t => t.titular_id === this.titularEditandoId);
        this.titular[index] = titularActualizado;
        this.cancelarFormulario();
      } catch { alert("Error al actualizar titular"); }
    },
    async eliminarTitular(id) {
      if (!confirm("¿Seguro que deseas eliminar este titular?")) return;
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch(`${import.meta.env.VITE_API_URL}/api/titular/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!conexion.ok) throw new Error();
        this.titular = this.titular.filter(t => t.titular_id !== id);
      } catch { alert("No se pudo eliminar el titular (puede tener locales asociados)"); }
    }
  },
  computed: {
  titularesFiltrados() {
    return this.titular.filter(t => {
      const nombreCompleto = `${t.nombre} ${t.apellido}`.toLowerCase()

      const nombreMatch = nombreCompleto.includes(
        this.filtroNombre.toLowerCase()
      )

      const cedulaMatch = t.cedula
        .toLowerCase()
        .includes(this.filtroCedula.toLowerCase())

      const tipoMatch = this.filtroTipo
        ? t.tipo_titular === this.filtroTipo
        : true

      return nombreMatch && cedulaMatch && tipoMatch
    })
  }
},

};
</script>
