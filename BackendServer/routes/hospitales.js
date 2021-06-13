/* 
Ruta: '/api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/ValidarCampos');
const { validarJWT } = require('../middlewares/ValidarJWT');

const {
    getHospitales,
    CrearHospital,
    ActualizarHospital,
    BorrarHospital
} = require('../controllers/Hospitales');

// GET
router.get('/', validarJWT, getHospitales);



// POST
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos,
    ],
    CrearHospital);

// PUT
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    ActualizarHospital)

// DELETE
router.delete('/:id', BorrarHospital, validarJWT);



module.exports = router;