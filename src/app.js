import express from 'express';
const cors = require('cors');
import config from './config';
import patientsRoutes from './routes/patients.routes';
import authRoutes from './routes/auth.routes';
import listRoutes from './routes/list.routes';

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

const app = express();

// middlewares
app.use(express.json());
app.use(cors(corsOptions));

// routes
app.use('/api/inpatients', patientsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/list', listRoutes);

app.set('port', config.port || 3000);

export default app;
