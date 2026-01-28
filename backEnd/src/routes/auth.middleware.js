import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Token no enviado' });
    }

    const token = authHeader.split(' ')[1]; // 👈 FIX

    if (!token) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // guardamos el usuario decodificado
        req.usuario = decoded;

        next(); // 👈 CLAVE
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token expirado o inválido' });
    }
};
