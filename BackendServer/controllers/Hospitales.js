const { response } = require('express');
const Hospital = require('../models/Hospital');

const getHospitales = async(req, res) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales: hospitales
    });

}

const CrearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    console.log(uid)

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

        console.log(error);

    }
}

const ActualizarHospital = async(req, res) => {

    const hospitalID = req.params.id;
    const uid = req.uid;

    try {

        const hospital = Hospital.findById(hospitalID);

        if (!hospital) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalID, cambiosHospital, { new: true })

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        })
    }


}

const BorrarHospital = async(req, res) => {

    const hospitalID = req.params.id;

    try {

        const hospital = Hospital.findById(hospitalID);

        if (!hospital) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(hospitalID)

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    CrearHospital,
    ActualizarHospital,
    BorrarHospital
}