const Usuario = require('../models/Usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt');

// GET USUARIOS
const getUsuarios = async(request, response) => {

    const desde = Number(request.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google imagen')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()
    ]);

    response.json({
        ok: true,
        usuarios: usuarios,
        uid: request.uid,
        totalUsuarios: total
    });

}



// POST USUARIOS
const CrearUsuario = async(request, response = response) => {

    const { email, password, nombre } = request.body;


    try {

        const existenteEmail = await Usuario.findOne({ email });

        if (existenteEmail) {
            return response.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(request.body);

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();

        //Generar el token - JWT
        const token = await generarJWT(usuario.id);


        response.json({
            ok: true,
            usuario: usuario,
            token: token
        });

    } catch (error) {
        console.log(error);
        response.status(500).json({
            ok: false,
            msg: 'Error inesperado..'
        });
    }

}



// ACTUALIZAR USUARIO
const actualizarUsuario = async(req, res = response) => {

    // TODO: VALIDAR TOKEN Y COMPROBAR USUARIO

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            });
        }


        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existenteEmail = await Usuario.findOne({
                email: email
            });

            if (existenteEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


// Borrar usuarios

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No exite un usuario con este id'
            });
        }

        const borrarUsuario = await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Se elimino correctamente'
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}






module.exports = {
    getUsuarios,
    CrearUsuario,
    actualizarUsuario,
    borrarUsuario
}