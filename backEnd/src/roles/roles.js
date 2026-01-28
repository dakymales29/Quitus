//Aqui pondremos los roles que hace cada usuario

//ADMIN
 export const verificarAdmin = (req,res,next)=>{
    if (req.usuario.tipo!=='super') {
        return res.status(403).json({mensaje:'No tiene permiso para realizar esta accion.'})
    }
    next();
 }

 //editar/crear
 export const verificarEditor = (req,res,next)=>{
    if (req.usuario.tipo === 'super' || req.usuario.tipo === 'editor') {
        return next();
    }
    return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' })
 }

 //leer
export const verificarLectura = (req,res,next)=>{

if (req.usuario.tipo === 'invitado' || req.usuario.tipo === 'super' || req.usuario.tipo === 'editor') {
        return next();
    }
    return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' })
 }
