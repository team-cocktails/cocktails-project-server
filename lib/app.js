
const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');
// eslint-disable-next-line no-unused-vars
const { Client } = require('pg');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

// not a lot to say here--looks like a clean, straightforward CRUD API to me!
const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});
app.get('/cocktails', async (req, res) => {
  try {

    const data = await client.query('SELECT * from cocktails');

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const search = req.query.search;

    const data = await request.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_KEY}/search.php?s=${search}`);

    res.json(data.body);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = req.query.filter;
    const data = await request.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_KEY}/filter.php?i=${ingredients}`);

    res.json(data.body);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/details/:id', async (req, res) => {
  try {
    const drinkId = req.params.id;
    const data = await request.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_KEY}/lookup.php?i=${drinkId}`);

    res.json(data.body);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    // eslint-disable-next-line quotes
    const data = await client.query(`SELECT * FROM cocktails WHERE owner_id = $1`,
      [req.userId]
    );

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/menu/:id_drink', async (req, res) => {
  try {

    const data = await client.query('SELECT * from cocktails WHERE id_drink = $1 and owner_id = $2',
      [
        req.params.id_drink,
        req.userId,
      ]);

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/api/random', async (req, res) => {
  try {

    const data = await request.get(`https://www.thecocktaildb.com/api/json/v2/${process.env.COCKTAIL_KEY}/random.php`);

    res.json(data.body);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {

    const data = await client.query(`INSERT INTO cocktails (
      drink_name, 
      picture,
      category,
      id_drink,
      times_drank,
      owner_id)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,

    [
      req.body.drink_name,
      req.body.picture,
      req.body.category,
      req.body.id_drink,
      0,
      req.userId,
    ]);

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {

    const data = await client.query('DELETE from cocktails WHERE id = $1 and owner_id = $2',
      [
        req.params.id,
        req.userId,
      ]);

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    // nice parsing!
    const updatedTimesDrank = Number(req.body.times_drank) + 1;
    const data = await client.query(`UPDATE cocktails
    SET times_drank = $1 
    WHERE id= $2
      `,

    [
      updatedTimesDrank,
      req.params.id,
    ]);

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});





app.use(require('./middleware/error'));

module.exports = app;
