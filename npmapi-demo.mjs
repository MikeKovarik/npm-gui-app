import fetch from 'node-fetch'
import * as npm from './npmapi.mjs'
global.fetch = fetch


/*
npm.modules('mikekovarik')
	.then(json => {
		json = json.find(obj => obj.name === 'iridescent')
		console.log(JSON.stringify(json, null, 2))
	})
	//.then(json => console.log(JSON.stringify(json, null, 2)))
	.catch(console.error)
*/

npm.downloads('iridescent')
	.then(console.log)
	.catch(console.error)

npm.score('iridescent')
	.then(console.log)
	.catch(console.error)

/*
npm.module('iridescent')
	.then(package => {
		console.log('-----------------------------------------')
		console.log(package)
		//console.log('-----------------------------------------')
		//console.log('name', package.name)
		//console.log('description', package.description)
		//console.log('homepage', package.homepageUrl)
		//console.log('author', package.author)
		//console.log('maintainers', package.maintainers)
		//console.log('license', package.license)
		//console.log('versions', package.versionCount)
		//console.log('modified date ', package.modifiedTime)
		//console.log('created date ', package.createdTime)
		//console.log('-----------------------------------------')
		
	})
	.catch(err => console.error(err))
*/