export function renderEmojiIntoCanvas(emoji) {
	var canvas = document.createElement('canvas')
	var context = canvas.getContext('2d')
	canvas.width = 55
	canvas.height = 53
	context.font = '40px'
	context.fillText(emoji, 0, 40)
	return canvas
}

export function getEmojis(string) {
	// this is naive crap
	return getCodePoints(string)
		.filter(isCodePoint)
		.filter(isEmoji)
		.map(codePoint => String.fromCodePoint(codePoint))
}


function getCodePoints(string) {
	var codePoints = []
	for (var i = 0; i < string.length; i++)
		codePoints.push(string.codePointAt(i))
	return codePoints
}

function isNormalCharacter(charCode) {
	return charCode < 0xD800 || charCode > 0xDFFF
}

function isHighSurrogate(charCode) {
	console.log('getEmojis', charCode, charCode.toString(16))
	return charCode >= 0xD800 && charCode <= 0xDBFF
}

function isLowSurrogate(charCode) {
	return charCode >= 0xDC00 && charCode <= 0xDFFF
}

function isCodePoint(charCode) {
	// this is naive crap
	return charCode >= 0xFFFF
}

function isEmoji(codePoint) {
	return true // todo
}
