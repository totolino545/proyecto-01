const fs   = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}

function generarId(discos) {
    let mayorId = 0;

    discos.forEach((disco) => {
        if (Number(disco.id) > mayorId) {
            mayorId = Number(disco.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const discos = await leer();
    const disco  = discos.find((element) => element.id === id);

    if (!disco) throw new Error("Error. El Id no corresponde a un disco en existencia.");

    return disco;
}

async function findAll() {
    const discos = await leer();
    return discos;
}

async function create(disco) {
    if (!disco?.artista || !disco?.descripcion || !disco?.genero || !disco?.precio || !disco?.stock) throw new Error("Error. Datos incompletos.");

    let discos = await leer();
    const discoConId = { id: generarId(discos), ...disco };

    discos.push(discoConId);
    await escribir(discos);

    return discoConId;
}

async function update(disco) {
    if (!disco?.artista || !disco?.descripcion || !disco?.genero || !disco?.precio || !disco?.stock) throw new Error("Error. Datos incompletos.");

    let discos   = await leer();
    const indice = discos.findIndex((element) => element.id === disco.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un disco en existencia.");

    discos[indice] = disco;
    await escribir(discos);

    return discos[indice];
}

async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let discos   = await leer();
    const indice = discos.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un disco en existencia.");

    const disco = discos[indice];
    discos.splice(indice, 1);
    await escribir(discos);

    return disco;
}

module.exports = { findOneById, findAll, create, update, destroy };