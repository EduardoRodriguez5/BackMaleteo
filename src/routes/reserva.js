const express = require('express');
const Reserva = require('../models/Reserva');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autentication');
const reservaRouter = express.Router();

reservaRouter.get('/booking/:id', (req, res)=> {
    const id = req.params.id;
    Reserva.findById(id, {__v: 0, updatedAt: 0, createdAt: 0})
        .populate("guardian")
        .exec((err, reserva) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(reserva)
            }
        })
});
reservaRouter.get('/:email', (req, res)=> {
    const email = req.params.email;
    Reserva.find({"client": email},{__v: 0, updatedAt: 0, createdAt: 0})
        .populate("guardian")
        .exec((err, reserva) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(reserva)
            }
        })
});

reservaRouter.get('/', (req, res) => {
    Reserva.find({}, {__v: 0, createdAt: 0, updatedAt: 0})
        .exec((err, reservas) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(reservas);
            }
        })
});
reservaRouter.post('/register', (req, res) => {
    const initialDate = req.body.initialDate;
    const finalDate = req.body.finalDate;
    const nSuitcases = req.body.nSuitcases;
    const client = req.body.client;
    const guardian = req.body.guardian;
    const reserva = new Reserva()
        reserva.initialDate = initialDate;
        reserva.finalDate = finalDate;
        reserva.nSuitcases = nSuitcases;
        reserva.client = client;
        reserva.guardian = guardian;

        reserva.save()
            .then((newReserva)=> {
                res.json(newReserva);
            })
            .catch((error)=> {
                res.status(500).send(error);
            })
});

reservaRouter.delete('/booking/delete/:id', (req, res) => {
    const id = req.params.id;
    Reserva.findByIdAndDelete(id)
        .then((deletedReserva) => {
            res.send('Reserva borrada');
        })
        .catch((error) => {
            res.status(500).send(error);
        })
})

module.exports = reservaRouter;
