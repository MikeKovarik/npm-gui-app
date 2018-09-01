import 'https://unpkg.com/chai@4.1.2/chai.js'
import 'https://unpkg.com/mocha@5.2.0/mocha.js'
var {assert} = chai

mocha.setup('bdd')


import {getProjectPath, getPackageJsonPath, getNodeModulesPath} from './src/util.mjs'
import {extractGithubFromPackage} from './src/util.mjs'

//import foo from './src/platform-polyfill.js'
//console.log(foo)

describe('util functions', () => {

	var projectPath = 'C:/Users/Mike/OneDrive/Dev/anchora'
	var packagePath = 'C:/Users/Mike/OneDrive/Dev/anchora/package.json'
	var modulesPath = 'C:/Users/Mike/OneDrive/Dev/anchora/node_modules'
	var randomPath = 'C:/Users/Mike/OneDrive/Dev/anchora/server.js'

	describe('getProjectPath()', () => {
		it(`handles folder`,       () => assert.equal(getProjectPath(projectPath), projectPath))
		it(`handles package.json`, () => assert.equal(getProjectPath(packagePath), projectPath))
		it(`handles node_modules`, () => assert.equal(getProjectPath(modulesPath), projectPath))
		it(`handles random file`,  () => assert.equal(getProjectPath(randomPath),  projectPath))
	})

	describe('getPackageJsonPath()', () => {
		it(`handles folder`,       () => assert.equal(getPackageJsonPath(projectPath), packagePath))
		it(`handles package.json`, () => assert.equal(getPackageJsonPath(packagePath), packagePath))
		it(`handles node_modules`, () => assert.equal(getPackageJsonPath(modulesPath), packagePath))
		it(`handles random file`,  () => assert.equal(getPackageJsonPath(randomPath),  packagePath))
	})

	describe('getNodeModulesPath()', () => {
		it(`handles folder`,       () => assert.equal(getNodeModulesPath(projectPath), modulesPath))
		it(`handles package.json`, () => assert.equal(getNodeModulesPath(packagePath), modulesPath))
		it(`handles node_modules`, () => assert.equal(getNodeModulesPath(modulesPath), modulesPath))
		it(`handles random file`,  () => assert.equal(getNodeModulesPath(randomPath),  modulesPath))
	})

	describe('extractGithubFromPackage()', () => {

		it(`repository.url`, () => {
			// output from NPM API
			var pkg = {
				repository: {
					type: 'git',
					url: 'git+https://github.com/MikeKovarik/sombra.git'
				}
			}
			assert.deepEqual(extractGithubFromPackage(pkg), ['MikeKovarik', 'sombra'])
		})

		it(`repository`, () => {
			// unlikely case
			var pkg = {
				repository: 'https://github.com/MikeKovarik/sombra'
			}
			assert.deepEqual(extractGithubFromPackage(pkg), ['MikeKovarik', 'sombra'])
		})

		it(`bugs.url`, () => {
			// output from NPM API
			var pkg = {
				bugs: {
					url: 'https://github.com/MikeKovarik/sombra/issues'
				}
			}
			assert.deepEqual(extractGithubFromPackage(pkg), ['MikeKovarik', 'sombra'])
		})

		it(`bugs`, () => {
			// this is how it's usually in package.json
			var pkg = {
				bugs: 'https://github.com/MikeKovarik/sombra/issues/'
			}
			assert.deepEqual(extractGithubFromPackage(pkg), ['MikeKovarik', 'sombra'])
		})

	})

})

mocha.checkLeaks()
mocha.run()