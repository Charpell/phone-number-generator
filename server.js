const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const randomatic = require('randomatic')
const fs = require('fs');

// const phoneNumbers = require('./Numbers')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Get All existing Phone numbers
 *
 *  @param {any} req
 *  @param {any} res
 *
 */
app.get('/api/hello', (req, res) => {
  try {
    const phoneNumberString = fs.readFileSync('numbers.json', 'utf8')
    const phoneNumbers = JSON.parse(phoneNumberString)
    res.send({ data: phoneNumbers });
  } catch (error) {
    console.log('error', error)
    return false
  }
});


/**
 * Creates new unique numbers
 *
 *  @param {any} req
 *  @param {any} res
 *
 */
app.post('/api/world', (req, res) => {
  console.log(req.body);
  const { post } = req.body;

  const numberToGenerate = Number(post)

  if(!numberToGenerate || numberToGenerate < 1 || isNaN(numberToGenerate)) {
    return res.status(400).send({ message: 'Please enter a number greater than 0 '})
  }

  if (numberToGenerate > 50) {
    return res.status(400).send({ message: "You can't generate more than 50 numbers at a time "})
  }

  let result;
  let phoneNumbers;

  try {
    const phoneNumberString = fs.readFileSync('numbers.json', 'utf8')
    phoneNumbers = JSON.parse(phoneNumberString)
    result = generateNumber(phoneNumbers, post)
  } catch (error) {
    console.log('error', error)
    return false
  }



  result.map(number => {
    phoneNumbers.push(number)
  })

  try {
    fs.writeFileSync('numbers.json', JSON.stringify(phoneNumbers))
  } catch (err) {
    console.error(err)
  }

  res.send({ data: phoneNumbers });
});


/**
 * Helper generates random phone numbers
 *
 *  @param {any} req
 *  @param {any} res
 *  @param {array} numbers
 *
 */
const generateNumber = (existingNumbers, numbers) => {

 const generatedNumbers = [];

 for (let i = 1; i <= numbers; i++) {
  const newNumber = `0${randomatic('0', 9)}`;
  generatedNumbers.push(newNumber)
 }

 return generatedNumbers.filter(number => existingNumbers.indexOf(number) === -1)
}



if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
