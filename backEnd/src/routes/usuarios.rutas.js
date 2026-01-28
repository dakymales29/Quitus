import { Router } from "express";
import pool from "../db/db.js";
import bcrypt from 'bcrypt';//bcryp es una libreria para encriptar contraseñas, no desencrita ni guarda la contraseña real  solo la compara lo q ingresa el usuario con la bd de forma segura.
import { verificarToken } from "./auth.middleware.js";
import { verificarAdmin } from "../roles/roles.js";//importamos roles

const router = Router();

//GET TODOS LOS USUARIOS
router.get("/usuarios",verificarToken,verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "ERROR AL TRAER USUARIOS" });
  }
});

//GET POR ID
router.get("/usuarios/:id",verificarToken,verificarAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM usuario WHERE user_id=$1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "USUARIO NO EXISTE..!!" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "ERROR AL TRAR USUARIO" });
  }
});

//crear 
router.post('/usuarios',verificarToken,verificarAdmin, async (req,res)=>{
  const {user_name,pass,tipo} = req.body;
  //validacion basica- campos obligatorios
  if (!user_name||!pass||!tipo) {
    return res.status(400).json({mensaje:'No campos vacios'});
  }
  
  try {
    //encriptar contraseña
    const hashPassword = await bcrypt.hash(pass,10);//encriptamos el campo de la bd y estandar 10
    const result = await pool.query(
    ' INSERT INTO usuario (user_name,pass,tipo) VALUES ($1,$2,$3) RETURNING *',
    [user_name,hashPassword,tipo]// aqui guardamos la contraseña encriptada
    );
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({mensaje:'ERROR AL CREAR USUARIO..!!!'});
  }
});

//PUT - ACTUALIZAR
router.put('/usuarios/:id',verificarToken,verificarAdmin, async (req,res)=>{
  const {id} = req.params;
  const {user_name,pass,tipo} = req.body;

  //validacion basica - campos vacios
  if (!user_name || !pass || !tipo) {
    return res.status(400).json({mensaje:'No se permiten campos vacios'})
  }
  //validacion basica - ingresar solo numeros
  if(isNaN(Number(id))){
    return res.status(400).json({mensaje:'Ingresar solo numeros'});
  }
  //encriptar
  const hashPassword = await bcrypt.hash(pass,10);
  try {
    const result = await pool.query(
      'UPDATE usuario SET user_name = $1 ,pass = $2,tipo = $3 WHERE user_id= $4 RETURNING *',
      [user_name,hashPassword,tipo,id]
    );
    if (result.rows.length===0) {
      return res.status(404).json({mensaje:'NO SE ENCONTRÓ USUARIO..!!'});
    }
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({mensaje:'ERROR AL ACTULIZAR :('})
  }
});

//DELETE
router.delete('/usuarios/:id',verificarToken,verificarAdmin, async (req,res)=>{
  const {id} = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM usuario WHERE user_id = $1 RETURNING *',[id]
    );
    if (result.rows.length===0) {
      return res.status(404).json({mensaje:'NO SE ENCONTRO INFORMACION'});
      
    }
    res.json({mensaje:'ELIMINADO CON EXITO'});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({mensaje:'ERROR AL ELIMINAR'})
  }
});


export default router;
