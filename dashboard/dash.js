// TODO: try to extract image from the project as well


class Color {

	static _extractRgb(args) {
		if (args.length === 1) {
			return args[0]
		} else {
			var [r, g, b] = args
			return {r, g, b}
		}
	}

	static rgbToHex(...args) {
		var {r, g, b} = this._extractRgb(args)
	    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	static foreground(...args) {
		var {r, g, b} = this._extractRgb(args)
		var luminance = this.luminance(r, g, b)
		console.log(r,g,b, luminance)
		if (luminance < 140)
			r = g = b = 255
		else
			r = g = b = 0
		return {r, g, b}
	}

	static luminance(...args) {
		var {r, g, b} = this._extractRgb(args)
		return (0.2126 * r + 0.7152 * g + 0.0722 * b)
	}

	static isBlack(...args) {
		var {r, g, b} = this._extractRgb(args)
		return r === 0 && g === 0 && b === 0
	}

	static isWhite(...args) {
		var {r, g, b} = this._extractRgb(args)
		return r === 255 && g === 255 && b === 255
	}

	// COLOR EXTRACTION

	static accentAverage(canvas) {
		var blockSize = 1
		var context = canvas.getContext('2d')
		var output = {r: 0, g: 0, b: 0}
		var count = 0

		var {data} = context.getImageData(0, 0, canvas.width, canvas.height)
		
		for (var i = 0; i < data.length; i += 4) {
			let alpha = data[i + 3]
			// ignore transparent alpha
			if (data[i+3] === 0) continue
			let r = data[i]
			let g = data[i + 1]
			let b = data[i + 2]
			// ignore black
			if (r === 0 && g === 0 && b === 0) continue
			// ignore white
			if (r === 255 && g === 255 && b === 255) continue
			++count
			output.r += r
			output.g += g
			output.b += b
		}
		
		// ~~ used to floor values
		output.r = ~~(output.r / count)
		output.g = ~~(output.g / count)
		output.b = ~~(output.b / count)
		
		return output	
	}

}



//renderEmoji('📦')
//renderProject(projects[8])
projects.forEach(renderProject)


function renderProject(project) {
	var {name, description} = project
	project.emojis = getEmojis(description)
	project.emoji = project.emojis[0]
/*
	console.log(description)
	console.log(emojis)
	console.log(emojis[0])
	console.log('🗑️')
	console.log(emojis[0].charCodeAt(0))
	console.log('🗑️'.charCodeAt(0))
	console.log(emojis[0].codePointAt(0))
	console.log('🗑️'.codePointAt(0))
	console.log(String.fromCodePoint(emojis[0].codePointAt(0)))
	console.log(String.fromCodePoint('🗑️'.codePointAt(0)))
*/

	if (project.emojis.length) {
		var canvas = renderEmojiIntoCanvas(project.emojis[0])
		//document.body.appendChild(canvas)
		//return
		project.accent = Color.accentAverage(canvas)
		if (!Color.isWhite(project.accent) && !Color.isBlack(project.accent)) {
			project.background = project.accent
			project.foreground = Color.foreground(project.background)
		}
	}

	renderProjectCard(project)
}


function renderEmojiIntoCanvas(emoji) {
	var canvas = document.createElement('canvas')
	var context = canvas.getContext('2d')
	canvas.width = 55
	canvas.height = 53
	context.font = '40px Segoe UI'
	context.fillText(emoji, 0, 40)
	return canvas
}




function getEmojis(string) {
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


function renderProjectCard(project) {
	var {name, description, background, foreground, accent} = project
	var cardHtml = `
		<div class="card">
			<p class="name">${name}</p>
			<p class="description">${description}</p>
			<span class="emoji">${project.emoji || ''}</span>
		</div>
	`

	var $card = getDomFromString(cardHtml)

	if (foreground && background) {
		$card.style.setProperty('--foreground-r', foreground.r)
		$card.style.setProperty('--foreground-g', foreground.g)
		$card.style.setProperty('--foreground-b', foreground.b)
		$card.style.setProperty('--background-r', background.r)
		$card.style.setProperty('--background-g', background.g)
		$card.style.setProperty('--background-b', background.b)
		var luminance = Color.luminance(accent)
		if (luminance < 200) {
			// TODO: find out better calculations for shadows
			//var alpha = Math.min(luminance / 130, 1)
			var alpha = Math.min(luminance / 130, 1)
			//var divider = 1.6
			var divider = luminance / 100
			console.log(name)
			console.log(
				luminance.toFixed(2), divider.toFixed(1), alpha.toFixed(2),
				'|',
				accent.r, accent.g, accent.b,
				'|',
				Math.round(accent.r / divider), Math.round(accent.g / divider), Math.round(accent.b / divider),
			)
			$card.style.setProperty('--shadow-r', accent.r / divider)
			$card.style.setProperty('--shadow-g', accent.g / divider)
			$card.style.setProperty('--shadow-b', accent.b / divider)
			$card.style.setProperty('--shadow-a', alpha)
		}
	}

	var $list = document.querySelector('.list')
	$list.appendChild($card)
}

function getDomFromString(htmlString) {
	var wrapper = document.createElement('div')
	wrapper.innerHTML = htmlString
	return wrapper.firstElementChild
}