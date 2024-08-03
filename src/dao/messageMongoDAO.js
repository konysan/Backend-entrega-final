const Message = require('./models/messageModels.js');

class MessageManager {
    constructor() {
        
    }

    async addMessage(messageData) {
        try {
            return await Message.create(messageData);
        } catch (error) {
            console.error('Error al agregar mensaje:', error);
            throw error;
        }
    }

    async getAllMessages() {
        try {
            return await Message.find({});
        } catch (error) {
            console.error('Error al obtener todos los mensajes:', error);
            throw error;
        }
    }

}

module.exports = MessageManager;
