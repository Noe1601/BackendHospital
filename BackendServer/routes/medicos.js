/* 
Ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/ValidarCampos');
const { validarJWT } = require('../middlewares/ValidarJWT');

const {
    getMedicos,
    CrearMedico,
    ActualizarMedico,
    BorrarMedico,
    getMedicosById
} = require('../controllers/Medicos');

// GET
router.get('/', validarJWT, getMedicos);



// POST
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital id debe de ser valido').isMongoId(),
        validarCampos
    ],
    CrearMedico);

// PUT
router.put('/:idb', validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital es obligatorio').not().isEmpty(),
    ActualizarMedico)

// DELETE
router.delete('/:id', validarJWT, BorrarMedico);

router.get('/:id', validarJWT, getMedicosById);

module.exports = router;