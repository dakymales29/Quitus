<template>
  <div class="
           bg-gradient-to-r from-blue-500 to-purple-600
           px-4">
    <p class="text-2xl sm:text-3xl
               font-bold  text-gray-800 ">Usuarios</p>
    <p class="font-bold">admin1 - 123456</p>
    <p class="font-bold">invitado - 123</p>
    <p class="font-bold">secretaria - 123</p>
  </div>
  <div
    class="min-h-screen flex items-center justify-center
           bg-gradient-to-r from-blue-500 to-purple-600
           px-4"
  >
    <!-- Card del login -->
    <div
      class="bg-white rounded-2xl shadow-xl
             p-6 sm:p-8 md:p-10
             w-full max-w-md"
    >
      <h1
        class="text-2xl sm:text-3xl
               font-bold text-center text-gray-800 mb-6"
      >
        Bienvenido
      </h1>

      <!-- Formulario -->
      <form class="space-y-5" @submit.prevent="handleLogin">

        <!-- Usuario -->
        <div>
          <label class="block text-gray-700 mb-2 text-sm sm:text-base">
            Usuario
          </label>
          <input
            v-model="user_name"
            placeholder="usuario"
            class="w-full px-4 py-2 sm:py-3
                   rounded-xl border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-gray-700 mb-2 text-sm sm:text-base">
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 sm:py-3
                   rounded-xl border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="w-full py-2.5 sm:py-3
                 bg-blue-500 text-white
                 font-bold rounded-xl
                 hover:bg-blue-600 transition-colors"
        >
          Iniciar sesión
        </button>

      </form>
    </div>
  </div>
</template>

<script>
export default{
name: 'Login',
data(){
  return{
    user_name:'',
    password:''
  }
},
methods:{
  async handleLogin(){
  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/login`,{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        user_name:this.user_name,
        password:this.password
      })
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      throw new Error(datos.message || 'Credenciales incorrectas')
    }
     console.log('LOGIN OK ✅', datos)

      // Guardar token (si el backend lo envía)
    localStorage.setItem('token', datos.token)
    //ROL DE USUARIO LOGEADO (para que el frontEnd sepa el rol del usuario logueado)
    localStorage.setItem('rol', datos.tipo)

    // Redirigir (si ya tienes router)
    this.$router.push('/Inicio')

  } catch (error) {
    console.error('ERROR LOGIN ❌', error.message)
    alert(error.message)
  }
  }
}
}


</script>
