const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const actionRouter = require('./routers/actionRouter.js');
const projectRouter = require('./routers/projectRouter.js');

const server = express();

server.use(express.json());
server.use(morgan('dev'));
server.use(helmet());
server.use(cors());

server.use('/api/action', actionRouter);
server.use('/api/project', projectRouter);

const port = 5000;

server.listen(port, () => {
    console.log (' hello world');
});



