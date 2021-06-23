import express from 'express';
import listEndpoints from 'express-list-endpoints';
import { notFound, forbidden, catchAllErrorHandler } from './errorHandlers.js';

import cors from 'cors';

import authorsRouter from '../services/authors/index.js';

const port = 3001;

const server = express();

//loggers middleware

server.use(cors());
server.use(express.json());
//logger middleware
server.use('/authors', authorsRouter);
//other routes

server.use(notFound);
server.use(forbidden);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log('Server is running on port ' + port);
});
