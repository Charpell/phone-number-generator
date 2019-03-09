
const request = require('supertest');
const mock = require('mock-fs');
const util = require('util')
const app = require('../app.js');
const fs = require('fs')

const { generateNumber } = require('../helpers/index.js')

jest.mock('fs')


beforeEach(() => {
	jest.resetModules()
})

describe('NumberController GET', () => {
	it('should return 200 and existing numbers when they exist', async () => {
		fs.readFileSync.mockImplementationOnce(
			require.requireActual('fs').readFileSync
		)

		const result = await request(app).get('/api/number')

		expect(result.status).toBe(200)
	})

	it('throw 500 when the data cannot be found', async () => {
		jest.doMock('fs', () => {
			return {}
		})
		const result = await request(app).get('/api/number')

		expect(result.status).toBe(500)
	})

})



describe('NumberController POST', () => {
	it('should return 400 if there is no number', async () => {

		const result = await request(app).post('/api/number')

		expect(result.status).toBe(400)
		expect(result.body).toEqual({message: 'Please enter a number greater than 0'})

	})

	it('should return 400 if number is 0', async () => {

		const result = await request(app).post('/api/number')
			.send({ post: 0 })

		expect(result.status).toBe(400)
		expect(result.body).toEqual({message: 'Please enter a number greater than 0'})

	})

	it('should return 400 if a number is not sent', async () => {

		const result = await request(app).post('/api/number')
			.send({ post: 'astring' })

		expect(result.status).toBe(400)
		expect(result.body).toEqual({message: 'Please enter a number greater than 0'})

	})

	it('should return 400 if the numbers to generate is more than 50', async () => {

		const result = await request(app).post('/api/number')
			.send({ post: 51 })

		expect(result.status).toBe(400)
		expect(result.body).toEqual({message: 'You can\'t generate more than 50 numbers at a time'})

	})

	it('should return 201 if the numbers were generated', async () => {
		fs.readFileSync.mockImplementationOnce(
			require.requireActual('fs').readFileSync
		)

		const result = await request(app).post('/api/number')
			.send({ post: 10 })

		expect(result.status).toBe(201)

	})
})



describe('Generated Number Helper function', () => {
	it('should generate a number', () => {
		const result = generateNumber([], 3);
		expect(result.length).toBe(3)
	})
})