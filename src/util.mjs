import path from './path.mjs' // import path from 'path'


///////////////////////////////////////////////////////////////////////////////
////////////////////////////////// POLYFILLS //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Array.prototype.flat = function(depth = 1) {
	var stack = [...this]
	var res = []
	while (stack.length) {
		var next = stack.pop()
		if (Array.isArray(next))
			stack.push(...next)
		else
			res.push(next)
	}
	return res.reverse()
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// CUSTOM PROTOTYPE EXTENSIONS /////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Yeah, that's right! Don't judge me. This is just an app, not a library.

Array.prototype.promiseAll = function() {
	return Promise.all(this)
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UTIL FUNCTIONS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export var noop = () => {}

export function getProjectPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'node_modules' || parsed.base === 'package.json')
		return parsed.dir
	if (parsed.ext === '')
		return somePath
	return parsed.dir
}

export function getPackageJsonPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'package.json')
		return somePath
	if (parsed.base === 'node_modules' || parsed.ext !== '')
		return path.join(parsed.dir, 'package.json')
	if (parsed.ext === '')
		return path.join(somePath, 'package.json')
}

export function getNodeModulesPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.ext !== '')
		return path.join(parsed.dir, 'node_modules')
	if (parsed.base === 'node_modules')
		return somePath
	return path.join(somePath, 'node_modules')
}



// Accepts package.json or NPM API output
export function extractGithubFromPackage(pkg) {
	var repoLink = typeof pkg.repository === 'object' ? pkg.repository.url : pkg.repository
	var bugsLink = typeof pkg.bugs       === 'object' ? pkg.bugs.url       : pkg.bugs
	if (typeof repoLink === 'string' && repoLink.includes('://github.com')) {
		if (repoLink.endsWith('.git'))
			repoLink = repoLink.slice(0, -4)
		return repoLink.split('/').slice(-2)
	}
	if (typeof bugsLink === 'string' && bugsLink.includes('://github.com')) {
		var sections = bugsLink.split('/')
		var index = sections.indexOf('github.com') + 1
		return sections.slice(index, index + 2)
	}
}



// NOTE on getting github out of package.json
// package.json can include two fields, "repository" and "bugs".
// "bugs" is string with url to issues page
// "repository" is object with string property "url" leading to .git file
// Output from NPM repository API changes "bugs" into object as well
// and it artificially creates the "bugs" object from "repository"!

/*

--- EXAMPLE 1 ---
SOMBRA - PACKAGE.JSON
{
	"repository": {
		"type": "git",
		"url": "https://github.com/MikeKovarik/sombra.git"
	},
}
SOMBRA - API OUTPUT
{
	repository: {
		type: 'git',
		url: 'git+https://github.com/MikeKovarik/sombra.git'
	},
	bugs: {
		url: 'https://github.com/MikeKovarik/sombra/issues'
	}
}

--- EXAMPLE 2 ---
ANCHORA - PACKAGE.JSON
{
	"bugs": "https://github.com/MikeKovarik/anchora/issues/",
	"repository": {
		"type": "git",
		"url": "https://github.com/MikeKovarik/anchora.git"
	},
}

ANCHORA - API OUTPUT
{
	repository: {
		type: 'git',
		url: 'git+https://github.com/MikeKovarik/anchora.git'
	},
	bugs: {
		url: 'https://github.com/MikeKovarik/anchora/issues/'
	}
}
*/
