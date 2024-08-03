const express = require('express');
const router = express.Router();
const usersManager = require('../dao/usersMongoDAO.js');
const UserDTO = require('../dto/UserDTO.js');
const jwt = require ('jsonwebtoken')
const bcrypt = require ('bcrypt')

const passport = require('passport')
const User = require('../dao/models/usersModels.js');
const config  = require('../config/config.js')
const { enviarMail } = require('../utils/utils.js');
let usuariosManager= new usersManager()

router.get("/errorGitHub", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar con GitHub`
        }
    )
    
})

router.get('/errorRegistro', (req, res)=> {
    return res.redirect('registro?error=Error en el proceso de registro')
})

router.post('/registro', passport.authenticate("registro", { failureRedirect: "/api/sessions/errorRegistro" }), async(req, res) => {
    if (req.user) {
        const fullName = `${req.user.first_name} ${req.user.last_name}`;
        return res.redirect(`/registro?mensaje=Registro exitoso para ${fullName}`);
    } else {
        return res.redirect('/api/sessions/errorRegistro');
    }
});

router.get("/errorLogin", (req, res)=>{
    return res.status(400).json({error:`Error en el proceso de login... :(`})
})

router.post('/login', passport.authenticate("login", {failureRedirect:"/api/sessions/errorLogin"}), async(req,res)=>{

    let usuario=req.user
    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario

    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Login correcto", usuario
    })
})

router.get("/github", passport.authenticate("github", {}), (req, res) => {})

router.get('/callbackGithub', passport.authenticate("github", {failureRedirect:"/api/sessions/errorGitHub"}), (req,res)=>{

    req.session.usuario=req.user
    return res.redirect('/perfil');
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({
        payload:"Login correcto", 
        usuario:req.user
        
    });
})

router.post("/recoverpsw01", async(req, res) => {
    let {email} = req.body
    if(!email) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`Complete email`})
    }
    let usuario = await User.findOne({email}).lean()
    if(!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error:`No existe usuario!!`})
    }
    delete usuario.password 
    let token = jwt.sign(usuario, config.SECRET, {expiresIn:"1h"})
    let url = `http://localhost:8080/api/sessions/recoverpsw02?token=${token}`
    let mensaje = `Ha solicitado reinicio de password. Si no fue usted, avise al admin. Para continuar haga click <a href="${url}">aqui</a>`

    try {
        await enviarMail (email, "Recuper de password", mensaje)
        res.redirect("/recoverpsw01.html?mensaje=Recibira un email en breve. Siga los pasos...")

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

router.get("/recoverpsw02", (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, config.SECRET);
        res.redirect(`/recoverpsw02.html?token=${token}`);
    } catch (error) {
        res.status(400).json({ error: "Token inválido o expirado" });
    }
});

router.post("/recoverpsw03", async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Token es requerido" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    try {
        const decoded = jwt.verify(token, config.SECRET);
        const userId = decoded._id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const updateResult = await User.updateOne({ _id: userId }, { password: hashedPassword });

        if (updateResult.nModified === 0) {
            return res.status(400).json({ error: "Usuario no encontrado para actualizar contraseña" });
        }

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(400).json({ error: "Token inválido o expirado" });
    }
});

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UserDTO(req.user);
        return res.json({ user: userDTO });
    } else {
        return res.status(401).json({ error: "No hay usuario autenticado." });
    }
});

router.get('/logout',(req,res)=>{

    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${e.message}`
                }
            )
            
        }
    })
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Logout exitoso"
    });
});


module.exports = router;