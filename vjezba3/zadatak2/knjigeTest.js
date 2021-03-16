let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let should = require("chai").should();
const server = require("./knjige.js");

describe("testiranje GET na /", function () {
  beforeEach(function (done) {
    fs = require("fs");
    fs.writeFile("./knjige.txt", "Pro Git,33,meki uvez,4.16", function () {});
    done();
  });

  afterEach(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("GET / ce dohvatiti sve knjige", function (done) {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200); //odgovor treba imati status 200
        res.body.should.be.a("array"); //u odgovoru treba biti neki niz
        res.body.length.should.be.eql(1); //duzina odgovora treba biti 1
        done();
      });
  });
});

describe("testiranje POST na /", function () {
  it("POST / ce dodati novu knjigu", function (done) {
    let knjiga = {
      naslov: "From Mathematics to Generic Programming",
      cijena: 42,
      tip: "eKnjiga",
      ocjena: 4.15,
    };
    chai
      .request(server)
      .post("/")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(knjiga)
      .end(function (err, res) {
        res.should.have.status(200); //odgovor treba imati status 200
        should.not.exist(err); //ne bi trebalo biti gresaka
        done();
      });
  });
});

describe("Testiranje DELETE na /", function () {
  beforeEach(function (done) {
    fs = require("fs");
    fs.writeFile("./knjige.txt", "Pro Git,33,meki uvez,4.16", function () {});
    done();
  });

  afterEach(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("Treba vratiti status 200 nakon DELETE", function (done) {
    chai
      .request(server)
      .delete("/")
      .end(function (err, res) {
        res.should.have.status(200);
        should.not.exist(err); //ne bi trebalo biti gresaka
        done();
      });
  });
});

describe("Testiranje PUT na /", function () {
  beforeEach(function (done) {
    fs = require("fs");
    fs.writeFile("./knjige.txt", "Pro Git,33,meki uvez,4.16", function () {});
    done();
  });

  afterEach(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("Treba vratiti status 200 nakon PUT", function (done) {
    chai
      .request(server)
      .put("/")
      .send({ naslov: "Novi naslov" })
      .end(function (err, res) {
        res.should.have.status(200);
        should.not.exist(err); //ne bi trebalo biti gresaka
        done();
      });
  });
});
