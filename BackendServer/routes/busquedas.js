/* 
Ruta: '/api/todo/:busqueda'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/ValidarCampos');
const { validarJWT } = require('../middlewares/ValidarJWT');


const {
    getTodo,
    documentosColeccion
} = require('../controllers/Busqueda')

// GET TODO
router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, documentosColeccion);

module.exports = router;