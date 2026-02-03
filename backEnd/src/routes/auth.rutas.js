//AQUI VAMOS A VALIDAR EL LOGIN
//el backEnd recibe usuario y contraseña, buscamos el usuario en la BD, comparamos la contraseña encriptada, tenemos respuesta.
import { Router } from "express";
import pool from "../db/db.js";//archivo db.js por pool
import bcrypt from "bcrypt";//importamos para la encriptacion
//añadimos el token
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/login',async (req,res)=>{

    const {user_name,password} = req.body;

    if (!user_name || !password) {
        return res.status(400).json({mensaje:'No se permiten campos vacios'});
        
    }

    try {
        const result = await pool.query(
        ' SELECT * FROM usuario WHERE user_name = $1' ,[user_name]
        );

        if (result.rows.length ===0) {
            return res.status(404).json({mensaje:'USUARIO NO EXISTE'});
        }
        
        const usuario = result.rows[0];

        const ok = await bcrypt.compare(password, usuario.password);//comparamos que la contraseña ingresada con la encriptada de la BD
       
        if (!ok) {
            return res.status(404).json({mensaje:'Usuario o contraseña incorrectos'});
            
        }
        //uso de token por 1 hora -> siempre ponerlo despues de saber si la contraseña es correcta o no 
        const token = jwt.sign(
            {
                id: usuario.user_id,
                user_name: usuario.user_name,
                tipo: usuario.tipo
            },
            //usamos la llave de nuestro token y damos 1 hora de expiracion, pasado 1 hora el login se cerrará
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        //tal caso de ser positivo enviamos un mensjae mas el nombre del usuario ingresado NO CONTRASEÑA
        res.json({
            mensaje:'BIENVENIDO USUARIO:',
            token,
            tipo: usuario.tipo, // 👈 para poder usar el tipo de rol en el frontEnd
            usuario:{
                user_name:usuario.user_name
            }
        });
        

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({mensaje:'ERROR EN LOGIN..!!'});
    }


});
export default router;