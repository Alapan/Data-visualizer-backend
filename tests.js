const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./server');

chai.use(chaiHttp);

describe('tests all APIs', () => {
    it('tests the data returned from the area API', (done) => {
        chai.request(server)
        .get('/areas')
        .end((err, res) => {
            if (err) throw err;
            expect(JSON.stringify(res.body)).to.equal(JSON.stringify(
                [
                    {
                        id: 1,
                        name: 'Cholesterols',
                        frequencies: [-0.6, 0.2]
                    },
                    {
                        id: 2,
                        name: 'Apolipoproteins',
                        frequencies: [5.0, 5.5]
                    },
                    {
                        id: 3,
                        name: 'Fatty acids',
                        frequencies: [6.5, 8.5]
                    }
                ]
            ));
            done();
        });
    });

    it('tests the spectrum data for a valid area ID', (done) => {
        chai.request(server)
        .get('/spectrum/1')
        .end((err, res) => {
            if (err) throw err;
            const xValues = res.body.map((coordinate) => coordinate.x).sort();
            expect(xValues[0]).to.be.at.least(-0.6);
            expect(xValues[xValues.length - 1]).to.be.at.most(0.2);
            done();
        });
    });

    it('tests the spectrum data for an invalid area ID', (done) => {
        chai.request(server)
        .get('/spectrum/-1')
        .end((err, res) => {
            if (err) throw err;
            expect(res.body).to.have.lengthOf(0);
            done();
        });
    });
});
