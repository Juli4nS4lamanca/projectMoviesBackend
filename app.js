import express from 'express';
import connectMongoDB from './configs/mongoDB.js';
import requestLogger from './middleware/requestLogger.js';
import unknownEndpoint from './middleware/unknownEndpoint.js';
import errorHandler from './middleware/errorHandler.js';
import typesRouter from './controllers/typeController.js';
import directorsRouter from './controllers/directorController.js';
import genresRouter from './controllers/genreController.js';
import producersRouter from './controllers/producerController.js';
import mediasRouter from './controllers/mediaController.js';

const app = express();

connectMongoDB();

app.use(express.json());
app.use(requestLogger);

app.use('/api/types', typesRouter);
app.use('/api/directors', directorsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/producers', producersRouter);
app.use('/api/medias', mediasRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
