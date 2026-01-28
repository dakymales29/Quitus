//una ruta es “Cuando alguien visite ESTA URL, ejecuta ESTE código”
import { Router } from "express";//para poder tener rutas externas que se conectaran a app.js y tener un codigo escalabley limpio
import pool from '../db/db.js';//importamos pool para la conexion a la bd del archivo db.js
import { verificarToken } from "./auth.middleware.js";
import { verificarAdmin, verificarLectura, verificarEditor } from "../roles/roles.js";//importamos los roles
 const router = Router();

 //GET TODOS LOS LOCALES
 router.get('/locales',verificarToken,verificarLectura, async (req,res)=>{//req -> lo que el cliente envia, res-> lo que devuelvo
    try {
        const result = await pool.query('SELECT * FROM locales');
        res.json(result.rows);
        
    } catch (error) {
        console.error(error);
       return res.status(500).json({mensaje: "ERROR AL OBTENER LOCALES"});
        
    }
 });

 //GET POR ID
 router.get('/locales/:id',verificarToken, verificarLectura, async(req,res)=>{
    const {id} = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM locales WHERE local_id=$1',[id]// el $1 significa EL PRIMER VALOR QUE LLEGA DESDE EL ARRAY, es para QUERY SEGURO
        );

        if (result.rows.length===0) {
            return res.status(404).json({mensaje:'LOCAL NO ENCONTRADO...!'}); 
        }

        res.json(result.rows[0]);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL OBTENER LOCAL'})
        
    }

 });
//POST - CREAR
router.post('/locales',verificarToken, verificarEditor, async(req,res)=>{
    const {nombre_local, giro_negocio,estado,dimensiones,user_id,titular_id} = req.body;//BODY PORQUE VAMOS A INGRESAR DATOS EN FORMATO JSON, PARAMS SE UTILIZAR SOLO PARA LA URL ES DECIR BUSQUEDA POR ID
    //VALIDACION BASICA - campos obligatorios
    if (!nombre_local|| !giro_negocio||!estado||!dimensiones||!user_id||!titular_id) {
        return res.status(400).json({mensaje:'TODOS LOS CAMPOS SON OBLIGATORIOS..!!'});
            
    }
    //VALIDACION BASICA-SOLO NUMEROS
    if (isNaN(Number(user_id)) || isNaN(Number(titular_id))) {
        return res.status(400).json({mensaje:'INGRESE SOLO NUMEROS'});
        
    }

    try {
        const result = await pool.query(
        `INSERT INTO locales (nombre_local, giro_negocio,estado,dimensiones,user_id,titular_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [nombre_local, giro_negocio,estado,dimensiones,user_id,titular_id]
        );
       
        res.status(201).json(result.rows[0]);//201 es CREADO EXITOSAMENTE
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL CREAR LOCAL'});
    }
});

//Put- ACTUALIZAR
router.put('/locales/:id',verificarToken,verificarEditor, async (req,res)=>{
    const {id}= req.params;
    const {nombre_local, giro_negocio,estado,dimensiones,user_id,titular_id} = req.body;
    //VALIDACION BASICA, CAMPOS OBLIGATORIOS
    if (!nombre_local|| !giro_negocio||!estado||!dimensiones||!user_id||!titular_id) {
        return res.status(400).json({mensaje:'TODOS LOS CAMPOS SON OBLIGATORIOS'});
    }
    //VALIDACION BASICA-SOLO NUMEROS
    if (isNaN(Number(id)) ||isNaN(Number(user_id)) || isNaN(Number(titular_id))) {
        return res.status(400).json({mensaje:'INGRESE SOLO NUMEROS'});
    }

    try {
        const result = await pool.query(
            'UPDATE locales SET nombre_local = $1, giro_negocio = $2,estado = $3,dimensiones = $4,user_id = $5,titular_id = $6 WHERE local_id = $7 RETURNING *',
            [nombre_local, giro_negocio,estado,dimensiones,user_id,titular_id,id]
        );
        if (result.rows.length===0) {
            return res.status(404).json({mensaje:'NO SE ENCONTRÓ EL LOCAL...!!'})
        }
        res.json(result.rows[0]);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL ACTUALIZAR...!!'});
    }

});
//DELETE
router.delete('/locales/:id',verificarToken,verificarAdmin,async (req,res)=>{
    const {id} = req.params;
    try {
        const result = await pool.query(
        'DELETE from locales WHERE local_id= $1 RETURNING *',
        [id]
        );
        if (result.rows.length===0) {
            return res.status(404).json({ mensaje: 'LOCAL NO ENCONTRADO' });
            
        }
        res.json({mensaje:'LOCAL ELIMINADO CON EXITO..!!'})
    } catch (error) {
        console.error= (error);
        return res.status(500).json({mensaje:'ERROR AL ELIMINAR'});
    }
});

export default router;