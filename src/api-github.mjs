import './platform-polyfill.mjs'


export async function user(username) {
	var userUrl = `https://api.github.com/users/${username}`
	var userData = await fetch(userUrl).then(res => res.json())
	if (userData.message === 'Not Found') return
	if (!userData.email) {
		try {
			var eventsUrl = `https://api.github.com/users/${username}/events`
			var events = await fetch(eventsUrl).then(res => res.json())
			if (Array.isArray(events)) {
				var lastEvent = events[0]
				if (lastEvent && lastEvent.payload.commits.length)
					userData.email = lastEvent.payload.commits[0].author.email
			}
		} catch(err) {
			// couldn't get email
		}
	}
	return {
		id: userData.id,
		name: userData.login,
		email: userData.email,
		company: userData.company,
		bio: userData.bio,
		blog: userData.blog,
		location: userData.location,
		avatarUrl: userData.avatar_url,
		repos: userData.public_repos,
		gists: userData.public_gists,
		followers: userData.followers,
		following: userData.following,
		created: userData.created_at,
		updated: userData.updated_at,
	}
	// todo: should return {name, email}
}

export function repos(username) {
	return fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json())
}

export function repo(username, repoName) {
	return fetch(`https://api.github.com/repos/${username}/${repoName}`).then(res => res.json())
}

async function readme(username, repoName) {
	var info = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`).then(res => res.json())
	return atob(info.content)
}