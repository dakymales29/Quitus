import { Router } from "express";
import pool from '../db/db.js';
import { verificarToken } from "./auth.middleware.js";
import { verificarAdmin, verificarEditor, verificarLectura } from "../roles/roles.js";

const router = Router();

// GET TODOS LOS PROPIETARIOS Y ARRENDATARIOS
router.get('/propietarios', verificarToken, verificarLectura, async (req,res)=>{
    try {
        const result  = await pool.query('SELECT * FROM propietarios_arriendo');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:"ERROR AL OBTENER PROPIETARIOS Y ARRENDATARIOS"});
    }
});

// GET POR ID
router.get('/propietarios/:id', verificarToken, verificarLectura, async (req,res)=>{
    const {id} = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM propietarios_arriendo WHERE id_propietario=$1', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({mensaje:'PROPIETARIO/ARRENDATARIO NO ENCONTRADO'});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL OBTENER PROPIETARIOS Y ARRENDATARIOS'});
    }
});

// CREAR
router.post('/propietarios', verificarToken, verificarEditor, async (req,res)=>{
    const {nombre, apellido, cedula, correo, contacto} = req.body;
    if (!nombre || !apellido || !cedula || !correo || !contacto) {
        return res.status(400).json({mensaje:'CAMPOS OBLIGATORIOS'});
    }
    if(isNaN(Number(contacto)) || isNaN(Number(cedula))){
        return res.status(400).json({mensaje:'INGRESE SOLO NUMEROS'});
    }
    try {
        const result = await pool.query(
            `INSERT INTO propietarios_arriendo (nombre, apellido, cedula, correo, contacto)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [nombre, apellido, cedula, correo, contacto]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL CREAR PROPIETARIO'});
    }
});

// PUT - ACTUALIZAR
router.put('/propietarios/:id', verificarToken, verificarEditor, async (req,res)=>{
    const {id} = req.params;
    const {nombre, apellido, cedula, correo, contacto} = req.body;
    if (!nombre || !apellido || !cedula || !correo || !contacto) {
        return res.status(400).json({mensaje:'CAMPOS OBLIGATORIOS'});
    }
    if (isNaN(Number(contacto)) || isNaN(Number(cedula)) || isNaN(Number(id))) {
        return res.status(400).json({mensaje:'INGRESAR SOLO NUMEROS'});
    }
    try {
        const result = await pool.query(
            'UPDATE propietarios_arriendo SET nombre=$1, apellido=$2, cedula=$3, correo=$4, contacto=$5 WHERE id_propietario=$6 RETURNING *',
            [nombre, apellido, cedula, correo, contacto, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({mensaje:'NO EXISTE PROPIETARIO'});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL ACTUALIZAR PROPIETARIO'});
    }
});

// DELETE
router.delete('/propietarios/:id', verificarToken, verificarAdmin, async (req,res)=>{
    const {id} = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM propietarios_arriendo WHERE id_propietario=$1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({mensaje:'NO SE ENCONTRO INFORMACION'});
        }
        res.json({mensaje:'PROPIETARIO ELIMINADO'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR AL ELIMINAR PROPIETARIO'});
    }
});

export default router;
