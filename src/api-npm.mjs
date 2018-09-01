import './platform-polyfill.mjs'
import {exec} from './child-proc.mjs'



// WARNING: neither endpoints support CORS
// Will return undefined of the moduel doesn't exist.
export async function module(name) {
	//var res = await fetch(`https://skimdb.npmjs.com/registry/${name}`)
	var res = await fetch(`https://registry.npmjs.org/${name}`)
	var pkg = await res.json()
	if (pkg.error) throw new Error(pkg.error)
	pkg.author = pkg.author.name
	pkg.modifiedTime = pkg.time.modified
	pkg.createdTime = pkg.time.created
	pkg.versionCount = Object.keys(pkg.versions).length
	sanitizeObject(pkg)
	return pkg
}

// NOTE: returns empty array if the user doesn't exist.
export async function modules(username, size = 250, offset = 0) {
	const url = `https://api.npms.io/v2/search?q=maintainer:${username}&size=${size}&from=${offset}`
	var json = await fetch(url).then(res => res.json())
	return json.results
		// Merge the objects returned by npms into one coherent package object
		.map(obj => {
			obj.package.score = obj.score.final
			obj.package.scoreInfo = obj.score.detail
			obj.package.searchScore = obj.searchScore
			return obj.package
		})
		// Revive package.
		.map(pkg => {
			pkg.author = pkg.author.name
			pkg.date = new Date(pkg.date)
			return pkg
		})
}

export async function user(username) {
	if (username === undefined) {
		// User local NPM to detect self.
		// Will include email, github.
		var user = (await exec('npm profile get --json')).stdout
		user.created_at = new Date(user.created)
		user.updated_at = new Date(user.updated)
		delete user.created
		delete user.updated
		return JSON.parse(user)
	} else {
		// TODO
		// WARNING: this request also doesnt support cors
		// AFAIK there's no public api. We'd have to scrape npm profile page.
		var url = `https://registry.npmjs.org/-/user/org.couchdb.user:${username}`
		var {email, name} = await fetch(url).then(res => res.json())
		// this is incomplete and does not show github and other fields.
		return {email, name}
	}
}

export async function score(name) {
	var url = `https://api.npms.io/v2/package/${name}`
	return fetch(url).then(res => res.json())
}

// https://github.com/npm/download-counts
export async function downloads(name, period = 'last-month') {
	var url = `https://api.npmjs.org/downloads/point/${period}/${name}`
	return fetch(url).then(res => res.json())
}

function sanitizeObject(object) {
	for (var [key, val] of Object.entries(object)) {
		if (key.startsWith('_')) {
			delete object[key]
			continue
		}
		if (Array.isArray(val)) {
			val.forEach(sanitizeObject)
			continue
		} else if (typeof val === 'object') {
			sanitizeObject(val)
		}
	}
}
