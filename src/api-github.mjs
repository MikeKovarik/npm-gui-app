import './platform-polyfill.mjs'


function snakeToCamel(snake) {
	return snake.replace(/(\_\w)/g, match => match[1].toUpperCase())
}

export async function user(username) {
	var userUrl = `https://api.github.com/users/${username}`
	var user = await fetch(userUrl).then(res => res.json())
	if (user.message) throw new Error(user.message)
	if (!user.email) {
		try {
			var eventsUrl = `https://api.github.com/users/${username}/events`
			var events = await fetch(eventsUrl).then(res => res.json())
			if (Array.isArray(events)) {
				var lastEvent = events[0]
				if (lastEvent && lastEvent.payload.commits.length)
					user.email = lastEvent.payload.commits[0].author.email
			}
		} catch(err) {
			// couldn't get email
		}
	}
	return sanitizeUser(user)
	// todo: should return {name, email}
}

export async function repos(username) {
	var url = `https://api.github.com/users/${username}/repos`
	var json = await fetch(url).then(res => res.json())
	if (json.message) throw new Error(json.message)
	return json
}

export async function repo(username, repoName) {
	var url = `https://api.github.com/repos/${username}/${repoName}`
	var json = await fetch(url).then(res => res.json())
	if (json.message) throw new Error(json.message)
	return sanitizeRepo(json)
}

function sanitizeUser(user) {
	var output = {}
	if (user.id)           output.id           = user.id
	if (user.login)        output.name         = user.login
	if (user.email)        output.email        = user.email
	if (user.company)      output.company      = user.company
	if (user.bio)          output.bio          = user.bio
	if (user.blog)         output.blog         = user.blog
	if (user.location)     output.location     = user.location
	if (user.avatar_url)   output.avatarUrl    = user.avatar_url
	if (user.public_repos) output.repos        = user.public_repos
	if (user.public_gists) output.gists        = user.public_gists
	if (user.followers)    output.followers    = user.followers
	if (user.following)    output.following    = user.following
	if (user.created_at)   output.createdTime  = new Date(user.created_at)
	if (user.updated_at)   output.modifiedTime = new Date(user.updated_at)
	delete output.url
	return output
}

function sanitizeRepo(repo) {
	var output = {}
	for (var [key, val] of Object.entries(repo)) {
		if (key.endsWith('_url')) continue
		var targetKey = key.includes('_') ? snakeToCamel(key) : key
		if (key.endsWith('_at')) targetKey = targetKey.slice(0, -2) + 'Time'
		output[targetKey] = repo[key]
	}
	if (output.license)
		output.license = output.license.name.split(' ').shift()
	output.owner = sanitizeUser(output.owner)
	delete output.url
	return output
}

export async function readme(username, repoName) {
	var url = `https://api.github.com/repos/${username}/${repoName}/readme`
	var json = await fetch(url).then(res => res.json())
	if (json.message) throw new Error(json.message)
	return json
}