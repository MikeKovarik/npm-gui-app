// Isomorphic and more sensible version of Node's 'path' module


function sanitizePosix(path) {
	return path.replace(/\\/g, '/')
}

export function join(...segments) {
	var output = []
	segments
		.map(seg => seg.replace(sanitizePosix))
		.map(seg => seg.split('/'))
		.flat()
		.forEach((seg, i) => {
			if ((!seg || seg === '.') && i > 0) return
			if (seg === '..')
				output.pop()
			else
				output.push(seg)
		})
	return output.join('/') || (output.length ? '/' : '.')
}

export function basename(path) {
	return join(path, '..')
}

export function parse(path) {
	path = sanitizePosix(path)
	var dirSegments = path.split('/')
	if (!dirSegments[dirSegments.length - 1])
		dirSegments.pop()
	var base = dirSegments.pop()
	var dir  = dirSegments.join('/')
	var nameSegments = base.split('.')
	var ext  = nameSegments.pop()
	var name = nameSegments.join('.')
	if (!name && ext)
		[name, ext] = [ext, name]
	if (ext)
		ext = '.' + ext
	return {dir, base, ext, name}
}

export default {join, basename, parse}