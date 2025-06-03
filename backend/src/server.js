import express from 'express';
import swaggerUi from 'swagger-ui-express';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import swagger from './swagger.js';

const app = express();

app.use(cors());   
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
