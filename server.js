const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/data.manager.js");

require('dotenv').config();

const server = express();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener todos los discos: Ruta GET http://127.0.0.1:3000/discos
server.get('/discos', (req, res) => {
    findAll()
        .then((discos) => res.status(200).send(discos))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un disco específico: Ruta GET http://127.0.0.1:3000/discos/1
server.get('/discos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((disco) => res.status(200).send(disco))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo disco: Ruta POST http://127.0.0.1:3000/discos
server.post('/discos', (req, res) => {
    const { artista, descripcion, genero, precio, stock } = req.body;

    create({ artista, descripcion, genero, precio, stock })
        .then((discos) => res.status(201).send(discos))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un disco específico: Ruta PUT http://127.0.0.1:3000/discos/1
server.put('/discos/:id', (req, res) => {
    const { id } = req.params;
    const { artista, descripcion, genero, precio, stock } = req.body;

    update({ id: Number(id), artista, descripcion, genero, precio, stock })
        .then((disco) => res.status(200).send(disco))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un disco específico: Ruta DELETE http://127.0.0.1:3000/discos/1
server.delete('/discos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((disco) => res.status(200).send(disco))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peteciones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/discos`);
});