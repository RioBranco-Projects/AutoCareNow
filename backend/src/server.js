import express from 'express';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import session from 'express-session';
import cors from 'cors';
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
}
app.use(cors(corsOptions));   
app.use(express.json());

app.use(session({
  secret: 'slaslasla', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false /* true se HTTPS */, maxAge: 1000 * 60 * 60 },
}))
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
