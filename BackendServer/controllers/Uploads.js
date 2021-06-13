const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImagen');
const path = require('path');
const fs = require('fs');

const fileUpload = (req, res = response) => {


    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['Hospitales', 'Medicos', 'Usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, ususario y hospital'
        })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay archivos'
        })
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        })
    }

    // Generar el nombre del archivo

    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar imagen

    const path = `./Uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen

    file.mv(path, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                msg: 'Error al mover imagen'
            })
        }

        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo cargado',
            nombreArchivo
        })
    })


}


const ObtenerImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../Uploads/${ tipo }/${ foto }`);

    // Imagen por defecto

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../Uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}


module.exports = {
    fileUpload,
    ObtenerImagen
}