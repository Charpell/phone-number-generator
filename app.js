const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const { generateNumber } = require('./helpers/index.js')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Get All existing Phone numbers
 *
 *  @param {any} req
 *  @param {any} res
 *
 */
app.get('/api/number', (req, res) => {
  try {
    const phoneNumberString = fs.readFileSync('numbers.json', 'utf8')

    const phoneNumbers = JSON.parse(phoneNumberString)
    res.status(200).send({ data: phoneNumbers });
  } catch (error) {
    res.status(500).send(error)
  }
});


/**
 * Creates new unique numbers
 *
 *  @param {any} req
 *  @param {any} res
 *
 */
app.post('/api/number', (req, res) => {
  const { post } = req.body;

  const numberToGenerate = Number(post)

  if(!numberToGenerate || numberToGenerate < 1 || isNaN(numberToGenerate)) {
    return res.status(400).send({ message: 'Please enter a number greater than 0'})
  }

  if (numberToGenerate > 50) {
    return res.status(400).send({ message: "You can't generate more than 50 numbers at a time"})
  }

  let result;
  let phoneNumbers;

  const phoneNumberString = fs.readFileSync('numbers.json', 'utf8')
  phoneNumbers = JSON.parse(phoneNumberString)
  result = generateNumber(phoneNumbers, post)

  result.map(number => {
    phoneNumbers.push(number)
  })

  fs.writeFileSync('numbers.json', JSON.stringify(phoneNumbers))


  res.status(201).send({ data: phoneNumbers });
});





if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

module.exports = app;