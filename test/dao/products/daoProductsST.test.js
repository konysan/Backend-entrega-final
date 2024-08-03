const { describe, it } = require("mocha");
const mongoose = require("mongoose");
const supertest = require("supertest-session");
const requester = supertest("http://localhost:8080");

let expect
describe("Pruebas al router Products", function () {
    this.timeout(8000)
    this.mockuser = {
        first_name: "test",
        last_name: "Test",
        email: "testTest@test.com",
        age: 55,
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
        let resultado = await mongoose.connection.collection("users").deleteMany({ email: "testTest@test.com" })
        console.log(resultado)
        resultado = await mongoose.connection.collection("products").deleteMany({ code: "EX123" })
        console.log(resultado)
    })

    it("La ruta /api/products con su metodo POST, permite crear un nuevo productos en la DB, siempre que exista un usuario valido logueado", async () => {

        let resultado = await requester.post("/api/sessions/registro").send(this.mockuser)
        console.log(resultado.body, resultado.status)
        resultado = await requester.post("/api/sessions/login").send(this.mockuser)
        console.log(resultado.body, resultado.status)


        let productMock = {
            "title": "Example Product",
            "description": "This is a description of the example product.",
            "code": "EX123",
            "price": 29.99,
            "status": "available",
            "stock": 100,
            "category": "Electronics",
            "thumbnails": [
                "http://example.com/thumbnail1.jpg",
                "http://example.com/thumbnail2.jpg"
            ],
            "owner": "admin"
        }
        resultado = await requester.post("/api/products").send(productMock)
        console.log(resultado.body);

        this.expect(resultado.body.payload._id).to.be.ok
        this.expect(mongoose.isValidObjectId(resultado.body.payload._id)).to.be.true
    });

})
