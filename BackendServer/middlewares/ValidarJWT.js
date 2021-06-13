const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const validarJWT = (req, resp, next) => {

    //Leer el Token
    const token = req.header('x-token');

    if (!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();

    } catch (error) {
        return resp.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        });
    }


}


const validarRol_o_mismo_Usuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no existe.'
            })
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {

            next();

        } else {

            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios suficientes para realizar esta accion.'
            })

        }




    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    validarJWT,
    validarRol_o_mismo_Usuario
}