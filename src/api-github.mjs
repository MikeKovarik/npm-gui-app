import './platform-polyfill.js'


export function user(userName) {
	return fetch(`https://api.github.com/users/${userName}`).then(res => res.json())
}

export function repos(userName) {
	return fetch(`https://api.github.com/users/${userName}/repos`).then(res => res.json())
}

export function repo(repoName, userName) {
	return fetch(`https://api.github.com/repos/${userName}/${repoName}`).then(res => res.json())
}

async function readme(repoName, userName) {
	var info = await fetch(`https://api.github.com/repos/${userName}/${repoName}/readme`).then(res => res.json())
	return atob(info.content)
}

readme('iridescent', 'mikekovarik').then(console.log)
