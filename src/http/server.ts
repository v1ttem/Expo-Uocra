import express from 'express'
import registroRoutes from './routes/registro-usuarios'
const path = require('path');

export default () => {
    console.log('Levantando servidor HTTP')
    let app = express()

    app.use(express.json());
    app.use(express.static(
        path.join(__dirname, '../../public')));

    app.get('/inscripcion', (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/html/index.html'));
    });

    app.use('/api/inscripcion', registroRoutes);

    app.listen(3000, () => {
        console.log('escuchando puerto 3000')
    })
}