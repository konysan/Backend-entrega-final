const express = require('express');
const router = express.Router();
const User = require('../dao/models/usersModels.js');
const auth = require('../middlewares/auth.js');

router.post('/:uid/role', auth(['admin']), async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: 'Rol actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:uid', auth(['admin']), async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
