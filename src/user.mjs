import * as npm from './api-npm.mjs'
import * as github from './api-github.mjs'
import {spawnExec, spawn, exec} from './child-proc.mjs'
import {noop} from './util.mjs'


// maybe move this to api-npm as login-local ??? or keep the name since web doesnt suppod oauth
function login(username, password, email) {
	//var npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
	var proc = spawn(npmCmd, ['login'])
	// it will now do three prompts for username, password and email
	proc.on('data', data => console.log('data', data.toString))
}

export var user = {
	npm: {},
	github: {},
	// TODO: change this to reflect cli login, web requests login, github login.
	//loggedIn: false,
}

// Start getUserInfo and assign the promise as nonenumerable 'ready' property.
Object.defineProperty(user, 'ready', {
	value: getUserInfo()
})

async function getUserInfo() {
	await getNpmInfo().catch(noop)
	await getGithubInfo().catch(noop)
}

async function getNpmInfo() {
	var npmUser = await npm.user()
	if (npmUser) {
		user.github.name = npmUser.github
		Object.assign(user.npm, npmUser)
		user.fullname = user.npm.fullname
		delete user.npm.fullname
		delete user.npm.email_verified
		delete user.npm.github
		delete user.npm.twitter
		delete user.npm.tfa
	}
}

async function getGithubInfo(name = user.github.name) {
	if (!name) return
	var ghUser = await github.user(user.github.name)
	if (ghUser) {
		Object.assign(user.github, ghUser)
		user.avatarUrl = user.github.avatarUrl
		delete user.github.avatarUrl
	}
}


user.ready.then(() => console.log('user', JSON.stringify(user, null, 2)))


// token is at
// C:\Users\Mike\.npmrc
