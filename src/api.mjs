import * as npm from './api-npm.mjs'
import * as github from './api-github.mjs'
import {extractGithubFromPackage} from './util.mjs'


export function repos(npmUserName, githubUserName = npmUserName) {
	npmUserName = npmUserName.toLowerCase()
}

export async function repo(...args) {
	switch (args.length) {
		case 1:
			// We're only given npm module name or github repo name.
			// Can't grab github repo because we're not given username.
			// The name have upper case (e.g. gh 'Sombra', npm 'sombra') but we need to sanitize to to npm's strict lowercase.
			// Grab npm module first.
			var [npmModuleName] = args
		case 2:
			var [npmModuleName, githubUserName] = args
		case 3:
			var [npmModuleName, githubRepoName, githubUserName] = args
			break
	}
	npmModuleName = npmModuleName.toLowerCase()
	if (githubRepoName && githubUserName) {
		var [module, repo] = await Promise.all([
			npm.module(npmModuleName),
			github.repo(githubRepoName, githubUserName),
		])
	} else {
		var module = await npm.module(npmModuleName)
		//console.log(module)
		var gh = extractGithubFromPackage(module)
		if (gh)
			var [githubUserName, githubRepoName] = gh
		console.log(gh)
	}
}

//repo('Sombra')

// npm mikekovarik/sombra https://www.npmjs.com/package/sombra
// gh  MikeKovarik/Sombra https://github.com/MikeKovarik/Sombra
