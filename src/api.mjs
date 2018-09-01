import * as npm from './api-npm.mjs'
import * as github from './api-github.mjs'
import {noop, extractGithubFromPackage} from './util.mjs'


export function repos(npmUserName, githuUser = npmUserName) {
	npmUserName = npmUserName.toLowerCase()
}

export async function repo(...args) {
	var info = new RepoModule(...args)
	await info.fetch()
	return info
}

class RepoModule {

	// new RepoModule([githuUser, repoName][, moduleName])
	constructor(...args) {
		switch (args.length) {
			case 3:
				this.githuUser = args[0]
				this.repoName = args[1]
				this.moduleName = args[2]
				break
			case 2:
				this.githuUser = args[0]
				this.repoName = args[1]
				break
			case 1:
				this.moduleName = args[0]
				break
		}

		if (!this.repoName && this.moduleName)
			this.repoName = this.moduleName
		
		if (!this.moduleName && this.repoName)
			this.moduleName = this.repoName
		
		if (this.moduleName)
			this.moduleName = this.moduleName.toLowerCase()
	}

	async fetch() {
		// Grabbing github repo requires to know owners username as well. We can guess the repo name
		// (might be the same as npm module name) and user can even provide the a name in upper case
		// and we'll lower case it for npm (npm forbids uppercase, repos can be uppercase though).
		// So we'll fetch NPM for sure and try to fetch GitHub as well. If that fails, we'll try again
		// once we parse package.json (but only if it contains github link).
		if (this.repoName && this.githuUser) {
			// We have github username and presumably repo name, we can try to get both NPM and Github Repo.
			// Fail silently and try to get as many informations as possible.
			await Promise.all([
				this.fetchNpm().catch(noop),
				this.fetchGithub().catch(noop),
			])
			await this.parsePackageAndReEvaluateGithub()
		} else {
			try {
				await this.fetchNpm()
				await this.parsePackageAndReEvaluateGithub()
			} catch(err) {
				throw new Error(`Couldn't fetch NPM module ${this.moduleName}`)
			}
		}
	}

	// Once we fetch package.json, we can scan if for github links and try to re-fetch github again
	// in case we failed for the first time (due to inaccurate, guessed github user or repo name).
	async parsePackageAndReEvaluateGithub() {
		// Only continue if we previously failed to fetch the repo.
		if (this.repo) return
		// Parse package.repository or package.bugs for link.
		var [githuUser, repoName] = extractGithubFromPackage(this.package) || []
		if (!githuUser || !repoName) return
		if (this.githuUser === githuUser && this.repoName === repoName) return
		// Only procees if we didn't have the right user or repo name.
		this.githuUser = githuUser
		this.repoName = repoName
		await this.fetchGithub().catch(noop)
	}

	async fetchNpm() {
		if (!this.moduleName) return
		this.package = await npm.module(this.moduleName)
		if (this.package.readme) {
			this.readme = this.package.readme
			delete this.package.readme
		}
	}

	async fetchGithub() {
		if (!this.githuUser && !this.repoName) return
		this.repo = await github.repo(this.githuUser, this.repoName)
		if (this.repo.readme) {
			this.readme = this.repo.readme
			delete this.repo.readme
		}
	}

	async fetchReadme() {
		if (!this.githuUser && !this.repoName) return
		this.readme = await github.readme(this.githuUser, this.repoName)
	}

}

//npm.module('mikekasdovarikk').then(console.log).catch(console.error)

repo('Sombra').then(console.log).catch(console.error)

// npm mikekovarik/sombra https://www.npmjs.com/package/sombra
// gh  MikeKovarik/Sombra https://github.com/MikeKovarik/Sombra
