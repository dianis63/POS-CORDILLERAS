import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import pool from './src/db.js';
import authRoutes from './src/routes/authRoutes.js';
import empleadoRoutes from './src/routes/empleadoRoutes.js';
import categoriaRoutes from './src/routes/categoriaRoutes.js';
import insumoRoutes    from './src/routes/insumoRoutes.js';
import productoRoutes from './src/routes/productoRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'pos_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 8 }, // 8 horas
}));

app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/insumos',    insumoRoutes);
app.use('/api/productos', productoRoutes);
// Verificar conexión a BD
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err.message);
    } else {
        console.log('Conexión exitosa a PostgreSQL');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 3000}`);
});