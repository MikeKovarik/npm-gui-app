import {spawn, exec} from 'child_process'
//import platform from 'platform-detect'


// /D is to make sure it will change the current drive automatically, depending on the path specified
// /K removes the initial message
export function open(command, options = {}) {
	//if (platform.windows) {
		//command = `cd /D C:/`
		if (options.cwd)
			command = `cd ${options.cwd} && ${command}`
		exec(`start cmd.exe /K "${command}"`)
	//} else {
	//	console.warn('open() not implemented')
	//}
}

export {spawn, exec}
