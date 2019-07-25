const { Transform, Writeable } = require('stream');

class PausingTransform extends Transform {
	constructor(transformer) {
		super()
		this.pausedData = ''
		this.paused = true
		this.transformer = transformer
	}
	_transform(chunk, encoding, callback) {
		return callback(null, this.transformer ? this.transformer(chunk.toString()) : chunk)
	}
	_flush(callback) {
		if(this.pausedData) {
			let ret = super.write(this.pausedData, null, () => {
				this.pausedData = ''
				if(callback) {
					return callback()
				}
			})
		}
		else if(callback) {
			callback()
		}
	}
	write(chunk, encoding, callback) {
		if(this.paused) {
			this.pausedData += chunk.toString()
			if(callback) {
				callback()
			}
		}
		else {
			return super.write(chunk, encoding, callback)
		}
	}
	pause() {
		this.paused = true
	}
	run() {
		this.paused = false
		this._flush()
	}
	end() {
		if(this.pausedData) {
			this._flush(() => {
				super.end()
			})
		}
		else {
			super.end()
		}
	}
}

module.exports = PausingTransform