import { Router } from "express";
import pool from '../db/db.js';
import { verificarToken } from "./auth.middleware.js";
import { verificarAdmin,verificarLectura,verificarEditor } from "../roles/roles.js";//importamos roles

const router = Router();

//GET TODOS LOS TITULARES
router.get('/titular',verificarToken,verificarLectura, async (req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM titular');
        res.json(result.rows);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:"ERROR AL OBTENER TITULARES"});
    }
});

//GET POR ID
router.get('/titular/:id',verificarToken,verificarLectura,async (req,res)=>{
    const {id} = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM titular WHERE titular_id=$1',[id]
        );
        if (result.rows.length===0) {
            return res.status(404).json({mensaje:'ERROR AL ENCONTRAR TITULAR..!!'})
            
        }
        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
       return res.status(500).json({mensaje:'ERROR AL OBTENER TITULAR'})
    }
});

//CREAR
router.post('/titular',verificarToken,verificarEditor, async (req,res)=>{
    const {nombre,apellido,cedula,correo,contacto,tipo_titular,id_propietario} = req.body;
    //validacion basica - campos vacios
    if (!nombre||!apellido|| !cedula || !correo || !contacto || !tipo_titular || !id_propietario) {
        return res.status(400).json({mensaje:'CAMPOS OBLIGATORIOS'});
    }
    //validacion basica- solo numeros
    if (isNaN(Number(contacto)) || isNaN(Number(cedula)) || isNaN(Number(id_propietario))) {
        return res.status(400).json({mensaje:'Solo ingresar numeros'});
        
    }
    try {
        const result = await pool.query(
        'INSERT INTO titular (nombre,apellido,cedula,correo,contacto,tipo_titular,id_propietario) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [nombre,apellido,cedula,correo,contacto,tipo_titular,id_propietario]
        );
        res.status(201).json(result.rows[0]);

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL CREAR TITULAR'});
    }
});

//PUT - ACTUALIZAR
router.put('/titular/:id',verificarToken,verificarEditor, async (req,res)=>{
    
    const {id} = req.params;
    const {nombre,apellido,cedula,correo,contacto,tipo_titular,id_propietario} = req.body;
    //validacion basica- campos obligatorios
    if (!nombre||!apellido|| !cedula || !correo || !contacto || !tipo_titular || !id_propietario) {
        return res.status(400).json({mensaje:'CAMPOS OBLIGATORIOS'});
    }
    //validacions basica - solo numeros
    if (isNaN(Number(cedula)) || isNaN(Number(contacto)) || isNaN(Number(id_propietario)) || isNaN(Number(id))) {
        return res.status(400).json({mensaje:'Solo ingresas Numeros'})
        
    }

    try {
        const result = await pool.query(
        'UPDATE titular SET nombre = $1,apellido = $2,cedula = $3,correo = $4,contacto = $5,tipo_titular = $6,id_propietario = $7 WHERE titular_id = $8 RETURNING *',
        [nombre,apellido,cedula,correo,contacto,tipo_titular,id_propietario,id]
        );

        if (result.rows.length===0) {
            return res.status(404).json({mensaje:'NO EXISTE EL TITULAR..!!'});
        }
        res.json(result.rows[0]);

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL ACTUALIZAR..!!'});
    }
});

//DELETE
router.delete('/titular/:id',verificarToken,verificarAdmin, async (req,res)=>{
    const {id} = req.params;
    try {
        const result = await pool.query(
        'DELETE FROM titular WHERE titular_id = $1 RETURNING *', [id]
    );
    if (result.rows.length===0) {
        return res.status(404).json({mensaje:'NO SE ENCONTRO INFORMACION'})
    }
    res.json({mensaje:'ELIMINADO CON EXITO'});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL ELIMINAR'});
    }


});


export default router;