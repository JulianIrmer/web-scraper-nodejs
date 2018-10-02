const express = require('express');
const mongojs = require('mongojs');
const DB_URL = 'mongodb://Holly:ikou05667@ds123614.mlab.com:23614/hollydb';
const fetch = require('node-fetch');
const cheerio = require('cheerio');
// const cors = require('cors');
let restaurants = [];
const port = 5000;

const app = express();
app.use(express.static('public'));
app.use(express.json());

//connect to mongodb
const db = mongojs(DB_URL, ['restaurants']);

db.on('connect', (err) => {
  if (err) {
    console.log('database error', err);
  } else {
    console.log('database connected');
  }
});

function getRestaurants() {
  const url = 'https://www.menuwithprice.com/menu-and-price/';
  let id = 0;
  fetch(url)
    .then(response => response.text())
    .then(body => {
      $ = cheerio.load(body);

      $('.menu-list.category-menu li').each((i, item) => {
        const $item = $(item);
        const name = $item.find('a').text();
        const url2 = $item.find('a').attr('href');
        const restaurant = {
          id: id,
          name: name,
          url: url2,
          location: undefined,
          menu: []
        };
        restaurants.push(restaurant);
        id++;
      });
    })
    .then(body => {
      for (let r of restaurants) {
        fetch(r.url)
          .then(response => response.text())
          .then(body => {
            $ = cheerio.load(body);
            $('.cuisine.cuisine_list').each((i, item) => {
              const $item = $(item);
              let location = $item.find('a').text();
              let temp = [];
              while (location.length) {
                temp.push(location.substr(0, 2));
                location = location.substr(2);
              }
              r.location = temp;
            });
          });
      }
    })
    .then(body => {
      let temp = [];
      for (let r of restaurants) {
        fetch(r.url)
          .then(response => response.text())
          .then(body => {
            $ = cheerio.load(body);
            $('.prc-table td:first-child').each((i, item) => {
              const $item = $(item);
              let category = $item.text().toLowerCase();
              temp.push(category);
            });
            r.menu = temp;
            temp = [];
            db.restaurants.save(r);
            console.log('saved '+r.name);
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
}

app.get('/search/:food', (req, res) => {
  
  // console.log(req.params.food);

    db.restaurants.find((err, docs) => {
      let results = [];
      if(err){
        console.log('database error', err);
      }
      else{
        if(docs.length < 1){
          res.send('No data');
        }
        else{
          for(let i = 0; i < docs.length; i++){
            for(let j = 0; j < docs[i].menu.length; j++){
              if(docs[i].menu[j].includes(req.params.food)){
                results.push(docs[i]);
                docs.splice(i, 1);
              }
            }
          }
        }
        results.sort((a, b) => a.name.localeCompare(b.name));
        res.json(results);
      }        
    });
});

// Fill Database with restaurants
// getRestaurants();


// Start server on port xyz
app.listen(port, () => {
  console.log('server listening on ' + port);
});