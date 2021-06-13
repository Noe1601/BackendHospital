const { Router } = require('express');
const { getUsuarios, CrearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { check } = require('express-validator');
const router = Router();
const { validarCampos } = require('../middlewares/ValidarCampos');
const { validarJWT, validarRol, validarRol_o_mismo_Usuario } = require('../middlewares/ValidarJWT');

/*
 Ruta: /api/usuarios
*/

// GET
router.get('/', validarJWT, getUsuarios);



// POST
router.post('/', [ // VALIDACIONES DE CAMPOS
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        validarCampos,
    ],
    CrearUsuario);

// PUT
router.put('/:id', [ // VALIDACIONES DE CAMPOS
        validarJWT,
        validarRol_o_mismo_Usuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos,

    ],
    actualizarUsuario)

// DELETE
router.delete('/:id', validarJWT, borrarUsuario);



module.exports = router;