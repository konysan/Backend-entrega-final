const { describe, it } = require("mocha");
const mongoose = require("mongoose");
const supertest = require("supertest-session");

const requester = supertest("http://localhost:8080");

describe("Pruebas al router Carts", function () {
    this.timeout(8000);
    this.mockuser = {
        first_name: "test",
        last_name: "Cart",
        email: "testCart@test.com",
        age: 46,
        password: "1234",
        role: "usuario"
    };

    before(async () => {
        try {
            await mongoose.connect("mongodb+srv://konradmocken:konykony@cluster0.tg4ryzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerse");
            console.log("Conexión a la DB establecida con éxito.");
        } catch (error) {
            console.log(`Error al conectar a DB: ${error}`);
        }

        let response = await requester.post("/api/sessions/registro").send(this.mockuser);
        console.log("Registro:", response.body, response.status);

        response = await requester.post("/api/sessions/login").send(this.mockuser);
        console.log("Login:", response.body, response.status);
    });

    after(async () => {
        
        await mongoose.connection.collection("users").deleteMany({ email: "testCart@test.com" });
        console.log("Datos de usuario eliminados de la DB.");

    });

    it("La ruta /api/carts con su método POST permite crear un nuevo carrito en la DB", async () => {
       
        let response = await requester.post("/api/sessions/registro").send(this.mockuser);
        console.log("Registro:", response.body, response.status);

        response = await requester.post("/api/sessions/login").send(this.mockuser);
        console.log("Login:", response.body, response.status);

        response = await requester.post("/api/carts").send({});
        console.log("Respuesta del POST /api/carts:", response.body, response.status);

        if (response.status !== 201) {
            throw new Error(`Se esperaba un status 201 pero se recibió ${response.status}`);
        }

        if (!response.body || !response.body._id) {
            throw new Error("La respuesta esperada debe contener un _id del carrito creado.");
        }
    });

    it("La ruta /api/carts/:cid con su método GET permite obtener un carrito por su ID", async () => {
        const cartId = "6693fe2082956f4b84dd5bc3"; 

        let response = await requester.get(`/api/carts/${cartId}`);
        console.log(`Respuesta del GET /api/carts/${cartId}:`, response.body, response.status);

        if (response.status !== 200) {
            throw new Error(`Se esperaba un status 200 pero se recibió ${response.status}`);
        }

        if (!response.body || response.body.error) {
            throw new Error("La respuesta esperada no debe contener un error.");
        }
    });
});