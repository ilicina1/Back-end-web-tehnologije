let expect = require('chai').expect;
var chai = require("chai");

chai.use(require("chai-sorted"));	

let broj = 20;
let istina = true;
let rijec = 'Proba';
let niz = ['Sarajevo', 'Tuzla', 'Mostar', 'Zenica'];
let objekat = {
    knjige: ['Pro Git', 'From Mathematics to Generic Programming', 'Managing Data Using Excel', 'The Elements of Style'],
    cijene: [11, 33, 42, 45]
};


// Ovdje cu objasniti zasto 
// expect([1, 2, 3]).to.equal([1, 2, 3]); pada, a zasto
// expect([1, 2, 3]).to.eql([1, 2, 3]); prolazi
// Razlog je sto .equal() vraca true ako usporedjujemo potpuno isti objekt sa sobom,
// dok .eql() provjerava da li je vrijednost jednaka;


describe('Testiranje varijabli', function () {
 
    it('Postoji varijabla "broj"', function () {
        expect(broj).to.exist;
    });

    it('Varijabla broj ima vrijednost: 20', function () {
        expect(broj).to.equal(20);
    });

    it('Varijabla broj ima vrijednost: true', function () {
        expect(istina).to.equal(true);
    });


    it('Varijabla rijec je tipa: string', function () {
        expect(rijec).to.be.a('string');
    });

    it('Varijabla rijec ima duzinu: 5', function () {
        expect(rijec).to.have.lengthOf(5);
    });
 
    it('Varijabla niz nije prazna', function () {
        expect(niz).to.have.length.above(0);
    });
 
    it('Varijabla niz sadrzi clanove "Sarajevo" i "Mostar"', function () {
        expect(niz).to.contain("Sarajevo");
        expect(niz).to.contain("Mostar");
    });

    it('Varijabla niz ima duzinu barem 4', function () {
        expect(niz).to.have.length.above(3);
    });

    it('Varijabla objekat u sebi sadrži niz knjige dužine 4', function () {
        expect(objekat).to.have.nested.property('knjige').with.lengthOf(4);
    });

    it('Varijabla cijene unutar objekta objekat je sortirani niz', function () {
        expect(objekat).to.have.nested.property('cijene').that.is.sorted();
    });
});
