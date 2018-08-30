export function renderModuleCard(project) {
	var {name, description, background, foreground, accent} = project
	var cardHtml = `
		<div card>
			<p class="name">${name}</p>
			<p class="description">${description}</p>
			<span class="emoji">${project.emoji || ''}</span>
		</div>
	`

	var $card = stringToDom(cardHtml)

	if (foreground && background) {
		$card.style.setProperty('--foreground-r', foreground.r)
		$card.style.setProperty('--foreground-g', foreground.g)
		$card.style.setProperty('--foreground-b', foreground.b)
		$card.style.setProperty('--background-r', background.r)
		$card.style.setProperty('--background-g', background.g)
		$card.style.setProperty('--background-b', background.b)
		var luminance = iridescent.luminance(accent)
		if (luminance < 200) {
			// TODO: find out better calculations for shadows
			//var alpha = Math.min(luminance / 130, 1)
			var alpha = Math.min(luminance / 130, 1)
			//var divider = 1.6
			var divider = luminance / 100
			console.log(name)
			console.log(
				luminance.toFixed(2), divider.toFixed(1), alpha.toFixed(2),
				'|',
				accent.r, accent.g, accent.b,
				'|',
				Math.round(accent.r / divider), Math.round(accent.g / divider), Math.round(accent.b / divider),
			)
			$card.style.setProperty('--shadow-r', accent.r / divider)
			$card.style.setProperty('--shadow-g', accent.g / divider)
			$card.style.setProperty('--shadow-b', accent.b / divider)
			$card.style.setProperty('--shadow-a', alpha)
		}
	}

	var $modules = document.querySelector('.modules')
	$modules.appendChild($card)
}

function stringToDom(htmlString) {
	var wrapper = document.createElement('div')
	wrapper.innerHTML = htmlString
	return wrapper.firstElementChild
}