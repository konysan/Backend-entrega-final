const UserDTO = require("../dto/UserDTO");

const auth = (roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "No hay usuario autenticado." });
        }
        const userDTO = new UserDTO(req.user);

        if (roles && !roles.includes(userDTO.role)) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este recurso." });
        }

        req.userDTO = userDTO;  
        next();
    };
};

module.exports = auth;
