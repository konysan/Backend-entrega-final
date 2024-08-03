const { describe, it } = require("mocha");
const mongoose = require("mongoose");
const supertest = require("supertest-session");
const requester = supertest("http://localhost:8080");

let expect
describe("Pruebas al router Sessions", function () {
    this.timeout(8000)
    this.mockuser = {
        first_name: "Luka",
        last_name: "Didi",
        email: "Lukadidi@test.com",
        age: 57,
        password: "1234",
        role: "admin"
    }
    this.expect


    before(async () => {
        try {
            await mongoose.connect("mongodb+srv://konradmocken:konykony@cluster0.tg4ryzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerse");
            console.log("db conectada con exito.");
        } catch (error) {
            console.log(`error al conectar a DB: ${error}`);
        }

        const chai = await import('chai');
        this.expect = chai.expect;
    })

    after(async () => {
        await mongoose.connection.collection("users").deleteMany({ email: "Lukadidi@test.com" });
    });

    it("La ruta /api/sessions/registro permite dar de alta un usuario y redirecciona correctamente", async () => {
        let response = await requester.post("/api/sessions/registro").send(this.mockuser);
        console.log("Respuesta del registro:", response.body, response.status);

        response = await requester.post("/api/sessions/login").send(this.mockuser);
        console.log("Respuesta del login:", response.body, response.status);

        response = await requester.get("/api/sessions/current");
        console.log("Respuesta del current:", response.body, response.status);
    });
    
});
