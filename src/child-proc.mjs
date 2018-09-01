import cp from 'child_process'
import util from 'util'


export var spawn = cp.spawn
export var exec = util.promisify(cp.exec)
//import platform from 'platform-detect'


// /D is to make sure it will change the current drive automatically, depending on the path specified
// /K removes the initial message
export function open(command, options = {}) {
	//if (platform.windows) {
		//command = `cd /D C:/`
		if (options.cwd)
			command = `cd ${options.cwd} && ${command}`
		return exec(`start cmd.exe /K "${command}"`)
	//} else {
	//	console.warn('open() not implemented')
	//}
}

export async function spawnExec(args) {
	return new Promise(resolve => {
		var proc = spawn(cmd, args)
		var stdout = ''
		var stderr = ''
		proc.stdout.on('data', buffer => stdout += buffer)
		proc.stderr.on('data', buffer => stderr += buffer)
		proc.once('exit',  ()  => resolve({stdout, stderr}))
		proc.once('error', err => resolve({stdout, stderr}))
	})
}
