const express = require('express');
var cors = require('cors')
require("dotenv").config();

const reservasRoutes = require('./routes/reserva');
const usuariosRoutes = require('./routes/usuario');

require('./db.js');

const PORT = process.env.PORT || 3000;
const server = express();
server.use(express.static('public'));

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use('/users', usuariosRoutes);
server.use('/bookings', reservasRoutes);


server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
