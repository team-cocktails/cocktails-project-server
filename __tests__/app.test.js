require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns cocktails', async() => {

      const expectation = [
        {
          drink_name: 'mojito',
          category: 'traditional highball',
          ingredients1: 'rum',
          ingredients2: 'mint',
          ingredients3: 'lime',
          ingredients4: 'sugar',
          ingredients5: 'ice',
          ingredients6: 'soda water',
          ingredients7: null,
          ingredients8: null,
          ingredients9: null,
          ingredients10: null,
          ingredients11: null,
          ingredients12: null,
          ingredients13: null,
          ingredients14: null,
          ingredients15: null,
          measurements1: '2 oz rum',
          measurements2: '2 sprigs of mint',
          measurements3: 'juice of 1 lime',
          measurements4: '2 tea spoons of sugar',
          measurements5: null,
          measurements6: null,
          measurements7: null,
          measurements8: null,
          measurements9: null,
          measurements10: null,
          measurements11: null,
          measurements12: null,
          measurements13: null,
          measurements14: null,
          measurements15: null,
          instructions: 'mix your drink',
          picture: 'https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg',
          id_drink: 1,
          id: 1,
          owner_id: 1,
        },
        {
          drink_name: 'old fashioned',
          category: 'classic',
          ingredients1: 'bourbon',
          ingredients2: 'bitters',
          ingredients3: 'cherry',
          ingredients4: 'orange',
          ingredients5: null,
          ingredients6: null,
          ingredients7: null,
          ingredients8: null,
          ingredients9: null,
          ingredients10: null,
          ingredients11: null,
          ingredients12: null,
          ingredients13: null,
          ingredients14: null,
          ingredients15: null,
          measurements1: '2 oz bourbon',
          measurements2: '2 dashes of bitters',
          measurements3: '1 cherry',
          measurements4: '1 orange slice',
          measurements5: null,
          measurements6: null,
          measurements7: null,
          measurements8: null,
          measurements9: null,
          measurements10: null,
          measurements11: null,
          measurements12: null,
          measurements13: null,
          measurements14: null,
          measurements15: null,
          instructions: 'mix your drink with vigor',
          picture: 'https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg',
          id_drink: 2,
          id: 2,
          owner_id: 1,
        }
      ];

      const data = await fakeRequest(app)
        .get('/cocktails')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
