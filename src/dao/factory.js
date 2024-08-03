const config = require('./config/config');
export let DAO;

switch (config.PERSISTENCE) {
    case "MONGO": 
    DAO= (await import("./usersMongoDAO.js")).UsersMongoDAO;
        break;  

    case "FS": 
    DAO= (await import("./usersFSDAO.js")).UsersFSDAO;

        break;

    default:
        console.log(`No se ha encontrado el tipo de persistencia ${config.PERSISTENCE}`);
        process.exit()
        break;
}

