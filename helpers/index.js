const randomatic = require('randomatic')

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


module.exports = {
	generateNumber
}