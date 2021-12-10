let server = require('../src/server');
let chai = require('chai');
let chaiHttp = require('chai-http');

// Assertion
chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('Server!', () => {
  it('It should GET review page', (done) => {
    chai
      .request(server)
      .get('/reviews')
      .end((err, response) => {
        expect(response.body).to.be.an('object');
        expect(response).to.have.status(200);
        done();
      });
  });
});

describe('Server!', () => {
  it('It should GET home page', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, response) => {
        expect(response.body).to.be.an('object');
        expect(response).to.have.status(200);
        done();
      });
  });
});
//   it('It should error for numbers', (done) => {
//     chai
//       .request(server)
//       .post('/upper')
//       .send({val: 1})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
        
//         done();
//       });
//   });





