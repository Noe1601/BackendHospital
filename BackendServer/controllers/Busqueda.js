const { response } = require('express');

const Usuario = require('../models/Usuario');
const Medicos = require('../models/Medico');
const Hospitales = require('../models/Hospital');

// Buscar entre todos

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;

    const regex = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medicos.find({ nombre: regex }),
        Hospitales.find({ nombre: regex })
    ]);

    try {

        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

        console.log(error);
    }

}


// Buscar en colecciones especificas

const documentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');


    let data = [];

    console.log(tabla);

    switch (tabla) {
        case 'medicos':
            data = await Medicos.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');

            break;

        case 'hospitales':
            data = await Hospitales.find({ nombre: regex })
                .populate('usuario', 'nombre img')
            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La ruta esta incorrecta'
            });



    }

    res.json({
        ok: true,
        resultados: data
    })

}


module.exports = {
    getTodo,
    documentosColeccion
}