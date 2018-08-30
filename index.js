var path = require('path').posix
var fs = require('fs').promises


var projectPath = 'C:/Users/Mike/OneDrive/Dev/anchora'


function getProjectPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'node_modules' || parsed.base === 'package.json')
		return parsed.dir
	if (parsed.ext === '')
		return somePath
	return parsed.dir
}

function getPackagePath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.base === 'package.json')
		return somePath
	if (parsed.base === 'node_modules' || parsed.ext !== '')
		return path.join(parsed.dir, 'package.json')
	if (parsed.ext === '')
		return path.join(somePath, 'package.json')
}

function getModulesPath(somePath) {
	var parsed = path.parse(somePath)
	if (parsed.ext !== '')
		return path.join(parsed.dir, 'node_modules')
	if (parsed.base === 'node_modules')
		return somePath
	return path.join(somePath, 'node_modules')
}



class Modules {

	constructor(projectPath) {
		this.installed = new Map
		this.subTrees = new Map
		this.unused = new Set
		this.resolved = new Set
		this.notInstalled = new Set

		this.projectPath = projectPath
		this.modulesPath = getModulesPath(projectPath)

		this.ready = this.loadAll()
	}

	async loadAll() {
		// load and parse project's package.json
		var pkg = JSON.parse(await fs.readFile(packagePath))
		this.info = createPackageInfo(pkg)
		// load and parse all project's dependency's package.json
		var promises = (await fs.readdir(this.modulesPath))
			.filter(name => !name.startsWith('.'))
			.map(name => resolve(name))
		await Promise.all(promises)
		// TODO: filter out files and other junk
	}

	// NOTE: conceptual rework of createTree from below()
	async createTree() {
		await this.ready
	}

	// NOTE: conceptual rework of createTree from below()
	async resolve(name, reload = false) {
		if (this.resolved.has(name) && reload === false)
			return
		else
			this.resolved.add(name)
		this.unused.delete(name)
		//var tree = subTrees.get(name)
		var info = await this.getPackageInfo(name, reload)
		this.installed.set(name, info)
		//info.dependencies.map(name => tree[name] = subTrees.get(name))
		await Promise.all(info.dependencies.map(name => this.resolve(name)))
		return info
	}

	async getPackageInfo(name, reload = false) {
		if (this.installed.has(name) && reload === false)
			return this.installed.get(name)
		var packagePath = path.join(this.modulesPath, name, 'package.json')
		try {
			var pkg = JSON.parse(await fs.readFile(packagePath))
			return this.createPackageInfo(pkg)
		} catch() {}
	}
	createPackageInfo(pkg) {
		return {
			name: pkg.name,
			version: pkg.version,
			dependencies:    Object.keys(pkg.dependencies || {}),
			devDependencies: Object.keys(pkg.devDependencies || {})
		}
	}

	isInstalled(moduleName, moduleVersion) {
		if (moduleVersion === undefined)
			return this.installed.has(moduleName)
		var info = this.installed.get(moduleName) || {}
		return info.version == moduleVersion // TODO
	}
	
}


var modules = new Modules(projectPath)



async function createTree(projectPath) {
	var root = {}
	var subTrees = new Map
	var unusedModules = new Set
	var resolvedModules = new Set
	var notInstalledModules = new Set

	async function resolveModule(name) {
		if (resolvedModules.has(name))
			return
		else
			resolvedModules.add(name)
		unusedModules.delete(name)
		var tree = subTrees.get(name)
		var depPackagePath = path.join(projectModulesPath, name, 'package.json')
		var {dependencies, devDependencies} = await getPackageDeps(depPackagePath)
		dependencies.map(name => tree[name] = subTrees.get(name))
		//devDependencies.map(name => tree[name] = subTrees.get(name)) // projects deps only install sub deps, not their dev dependencies
		await Promise.all(dependencies.map(resolveModule))
	}

	var projectModulesPath = getModulesPath(projectPath)
	var installed = (await fs.readdir(projectModulesPath))
	installed
		.filter(name => !name.startsWith('.'))
		.forEach(name => {
			unusedModules.add(name)
			subTrees.set(name, {})
		})
	//console.log(folders)
	var projectPackagePath = getPackagePath(projectPath)
	var {dependencies, devDependencies} = await getPackageDeps(projectPackagePath)
	console.log(dependencies)

	var tree = root
	dependencies.map(name => tree[name] = subTrees.get(name))
	devDependencies.map(name => tree[name] = subTrees.get(name))
	await Promise.all(dependencies.map(resolveModule))
	await Promise.all(devDependencies.map(resolveModule))

	console.log('unusedModules', unusedModules)

	return root
}

async function getPackageDeps(packagePath) {
	var package = JSON.parse(await fs.readFile(packagePath))
	var dependencies = Object.keys(package.dependencies || {})
	var devDependencies = Object.keys(package.devDependencies || {})
	return {dependencies, devDependencies}
}

createTree(projectPath).then(tree => console.log('\n\n', tree))



module.exports = {
	getProjectPath, getPackagePath, getModulesPath
}