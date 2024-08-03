const config = require("../../../src/config/config");
const UsuariosMongoDAO = require("../../../src/dao/usersMongoDAO");
const mongoose = require("mongoose");

let expect;

describe("Pruebas al DAO de Users usando Chai", function() {
    this.timeout(8000); 

    let usuariosMongoDAO;

    before(async function() {
        const chai = await import('chai');
        expect = chai.expect;
        // try {
        //     await mongoose.connect("mongodb+srv://konradmocken:konykony@cluster0.tg4ryzm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true
        //     });
        // } catch (error) {
        //     console.error(error.message);
        //     process.exit(1);
        // }

        usuariosMongoDAO = new UsuariosMongoDAO();
    });

    beforeEach(async function() {
        let resultado=await mongoose.connection.collection("users").deleteMany({ email: "luisrios@test.com" });
        console.log(resultado)
    });

    it("El método getAll del DAO retorna un arreglo de usuarios", async function() {
        let resultado = await usuariosMongoDAO.getAll();

        expect(Array.isArray(resultado)).to.be.equal(true);
        expect(resultado).to.be.an('array');

        if (Array.isArray(resultado) && resultado.length > 0) {
            expect(resultado[0]._id).to.exist;
            expect(resultado[0]).to.have.property("_id");
            expect(resultado[0]).to.have.property("email");
            expect(resultado[0]).to.have.property("email").that.is.a('string');
        }
    });

    it('El método create permite grabar un user en DB', async function() {
        let mockUser = {
            first_name: "luis",
            last_name: "rios",
            email: "luisrios@test.com",
            password: "123456",
            age: 29,
            role: "user"
        };

        let resultado = await mongoose.connection.collection("users").findOne({ email: "luisrios@test.com" });

        expect(resultado).to.be.equal(null);
        expect(resultado).to.be.null;

        resultado = await usuariosMongoDAO.create(mockUser);

        expect(resultado._id).to.exist;
        expect(resultado._id).to.be.ok;
        expect(resultado.toJSON()).to.haveOwnProperty("_id");
    });
});
