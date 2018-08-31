var cp = require('child_process')

var platform = {windows:true}

// /D is to make sure it will change the current drive automatically, depending on the path specified
// /K removes the initial message


function launchTerminal(command, options = {}) {
	if (platform.windows) {
		//command = `cd /D C:/`
		if (options.cwd)
			command = `cd ${options.cwd} && ${command}`
		cp.exec(`start cmd.exe /K "${command}"`)
		//cp.exec(`start cmd.exe /K cd /D C:/`)
	}
}

//launchTerminal(`echo hello`)

//launchTerminal('rollup -c', {cwd: 'C:/Users/Mike/OneDrive/Dev/iso-app'})
launchTerminal('mocha test', {cwd: 'C:/Users/Mike/OneDrive/Dev/iridescent'})
launchTerminal('mocha test --watch', {cwd: 'C:/Users/Mike/OneDrive/Dev/iridescent'})
