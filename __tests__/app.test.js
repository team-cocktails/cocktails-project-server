/* eslint-disable indent */
/* eslint-disable quotes */
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

    test('POST returns api/menu data', async() => {

      const newDrink = 
        {
          "drink_name": "New one again",
          "category": "classic",
          "times_drank": 0,
          "picture": "sfdfasdf",
          "id_drink": 12334,
          "owner_id": 2
      };
      const expectation = {
          "id": 3,
          "drink_name": "New one again",
          "category": "classic",
          "times_drank": 0,
          "picture": "sfdfasdf",
          "id_drink": 12334,
          "owner_id": 2
      };

      const data = await fakeRequest(app)
        .post('/api/menu')
        .send(newDrink)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual([expectation]);
    });


    test('PUT returns api/menu data', async() => {

      const newDrink = 
        {
          "times_drank": 0,
          "owner_id": 2
      };
      const expectation = [];

      const data = await fakeRequest(app)
        .put('/api/menu/3')
        .send(newDrink)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('GET returns api/menu data', async() => {

      const expectation = [
        {
          "id": 3,
          "drink_name": "New one again",
          "category": "classic",
          "times_drank": 1,
          "picture": "sfdfasdf",
          "id_drink": 12334,
          "owner_id": 2
      }
      ];

      const data = await fakeRequest(app)
        .get('/api/menu')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('GET returns api/menu data', async() => {

      const expectation = [
        {
          "drinks": [
              {
                  "idDrink": "11001",
                  "strDrink": "Old Fashioned",
                  "strDrinkAlternate": null,
                  "strTags": "IBA,Classic,Alcoholic,Expensive,Savory",
                  "strVideo": "https://www.youtube.com/watch?v=YsE_igrPXZs",
                  "strCategory": "Cocktail",
                  "strIBA": "Unforgettables",
                  "strAlcoholic": "Alcoholic",
                  "strGlass": "Old-fashioned glass",
                  "strInstructions": "Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water. Muddle until dissolved.\r\nFill the glass with ice cubes and add whiskey.\r\n\r\nGarnish with orange twist, and a cocktail cherry.",
                  "strInstructionsES": null,
                  "strInstructionsDE": "Zuckerwürfel in ein old fashioned Glas geben und mit Bitterstoff sättigen, einen Schuss Wasser hinzufügen. Vermischen, bis sie sich auflösen.",
                  "strInstructionsFR": null,
                  "strInstructionsIT": "Mettere la zolletta di zucchero nel bicchiere vecchio stile e saturare con il bitter, aggiungere un goccio di acqua naturale.\r\nPestare finché non si scioglie.\r\nRiempi il bicchiere con cubetti di ghiaccio e aggiungi il whisky.\r\nGuarnire con una scorza d'arancia e una ciliegina al maraschino.",
                  "strInstructionsZH-HANS": null,
                  "strInstructionsZH-HANT": null,
                  "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg",
                  "strIngredient1": "Bourbon",
                  "strIngredient2": "Angostura bitters",
                  "strIngredient3": "Sugar",
                  "strIngredient4": "Water",
                  "strIngredient5": null,
                  "strIngredient6": null,
                  "strIngredient7": null,
                  "strIngredient8": null,
                  "strIngredient9": null,
                  "strIngredient10": null,
                  "strIngredient11": null,
                  "strIngredient12": null,
                  "strIngredient13": null,
                  "strIngredient14": null,
                  "strIngredient15": null,
                  "strMeasure1": "4.5 cL",
                  "strMeasure2": "2 dashes",
                  "strMeasure3": "1 cube",
                  "strMeasure4": "dash",
                  "strMeasure5": null,
                  "strMeasure6": null,
                  "strMeasure7": null,
                  "strMeasure8": null,
                  "strMeasure9": null,
                  "strMeasure10": null,
                  "strMeasure11": null,
                  "strMeasure12": null,
                  "strMeasure13": null,
                  "strMeasure14": null,
                  "strMeasure15": null,
                  "strImageSource": "https://www.thecocktaildb.com/drink/11001-Old-Fashioned-Cocktail",
                  "strImageAttribution": "Dave M",
                  "strCreativeCommonsConfirmed": "Yes",
                  "dateModified": "2016-11-04 09:46:42"
              }
          ]
      }
    ];

      const data = await fakeRequest(app)
        .get('/api/search?search=old_fashioned')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect([data.body]).toEqual(expectation);
    });

    test('GET returns api/menu data', async() => {

      const expectation =
        {
          "strDrink": "Allegheny",
          "strDrinkThumb": "https://www.thecocktaildb.com/images/media/drink/uwvyts1483387934.jpg",
          "idDrink": "11021"
      };

      const data = await fakeRequest(app)
        .get('/api/ingredients?filter=bourbon')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.drinks[0]).toEqual(expectation);
    });
  });
});
