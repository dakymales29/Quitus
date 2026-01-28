<template>
  <section class="w-full">
    <!-- TÍTULO -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Usuarios</h1>
      <p class="text-gray-500 text-sm">Administración de accesos al sistema</p>
    </div>

    <!-- BOTÓN CREAR -->
    <button
      @click="nuevoUsuarioForm"
      class="mt-4 mb-3 px-5 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
    >
      ➕ Nuevo Usuario
    </button>

    <!-- FORMULARIO -->
    <div
      v-if="mostrarFormulario"
      class="mb-10 bg-white rounded-2xl shadow p-6 max-w-2xl mx-auto"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-800">
        {{ editando ? "Editar usuario" : "Crear usuario" }}
      </h2>

      <form
        @submit.prevent="editando ? actualizarUsuario() : crearUsuario()"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          v-model="nuevoUsuario.user_name"
          placeholder="Nombre del usuario"
          class="input"
          required
        />

        <!-- PASSWORD: aparece siempre, pero NO es obligatorio al editar -->
        <input
          v-model="nuevoUsuario.pass"
          type="password"
          placeholder="Contraseña"
          class="input"
          :required="!editando"
        />

        <select v-model="nuevoUsuario.tipo" class="input" required>
          <option disabled value="">Tipo</option>
          <option>invitado</option>
          <option>editor</option>
        </select>

        <div class="sm:col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            @click="cancelarFormulario"
            class="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>

    <!-- GRID -->
    <div
      v-if="!cargando && !error"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="user in usuarios"
        :key="user.user_id"
        class="bg-white rounded-2xl shadow"
      >
        <div class="px-6 py-4 bg-slate-50 border-b">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ user.user_name }}
          </h2>
        </div>

        <div class="p-6 space-y-3 text-sm text-gray-600">
          <div>ID: {{ user.user_id }}</div>
          <div>Tipo: {{ user.tipo }}</div>

          <button
            @click="editarUsuario(user)"
            class="mt-4 w-full px-4 py-2 rounded-xl bg-yellow-500 text-white"
          >
            ✏️ Editar
          </button>

          <button
            @click="eliminarUsuario(user.user_id)"
            class="mt-2 w-full px-4 py-2 rounded-xl bg-red-600 text-white"
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
  name: "Usuarios",

  data() {
    return {
      usuarios: [],
      cargando: true,
      error: null,

      mostrarFormulario: false,
      editando: false,
      usuarioEditandoId: null,

      nuevoUsuario: {
        user_name: "",
        pass: "",
        tipo: "",
      },
    };
  },

  async mounted() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    this.usuarios = await res.json();
    this.cargando = false;
  },

  methods: {
    resetFormulario() {
      this.nuevoUsuario = {
        user_name: "",
        pass: "",
        tipo: "",
      };
    },

    nuevoUsuarioForm() {
      this.resetFormulario();
      this.editando = false;
      this.mostrarFormulario = true;
    },

    cancelarFormulario() {
      this.resetFormulario();
      this.editando = false;
      this.usuarioEditandoId = null;
      this.mostrarFormulario = false;
    },

    editarUsuario(usuario) {
      this.editando = true;
      this.mostrarFormulario = true;
      this.usuarioEditandoId = usuario.user_id;

      this.nuevoUsuario = {
        user_name: usuario.user_name,
        pass: "", // 🔥 CLAVE
        tipo: usuario.tipo,
      };
    },

    async crearUsuario() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.nuevoUsuario),
      });

      const nuevo = await res.json();
      this.usuarios.push(nuevo);
      this.cancelarFormulario();
    },

    async actualizarUsuario() {
      const token = localStorage.getItem("token");

      // 🔥 ARREGLO REAL DEL EDITAR
      const data = {
        user_name: this.nuevoUsuario.user_name,
        tipo: this.nuevoUsuario.tipo,
      };

      // 🔥 SOLO si escribió contraseña
      if (this.nuevoUsuario.pass.trim() !== "") {
        data.pass = this.nuevoUsuario.pass;
      }

      const res = await fetch(
        `http://localhost:3000/api/usuarios/${this.usuarioEditandoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const actualizado = await res.json();

      const index = this.usuarios.findIndex(
        u => u.user_id === this.usuarioEditandoId
      );
      this.usuarios[index] = actualizado;

      this.cancelarFormulario();
    },

    async eliminarUsuario(id) {
      if (!confirm("¿Eliminar usuario?")) return;

      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      this.usuarios = this.usuarios.filter(u => u.user_id !== id);
    },
  },
};
</script>
