//aqui conectamos nuestro proyecto con la base de datos
import pkg from 'pg';//instalamos libreria que nos permite conectarnos con postgreSQL
import dotenv from 'dotenv';

dotenv.config();//con esto cargamos las variables de nuestro .env

const {Pool} = pkg;//Pool es una psicina de conexiones a la base de datos 

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

export default pool;