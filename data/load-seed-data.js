const client = require('../lib/client');
// import our seed data:
const cocktails = require('./cocktails.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      cocktails.map(cocktail => {
        return client.query(`
                    INSERT INTO cocktails (
                      drink_name, 
                      category, 
                      ingredients1,
                      ingredients2,
                      ingredients3,
                      ingredients4,
                      ingredients5,
                      ingredients6,
                      ingredients7,
                      ingredients8,
                      ingredients9,
                      ingredients10,
                      ingredients11,
                      ingredients12,
                      ingredients13,
                      ingredients14,
                      ingredients15,   
                      measurements1,
                      measurements2,
                      measurements3,
                      measurements4,
                      measurements5,
                      measurements6,
                      measurements7,
                      measurements8,
                      measurements9,
                      measurements10,
                      measurements11,
                      measurements12,
                      measurements13,
                      measurements14,
                      measurements15,
                      instructions,
                      picture,
                      id_drink,
                      owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36);
                `,
        [cocktail.drink_name,
          cocktail.category,
          cocktail.ingredients1,
          cocktail.ingredients2,
          cocktail.ingredients3,
          cocktail.ingredients4,
          cocktail.ingredients5,
          cocktail.ingredients6,
          cocktail.ingredients7,
          cocktail.ingredients8,
          cocktail.ingredients9,
          cocktail.ingredients10,
          cocktail.ingredients11,
          cocktail.ingredients12,
          cocktail.ingredients13,
          cocktail.ingredients14,
          cocktail.ingredients15,   
          cocktail.measurements1,
          cocktail.measurements2,
          cocktail.measurements3,
          cocktail.measurements4,
          cocktail.measurements5,
          cocktail.measurements6,
          cocktail.measurements7,
          cocktail.measurements8,
          cocktail.measurements9,
          cocktail.measurements10,
          cocktail.measurements11,
          cocktail.measurements12,
          cocktail.measurements13,
          cocktail.measurements14,
          cocktail.measurements15,
          cocktail.instructions,
          cocktail.picture,
          cocktail.id_drink,
          user.id
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
