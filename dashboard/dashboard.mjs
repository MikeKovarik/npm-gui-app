import {renderModuleCard} from './card.mjs'
import {renderEmojiIntoCanvas, getEmojis} from './emoji.mjs'
import * as npm from '../npmapi.mjs'
// poor man's named import
// in other words: FUCK YOU W3C, WHATWG, GOOGLE, MICROSOFT & APPLE FOR LEAVING ESM HALF ASSED.
var platform = window['platform-detect']

platform.fluent = platform.windows
platform.material = !platform.fluent

document.body.setAttribute(platform.fluent ? 'fluent' : 'material', '')


main()

//var canvas = renderEmojiIntoCanvas('📦')
async function main() {
	var modules = await npm.modules('mikekovarik')

	// add custom libraries that are not yet published to NPM, or that are outdated (don't have emoji in description)
	modules.push({local: true, name: 'random-crap', description: '🗑️ Random crap from here and there'})
	modules.push({local: true, name: 'uwp-node', description: '🎯 Run full Node.js scripts from Windows UWP apps through C# broker process.'})
	modules.push({local: true, name: 'anchora-app', description: '👨‍💻 Localhost has never been sexier. Simple yet powerful static server app for Windows'})
	modules.push({local: true, name: 'link-extract', description: '🔗 Extracts URLs and links from HTML tags, CSS properties and JS imports.'})
	modules.push({local: true, name: 'uwp-socket', description: '🔌 Simple Node-like wrapper for DataWriter and DataReader used in Windows UWP APP Apis like StreamSocket, Serial communication, etc...'})
	modules.push({local: true, name: 'uwp-fs', description: '📁 Nodes `fs` module for Windows UWP apps. Wrapper of `Windows.Storage` APIs.'})
	modules.push({local: true, name: 'mouka', description: '🌾 simple, proprietary, fun javascript test framework for comparative testing'})
	modules.push({local: true, name: 'fachman', description: '🔱 Sugar & shims for simple multithreading in browser and node.js'})
	modules.push({local: true, name: 'flexus', description: '👓 Multiplatform app development framework'})

	// also filter out modules that have no emoji for now
	modules = modules.filter(module => getEmojis(module.description).length > 0)

	console.log(modules)
	modules.forEach(renderModule)
}

function renderModule(pkg) {
	var {name, description} = pkg
	pkg.emojis = getEmojis(description)
	pkg.emoji = pkg.emojis[0]
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

	if (pkg.emojis.length) {
		var canvas = renderEmojiIntoCanvas(pkg.emojis[0])
		//document.body.appendChild(canvas)
		//return
		pkg.accent = iridescent.accentAverage(canvas)
		if (!iridescent.isWhite(pkg.accent) && !iridescent.isBlack(pkg.accent)) {
			pkg.background = pkg.accent
			pkg.foreground = iridescent.foreground(pkg.background)
		}
	}

	renderModuleCard(pkg)
}

