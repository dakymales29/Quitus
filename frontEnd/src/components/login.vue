<template>
  <div
    class="min-h-screen flex items-center justify-center
           bg-gradient-to-r from-blue-500 to-purple-600
           px-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl
             p-6 sm:p-8 md:p-10
             w-full max-w-md"
    >

      <h1 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
        Bienvenido
      </h1>

      <!-- USUARIOS DEMO -->
      <div class="mb-6 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <p class="font-bold">Usuarios demo:</p>
        <p>admin1 - 123456</p>
        <p>invitado - 123</p>
        <p>secretaria - 123</p>
      </div>

      <!-- FORM -->
      <form class="space-y-5" @submit.prevent="handleLogin">

        <input
          v-model="user_name"
          placeholder="usuario"
          class="w-full px-4 py-2 rounded-xl border"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 rounded-xl border"
          required
        />

        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white font-bold rounded-xl"
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
        pass:this.password
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
