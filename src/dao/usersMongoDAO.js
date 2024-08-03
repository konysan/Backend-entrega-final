const  usersModels  = require('./models/usersModels.js')  

    class UsuariosMongoDAO {

        async getAll(){
            return await usersModels.find().lean()
        }

        async create(usuario){
            return await usersModels.create(usuario)
        }

        async getOneBy(filtro={}){   // {email}
            return await usersModels.findOne(filtro)
        } 

    }


module.exports = UsuariosMongoDAO