const { Router } = require('express');
const { login, GoogleSignIn, renewToken } = require('../controllers/Auth')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/ValidarCampos');
const { ValidarJWT, validarJWT } = require('../middlewares/ValidarJWT')

const router = Router();

/*
 Ruta: /api/login
*/

// router.get('/renew', ValidarJWT, renewToken)

router.post('/', [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login)

router.post('/google', [
        check('token', 'El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    GoogleSignIn)

router.get('/renew', validarJWT, renewToken)



module.exports = router;