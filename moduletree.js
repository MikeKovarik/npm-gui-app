var path = require('path').posix
var fs = require('fs').promises

// TODO: handle @scoped/modules

function getProjectPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'node_modules' || parsed.base === 'package.json')
		return parsed.dir
	if (parsed.ext === '')
		return somePath
	return parsed.dir
}

function getPackageJsonPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'package.json')
		return somePath
	if (parsed.base === 'node_modules' || parsed.ext !== '')
		return path.join(parsed.dir, 'package.json')
	if (parsed.ext === '')
		return path.join(somePath, 'package.json')
}

function getNodeModulesPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.ext !== '')
		return path.join(parsed.dir, 'node_modules')
	if (parsed.base === 'node_modules')
		return somePath
	return path.join(somePath, 'node_modules')
}

Array.prototype.promiseAll = function() {
	return Promise.all(this)
}

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


class ProjectModules {

	constructor(projectPath) {
		// explicitly included in package.json
		this.required = new Set
		// names of installed and 
		this.installed = new Set
		// names and pkgInfos of installed and resolved (package.json read) modules
		this.resolved = new Map
		// todo
		this.unused = new Map
		// todo
		this.subTrees = {}

		this.projectPath = projectPath
		this.packageJsonPath = getPackageJsonPath(projectPath)
		this.nodeModulesPath = getNodeModulesPath(projectPath)

		this.resolvePackage = this.resolvePackage.bind(this)
	}

	// names of required (in package.json) but not installed modules
	get notInstalled() {
		return Array.from(this.required).filter(name => !this.installed.has(name))
	}

	// NOTE: conceptual rework of createTree from below()
	async createTree() {
		// load and parse project's package.json
		await this.loadRoot()
		// readdir node_modules and load and parse all dependencies and their package.json
		await this.loadInstalledNodeModules()
		console.log('\nREQUIRED\n', this.required)
		console.log('\nUNUSED\n', this.unused)
		console.log('\nINSTALLED\n', this.installed)
		console.log('\nNOTINSTALLED\n', this.notInstalled)
		//console.log('resolved\n', this.resolved)
		//console.log('\nsubTrees\n', this.subTrees)
		return this.getSubTree(this.pkgInfo.name)
	}

	async loadAll() {
	}

	getSubTree(name) {
		var branch = this.subTrees[name]
		if (branch) return branch
		return this.subTrees[name] = {}
	}

	async loadRoot() {
		this.pkgInfo = new PackageInfo(this.packageJsonPath)
		var {name, dependencies, devDependencies} = await this.pkgInfo.ready
		// Create root of tree.
		var root = this.getSubTree(name)
		for (var name of [...dependencies, ...devDependencies]) {
			this.required.add(name)
			root[name] = this.getSubTree(name)
		}
	}

	async loadInstalledNodeModules() {
		var names = (await fs.readdir(this.nodeModulesPath))
		// Remove junk, TODO: more thorough filtering
		var removeJunk = name => !name.startsWith('.')
		names = names.filter(removeJunk)
		// Filter out scopes, read their subfolders.
		var scopedNames = await names
			.filter(name => name.startsWith('@'))
			.map(async scope => {
				var subfolders = await fs.readdir(path.join(this.nodeModulesPath, scope))
				return subfolders
					.filter(removeJunk)
					.map(subName => `${scope}/${subName}`)
			})
			.promiseAll()
		// Now remove scopes
		names = names.filter(name => !name.startsWith('@'))
		// Reintroduce scoped modules
		names.unshift(...scopedNames.flat())
		this.installed = new Set(names)
		this.unused = new Set(names)
		await Promise.all(names.map(this.resolvePackage))
		this.required.forEach(depName => this.unused.delete(depName))
	}

	// NOTE: conceptual rework of createTree from below()
	async resolvePackage(name) {
		if (this.resolved.has(name))
			return this.resolved.get(name)

		this.installed.add(name)

		var packageJsonPath = path.join(this.nodeModulesPath, name, 'package.json')
		var pkgInfo = new PackageInfo(packageJsonPath, name)
		await pkgInfo.ready

		var removeFromUnused = depName => this.unused.delete(depName)
		if (pkgInfo.dependencies)    pkgInfo.dependencies.map(removeFromUnused)
		if (pkgInfo.devDependencies) pkgInfo.devDependencies.map(removeFromUnused)

		this.resolved.set(name, pkgInfo)
		if (pkgInfo.dependencies)    await Promise.all(pkgInfo.dependencies.map(this.resolvePackage))
		//if (pkgInfo.devDependencies) await Promise.all(pkgInfo.devDependencies.map(this.resolvePackage))

		var tree = this.getSubTree(name)
		for (var depName of [...pkgInfo.dependencies, ...pkgInfo.devDependencies])
			tree[depName] = this.getSubTree(depName)

		return pkgInfo
	}

	isInstalled(name, version) {
		if (version === undefined)
			return this.installed.has(name)
		var pkgInfo = this.resolved.get(name) || {}
		return pkgInfo.version == version // TODO
	}
	
}

class PackageInfo {

	constructor(packageJsonPath, name) {
		// A bit of bootstrapping, making some properties not enumerable for easier logging & debugging.
		var hidden = {writable: true, enumerable: false}
		Object.defineProperties(this, {
			packageJsonPath: hidden,
			packageJson: hidden,
			ready: hidden
		})
		// Assign values
		this.name = name
		this.packageJsonPath = packageJsonPath
		this.ready = this.load()
	}

	async load() {
		try {
			var pkgJson = await JSON.parse(await fs.readFile(this.packageJsonPath))
			this.name = pkgJson.name || this.name
			this.version = pkgJson.version
			this.dependencies    = Object.keys(pkgJson.dependencies || {})
			this.devDependencies = Object.keys(pkgJson.devDependencies || {})
			this.packageJson = true
		} catch(err) {
			this.packageJson = false
		}
		return this
	}

}




var projectPath = 'C:/Users/Mike/OneDrive/Dev/anchora'

var modules = new ProjectModules(projectPath)
modules.createTree(projectPath).then(tree => console.log('\n\n\n', tree))

//createTree(projectPath).then(tree => console.log('\n\n', tree))



module.exports = {getProjectPath, getPackageJsonPath, getNodeModulesPath}