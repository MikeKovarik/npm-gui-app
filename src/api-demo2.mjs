import * as npm from './api-npm.mjs'
import * as github from './api-github.mjs'
import * as api from './api.mjs'
import platform from '../node_modules/platform-detect/index.mjs'


global.npm = npm
global.github = github
global.api = api

function createElement(name, content) {
	var node = document.createElement(name)
	node.innerHTML = content
	return node
}

function logResult(heading, data) {
	if (platform.browser) {
		document.body.append(createElement('h1', heading))
		var stringData = JSON.stringify(data, null, 2)
		if (stringData.length === 2)
			stringData = data.toString()
		document.body.append(createElement('pre', stringData))
	} else {
		console.log('\n\n')
		console.log(heading.toUpperCase())
		console.log('\n')
		console.log(data)
	}
}


// usecase 1: unly using npm module name (always lowercase)
api.repo('sombra')
	.then(data => logResult('sombra - just name', data))
	.catch(err => logResult('sombra - just name', err))

// usecase 2: Using npm module name and github username.
// the problem is github allows uppercase while npm is strictly lowercase.
// npm module is 'sombra', github repo is 'Sombra'
// npm user is 'mikekovarik', github user is 'MikeKovarik'
//api.repo('sombra', 'MikeKovarik')
//	.then(data => logResult('npm sombra module - with GH username', data))
//	.catch(err => logResult('npm sombra module - with GH username', err))

// TODO: more usecases where github repo has different name than npm module
// like all those node-* or *-js or whatever modules.
// TODO: more usecases where username is different