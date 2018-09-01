if (typeof global === 'undefined') {
	self.global = self
}

if (typeof require === 'function' && typeof fetch === 'undefined') {
    global.fetch = require('node-fetch')
}

if (global.atob === undefined) {
    global.atob = b64 => Buffer.from(b64, 'base64').toString()
}

if (typeof module === 'object') {
	global.path = require('path').posix
	global.fs   = require('fs').promises
}