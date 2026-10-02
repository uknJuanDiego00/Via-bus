const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db.js');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/buses', require('./src/routes/busRoutes'));
app.use('/api/trips', require('./src/routes/tripRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Via Bus Express Funcionando Correctamente');
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
});