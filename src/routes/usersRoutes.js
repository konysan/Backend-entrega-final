const express = require('express');
const router = express.Router();
const User = require('../dao/models/usersModels.js');
const upload = require("../middlewares/upload.js");
const mongoose = require("mongoose");
const {enviarMail} = require("../utils/utils.js")

router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role').exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params;
    const uploadedFiles = req.files; 

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Procesar los archivos subidos y actualizar el usuario
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                user.documents.push({
                    name: file.originalname,
                    reference: '/uploads/documents/' + file.filename // Ruta donde se guarda el archivo
                });
            });

            // Actualizar el estado del usuario para indicar que ha subido documentos
            user.documents_uploaded = true;

            // Guardar los cambios en el usuario
            await user.save();
        }

        res.status(200).json({ message: 'Archivos subidos exitosamente', user });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/premium/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(uid);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.documents || user.documents.length !== 3) {
            return res.status(400).json({ error: 'El usuario no ha terminado de procesar su documentación' });
        }

        if (user.role === 'usuario') {
            user.role = 'premium';
            await user.save();
            return res.status(200).json({ message: `Rol cambiado a ${user.role}` });
        } else {
            return res.status(400).json({ error: 'El usuario ya es premium' });
        }
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/inactive', async (req, res) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    try {
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            await enviarMail(user.email, 'Cuenta eliminada por inactividad', 'Su cuenta ha sido eliminada debido a inactividad.');
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados.' });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;
