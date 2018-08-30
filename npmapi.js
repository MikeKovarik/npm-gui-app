var NpmApi = require('npm-api')
var npmApi = require('npm-api-util')
var {promisify} = require('util')
npmApi.downloadInfo = promisify(npmApi.downloadInfo)
npmApi.packageInfo = promisify(npmApi.packageInfo)


var npm = new NpmApi()
var maintainer =  npm.maintainer('mikekovarik')
/*
maintainer.repos()
	.then(repoNames => console.log(repoNames))
	.catch(err => console.error(err))
*/

npmApi.downloadInfo('gulp-better-rollup')
	.then(data => console.log(data))
	.catch(err => console.error(err))

npmApi.packageInfo('gulp-better-rollup')
	.then(data => {
		console.log('name', data.packageName)
		console.log('description', data.packageDescription)
		console.log('homepage', data.packageHomepageUrl)
		console.log('author', data.packageAuthor)
		console.log('maintainers', data.packageMaintainers)
		console.log('issues', data.packageBugUrlLink)
		console.log('licence', data.packageLicenseType)
		console.log('packageVersions length', Object.keys(data.packageVersions).length)

		console.log('latest version', data.packageLatestDistTag)
		console.log('created date ', data.packageCreatedTime)
	})
	.catch(err => console.error(err))
 

async function main() {
	var repo = npm.repo('gulp-better-rollup')
	// package.json of published version
	var pkg = await repo.package()
	console.log(pkg.name, pkg.version, pkg.author.name)
	console.log(pkg.description)
	console.log(pkg.repository.url)
	// TODO: we could compare latest published package.json with local package.json and show warning
	// that some things have been changed
/*
	var downloads = await repo.downloads()
	console.log(downloads.length + ' days of downloads have been pulled for ' + repo.name)

	console.log('total:', await repo.total())
	console.log('last 30 days:', await repo.last(30))
	console.log('last 7 days:', await repo.last(7))
	console.log('last day:', await repo.last(1))
	*/
}

main()