const { response } = require('express');
const Medico = require('../models/Medico');

const getMedicos = async(req, res) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')


    res.json({
        ok: true,
        medicos: medicos
    })
}

const getMedicosById = async(req, res) => {

    const id = req.params.id;

    try {

        const medicos = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img')


        res.json({
            ok: true,
            medicos: medicos
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Medico no enontrado'
        })
    }

}

const CrearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

        console.log(error);
    }


}

const ActualizarMedico = async(req, res) => {

    const medicoID = req.params.id;
    const uid = req.uid;

    try {

        const medico = Medico.findById(medicoID);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro este medico'
            })
        }

        const cambiosMedicos = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(medicoID, cambiosMedicos, { new: true })

        res.json({
            ok: true,
            medico: medicoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



const BorrarMedico = async(req, res) => {
    const medicoID = req.params.id;

    try {

        const medico = Medico.findById(medicoID);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro este medico'
            })
        }

        await Medico.findByIdAndDelete(medicoID);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    getMedicos,
    CrearMedico,
    ActualizarMedico,
    BorrarMedico,
    getMedicosById
}