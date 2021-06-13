/* 
Ruta: /api/upload/usuarios/123
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/ValidarCampos');
const { validarJWT } = require('../middlewares/ValidarJWT');
const file = require('express-fileupload');

router.use(file());

const {
    fileUpload,
    ObtenerImagen
} = require('../controllers/Uploads')

// GET TODO
router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', ObtenerImagen);


module.exports = router;