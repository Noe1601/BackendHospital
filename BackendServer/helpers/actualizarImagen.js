const Usuario = require('../models/Usuario');
const Medico = require('../models/Medico');
const Hospital = require('../models/Hospital');
const fs = require('fs');

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'Medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                return false;
            }

            const pathViejo = `./Uploads/Medicos/${ medico.imagen }`;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.imagen = nombreArchivo;
            await medico.save();
            return true;

            break;

        case 'Hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                return false;
            }

            const pathViejo2 = `./Uploads/Hospitales/${hospital.imagen}`;
            if (fs.existsSync(pathViejo2)) {
                fs.unlinkSync(pathViejo2);
            }

            hospital.imagen = nombreArchivo;
            await hospital.save();
            return true;
            break;

        case 'Usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            const pathViejo3 = `./Uploads/Usuarios/${usuario.imagen}`;
            if (fs.existsSync(pathViejo3)) {
                fs.unlinkSync(pathViejo3);
            }

            usuario.imagen = nombreArchivo;
            await usuario.save();
            return true;
            break;
    }


}

module.exports = {
    actualizarImagen
}