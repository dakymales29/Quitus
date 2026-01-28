
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import localesRutas from './routes/locales.rutas.js';//importamos la ruta de locales
import titularesRutas from './routes/titular.rutas.js';
import propietariosArriendoRutas from './routes/propietarios.arriendo.js';
import usuariosRutas from './routes/usuarios.rutas.js';
import login from './routes/auth.rutas.js';
dotenv.config();//con esto cargamos las variables de nuestro .env

const app = express();//para usar express en mi servidor

// middlwares
app.use(cors());//permite darle permiso a cualqueir persona se conecte a mi backEnd
app.use(express.json());//permite peticiones en formato JSON

//rutas Locales
app.use('/api',localesRutas);//usamos las rutas de locales.rutas.js, es buena practica poner /api porque es BACKEND y asi evitamos problemas al conectar con el front
//rutas titulares
app.use('/api', titularesRutas);
//rutas propietarios y arriendo
app.use('/api', propietariosArriendoRutas);
//rutas usuarios
app.use('/api',usuariosRutas);
//ruta login
app.use('/api', login);

// ruta prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend QuitusCC funcionando 🚀' });
});


export default app;
