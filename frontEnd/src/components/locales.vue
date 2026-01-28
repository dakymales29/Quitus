<template>
  <section class="w-full">
    <!-- TÍTULO -->
    <div class="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Locales</h1>
        <p class="text-gray-500 text-sm">Administración general de locales del centro comercial</p>
      </div>
    </div>

    <!-- BOTÓN CREAR LOCAL (solo super) -->
    <button
      v-if="rol === 'super'"
      @click="nuevoLocalForm()"
      class="mt-4 mb-3 sm:mt-0 px-5 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
    >
      ➕ Nuevo Local
    </button>

    <!-- FORMULARIO CREAR LOCAL -->
<div v-if="mostrarFormulario" class="mb-10 bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto">
  <h2 class="text-xl font-bold mb-4 text-gray-800">
    {{ editando ? 'Editar local' : 'Crear nuevo local' }}
  </h2>

  <form @submit.prevent="editando ? actualizarLocal() : crearLocal()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input v-model="nuevoLocal.nombre_local" placeholder="Nombre del local" class="input" required />
    <input v-model="nuevoLocal.giro_negocio" placeholder="Giro de negocio" class="input" required />
    <input v-model="nuevoLocal.dimensiones" placeholder="Dimensiones" class="input" required />

    <select v-model="nuevoLocal.estado" class="input" required>
      <option disabled value="">Estado</option>
      <option>Ocupado</option>
      <option>Desocupado</option>
      <option>Bodega</option>
    </select>

    <input v-model="nuevoLocal.titular_id" placeholder="Titular ID" class="input" required />

    <div class="sm:col-span-2 flex justify-end gap-3 mt-4">
      <button type="button" @click="cancelarFormulario()" class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">
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
      <div class="animate-pulse text-gray-500 text-lg">Cargando locales...</div>
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
    placeholder="🔍 Buscar por nombre"
    class="input"
  />

  <input
    v-model="filtroGiro"
    type="text"
    placeholder="🏷️ Buscar por giro"
    class="input"
  />

  <select v-model="filtroEstado" class="input">
    <option value="">Todos los estados</option>
    <option>Ocupado</option>
    <option>Desocupado</option>
    <option>Bodega</option>
  </select>
</div>


    <!-- GRID -->
    <div v-if="!cargando && !error" class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="local in localesFiltrados" :key="local.local_id"" class="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden">
        <!-- BANDA DE ESTADO -->
        <div class="h-2"
          :class="local.estado === 'Ocupado'
            ? 'bg-gradient-to-r from-red-500 to-rose-600'
            : local.estado === 'Desocupado'
            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
            : local.estado === 'Bodega'
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
            : 'bg-gray-300'">
        </div>

        <!-- CONTENIDO -->
        <div class="p-5 flex flex-col justify-between h-full">
          <!-- HEADER -->
          <div class="mb-4">
            <span class="text-xs text-gray-400">Local #{{ local.local_id }}</span>
            <h2 class="text-lg font-semibold text-gray-800 mt-1">{{ local.nombre_local }}</h2>
            <p class="text-sm text-indigo-600 font-medium mt-1">{{ local.giro_negocio }}</p>
          </div>

          <!-- INFO -->
          <div class="space-y-3 text-sm text-gray-600">
            <p class="flex items-center justify-between">
              <span class="font-medium">Estado</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                :class="local.estado === 'Ocupado'
                  ? 'bg-red-100 text-red-600'
                  : local.estado === 'Desocupado'
                  ? 'bg-green-100 text-green-600'
                  : local.estado === 'Bodega'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-500'">
                {{ local.estado }}
              </span>
            </p>
            <p class="flex items-center justify-between"><span class="font-medium">Dimensiones</span><span>{{ local.dimensiones }}</span></p>
            <p class="flex items-center justify-between"><span class="font-medium">Titular</span><span>{{ local.titular_id }}</span></p>
          </div>

          <!-- FOOTER -->
          <div class="mt-6 pt-4 border-t text-right">
            <span class="text-xs text-gray-400">Información del local</span>

            <!-- EDITAR: super y editor -->
            <button
              v-if="rol === 'super' || rol === 'editor'"
              @click="editarLocal(local)"
              class="mt-3 w-full px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600">
              ✏️ Editar
            </button>

            <!-- ELIMINAR: solo super -->
            <button
              v-if="rol === 'super'"
              @click="eliminarLocal(local.local_id)"
              class="mt-2 w-full px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Locales",
  data() {
    return {
      //filtros
       // 🔎 FILTROS
    filtroNombre: "",
    filtroGiro: "",
    filtroEstado: "",

      rol: localStorage.getItem("rol"), // <-- rol agregado
      locales: [],
      cargando: true,
      error: null,
      mostrarFormulario: false,
      nuevoLocal: {
        nombre_local: "",
        giro_negocio: "",
        estado: "",
        dimensiones: "",
        user_id:1,
        titular_id: ""
      },
      editando:false,
      localEditandoId:null
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem("token");
      const conexion = await fetch("http://localhost:3000/api/locales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!conexion.ok) throw new Error();
      this.locales = await conexion.json();
    } catch (e) {
      this.error = "ERROR AL OBTENER LOS LOCALES";
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    resetFormulario() {
      this.nuevoLocal = {
        nombre_local: "",
        giro_negocio: "",
        estado: "",
        dimensiones: "",
        user_id: 1,
        titular_id: ""
      }
    },
    nuevoLocalForm() {
      this.resetFormulario();
      this.editando = false;
      this.localEditandoId = null;
      this.mostrarFormulario = true;
    },
    cancelarFormulario() {
      this.resetFormulario();
      this.mostrarFormulario = false;
      this.editando = false;
      this.localEditandoId = null;
    },
    async crearLocal() {
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch("http://localhost:3000/api/locales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.nuevoLocal),
        });
        if (!conexion.ok) throw new Error("Error al conectar a la API");
        const localCreado = await conexion.json();
        this.locales.push(localCreado);
        this.resetFormulario();
        this.mostrarFormulario = false;
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    },
    editarLocal(local) {
      this.mostrarFormulario = true;
      this.editando = true;
      this.localEditandoId = local.local_id;
      this.nuevoLocal = { ...local };
    },
    async actualizarLocal() {
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch(`http://localhost:3000/api/locales/${this.localEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(this.nuevoLocal),
        });
        if (!conexion.ok) throw new Error("Error al actualizar");
        const localActualizado = await conexion.json();
        const index = this.locales.findIndex(l => l.local_id === this.localEditandoId);
        this.locales[index] = localActualizado;
        this.resetFormulario();
        this.mostrarFormulario = false;
        this.editando = false;
        this.localEditandoId = null;
      } catch (err) {
        console.error(err);
        alert("Error al actualizar local");
      }
    },
    async eliminarLocal(id) {
      if (!confirm("¿Seguro que deseas eliminar este local?")) return;
      try {
        const token = localStorage.getItem("token");
        const conexion = await fetch(`http://localhost:3000/api/locales/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!conexion.ok) throw new Error("Error al eliminar");
        this.locales = this.locales.filter(local => local.local_id !== id);
      } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el local");
      }
    }
  },
  computed: {
  localesFiltrados() {
    return this.locales.filter(local => {
      const nombreMatch = local.nombre_local
        .toLowerCase()
        .includes(this.filtroNombre.toLowerCase());

      const giroMatch = local.giro_negocio
        .toLowerCase()
        .includes(this.filtroGiro.toLowerCase());

      const estadoMatch =
        this.filtroEstado === "" || local.estado === this.filtroEstado;

      return nombreMatch && giroMatch && estadoMatch;
    });
  }
},

};
</script>
