import test from 'node:test';
import assert from 'node:assert'
import wait from './wait.mjs';

import PausingTransform from '../pausing-transform.js'

test("basics", async (t) => {

	await t.test('paused and run', async (t) => {
		let final = new PausingTransform()
		let head = new PausingTransform()
		
		head.pipe(final)
		
		head.write('hello')
		
		assert.equal(final.pausedData, '', 'Paused data should be empty.')
		assert.equal(head.pausedData, 'hello', 'Paused data should be empty.')
		
		head.run()
		await wait(300)
		assert.equal(head.pausedData, '', 'Paused data should be empty.')
		assert.equal(final.pausedData, 'hello', 'Paused data should be empty.')
		

	})

	await t.test('transform', async (t) => {
		let final = new PausingTransform()
		let head = new PausingTransform(msg => msg.toUpperCase())
		
		head.pipe(final)
		
		head.write('hello')
		
		assert.equal(final.pausedData, '', 'Paused data should be empty.')
		assert.equal(head.pausedData, 'hello', 'Paused data should be empty.')
		
		head.run()
		await wait(300)
		assert.equal(head.pausedData, '', 'Paused data should be empty.')
		assert.equal(final.pausedData, 'HELLO', 'Paused data should be empty.')
	})

	await t.test('unpipe', async (t) => {
		let final = new PausingTransform()
		let head = new PausingTransform(msg => msg.toUpperCase())
		
		head.pipe(final)
		
		head.write('hello')
		
		assert.equal(final.pausedData, '', 'Paused data should be empty.')
		assert.equal(head.pausedData, 'hello', 'Final data does not match.')
		
		head.run()
		await wait(300)
		assert.equal(head.pausedData, '', 'Paused data should be empty.')
		assert.equal(final.pausedData, 'HELLO', 'Final data does not match.')
		
		head.unpipe()
		await wait(300)
		head.run()
		head.pipe(final)
		
		head.write('there')
		await wait(300)
		assert.equal(final.pausedData, 'HELLOTHERE', 'Final data does not match.')
	})
})