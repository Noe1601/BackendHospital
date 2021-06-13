const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { verify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-front');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // Verificar password

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no encontrada'
            });
        }

        //Generar el token - JWT

        const token = await generarJWT(usuarioDB.id);


        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const GoogleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await verify(googleToken);

        // Verificar usuario en la base de datos

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                imagen: picture,
                google: true
            })
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            usuario.password = '@@@'
        }

        // Guardar en DB

        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token: token
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }
}


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el token - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    })
}




module.exports = {
    login,
    GoogleSignIn,
    renewToken
}