import * as github from './api-github.mjs'
import * as npm from './api-npm.mjs'


function updateDescription() {
	// TODO: 

	// GITHUB
	// https://developer.github.com/v3/repos/#edit
	// PATCH /repos/:owner/:repo {description: 'new descriptions'}

	// NPM
	// load package.json, update "description" property, save package.json

	// optionally, bump package version, npm publish, git push
}