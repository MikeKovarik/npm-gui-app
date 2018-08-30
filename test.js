var {assert} = require('chai')
var {getProjectPath, getPackagePath, getModulesPath} = require('./index.js')

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

	describe('getPackagePath()', () => {
		it(`handles folder`,       () => assert.equal(getPackagePath(projectPath), packagePath))
		it(`handles package.json`, () => assert.equal(getPackagePath(packagePath), packagePath))
		it(`handles node_modules`, () => assert.equal(getPackagePath(modulesPath), packagePath))
		it(`handles random file`,  () => assert.equal(getPackagePath(randomPath),  packagePath))
	})

	describe('getModulesPath()', () => {
		it(`handles folder`,       () => assert.equal(getModulesPath(projectPath), modulesPath))
		it(`handles package.json`, () => assert.equal(getModulesPath(packagePath), modulesPath))
		it(`handles node_modules`, () => assert.equal(getModulesPath(modulesPath), modulesPath))
		it(`handles random file`,  () => assert.equal(getModulesPath(randomPath),  modulesPath))
	})

})