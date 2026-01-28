import pool from './db/db.js';

async function testConnection() {
    try {
        const res = await pool.query('SELECT * FROM locales'); // o cualquier tabla que tengas
        console.log('Conexión exitosa 🚀');
        console.table(res.rows); // muestra los datos en forma de tabla
    } catch (error) {
        console.error('Error al conectar:', error);
    } finally {
        pool.end(); // cierra la piscina de conexiones
    }
}

testConnection();
