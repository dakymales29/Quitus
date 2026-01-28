//ESTE ARCHIVO SOLO ARRANCA EL SERVIDOR
import app from './app.js';//importamos app.js

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
})
