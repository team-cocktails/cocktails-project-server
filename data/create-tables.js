const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE cocktails (
                    id SERIAL PRIMARY KEY NOT NULL,
                    drink_name VARCHAR(512) NOT NULL,
                    category VARCHAR(512) NOT NULL,
                    ingredients1 TEXT NOT NULL,
                    ingredients2 TEXT,
                    ingredients3 TEXT,
                    ingredients4 TEXT,
                    ingredients5 TEXT,
                    ingredients6 TEXT,
                    ingredients7 TEXT,
                    ingredients8 TEXT,
                    ingredients9 TEXT,
                    ingredients10 TEXT,
                    ingredients11 TEXT,
                    ingredients12 TEXT,
                    ingredients13 TEXT,
                    ingredients14 TEXT,
                    ingredients15 TEXT,
                    measurements1 TEXT NOT NULL,
                    measurements2 TEXT,
                    measurements3 TEXT,
                    measurements4 TEXT,
                    measurements5 TEXT,
                    measurements6 TEXT,
                    measurements7 TEXT,
                    measurements8 TEXT,
                    measurements9 TEXT,
                    measurements10 TEXT,
                    measurements11 TEXT,
                    measurements12 TEXT,
                    measurements13 TEXT,
                    measurements14 TEXT,
                    measurements15 TEXT,
                    times_drank INTEGER NOT NULL,
                    instructions TEXT NOT NULL,
                    picture TEXT NOT NULL,
                    id_drink INTEGER NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
