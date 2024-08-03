const UsuariosMongoDAO = require('../dao/usersMongoDAO')

class UsuariosService{ 
    constructor(dao) {
        this.UsuariosDAO= dao
    }

    async getAllUsers() {
        return await this.UsuariosDAO.getAll()
    }

    async getUserEmail(email) {
        return await this.UsuariosDAO.getOneBy({email})
    }
    
    async createUser(usuario) {
        return await this.UsuariosDAO.create(usuario)
    }
    async getUserById(id) {
        return await this.UsuariosDAO.getOneBy({_id:id})
    }
    async getUserByNombre(nombre) {
        return await this.UsuariosDAO.getOneBy({nombre})
    }
}

const usuariosServices =  new UsuariosService(new UsuariosMongoDAO())

module.exports = usuariosServices