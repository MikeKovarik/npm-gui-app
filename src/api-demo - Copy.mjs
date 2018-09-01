import * as npm from './api-npm.mjs'
import * as github from './api-github.mjs'
import platform from './node_modules/platform-detect/index.mjs'

function createElement(name, content) {
	var node = document.createElement(name)
	node.innerHTML = content
	return node
}

function logResult(heading, data) {
	if (platform.browser) {
		document.body.append(createElement('h1', heading))
		document.body.append(createElement('pre', JSON.stringify(data, null, 2)))
	} else {
		console.log('\n\n')
		console.log(heading.toUpperCase())
		console.log('\n')
		console.log(data)
	}
}


/*
npm.downloads('iridescent')
	.then(data => logResult('npm.downloads - iridescent', data))
	.catch(err => logResult('npm.downloads - iridescent', err))

npm.score('iridescent')
	.then(data => logResult('npm.score - iridescent', data))
	.catch(err => logResult('npm.score - iridescent', err))
*/

/*
github.repos('mikekovarik')
	.then(data => logResult('github.repos - mikekovarik', data))
	.catch(err => logResult('github.repos - mikekovarik', err))

npm.modules('mikekovarik')
	.then(data => logResult('npm.modules - mikekovarik', data))
	.catch(err => logResult('npm.modules - mikekovarik', err))
*/

npm.module('iridescent')
	.then(data => logResult('npm.module - iridescent', data))
	.catch(err => logResult('npm.module - iridescent', err))

github.repo('iridescent', 'mikekovarik')
	.then(data => logResult('github.repo - iridescent', data))
	.catch(err => logResult('github.repo - iridescent', err))
