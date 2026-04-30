import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import pool from './src/db.js';
import authRoutes from './src/routes/authRoutes.js';

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