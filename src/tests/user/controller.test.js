const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../build/app.js");

chai.use(chaiHttp);
const expect = chai.expect;

const user = {
  firstName: "user1",
  lastName: "lastName",
  email: "diractech211@gmail.com",
  password: "secret_password",
};

describe("Signup", () => {
  it("it should sign up a new user", (done) => {
    chai
      .request(app)
      .post("/api/signup")
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        done();
      });
  });
});

describe("Login", () => {
  it("it should log the user in", (done) => {
    chai
      .request(app)
      .post("/api/v1/user/auth/local/login")
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
