const { isValidObjectId } = require("mongoose");
const usuariosService = require("../services/UsuariosService");

class UsuariosController {
    static async getUsuarios(req, res) {
        try {
            let usuarios = await usuariosService.getAllUsers();
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ usuarios });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUsuarioById(req, res) {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese un id de MongoDB válido` });
        }

        try {
            let usuario = await usuariosService.getUserById(id);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ usuario });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        let { nombre, email } = req.body;
        if (!email) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `email es requerido` });
        }

        try {
            let existe = await usuariosService.getUserEmail(email);
            if (existe) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ya existe un usuarios con email ${email}` });
            }

            let nuevoUsuario = await usuariosService.createUser({ nombre, email });
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ nuevoUsuario });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            });
        }
    }
}

module.exports = UsuariosController;
