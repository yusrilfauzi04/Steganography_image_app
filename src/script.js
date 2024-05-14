const resetBtn = document.getElementById('btn-clear')
const formEncode = document.getElementById('form-encode') || null
const formDecode = document.getElementById('form-decode') || null

if (formEncode != null) {
	formEncode.addEventListener('submit', hideMessageToImage, false)
}

if (formDecode != null) {
	formDecode.addEventListener('submit', extractMessageFromImage, false)
}

resetBtn.addEventListener('click', () => {
	window.location.reload()
})

document.addEventListener('DOMContentLoaded', function () {
	const links = document.querySelectorAll('nav ul li a')

	links.forEach((link) => {
		link.addEventListener('click', function (event) {
			event.preventDefault()

			const href = this.getAttribute('href')
			document.body.classList.add('page-transition')

			setTimeout(() => {
				window.location.href = href
			}, 400)
		})
	})

	document.body.addEventListener('transitionend', function () {
		document.body.classList.remove('page-transition')
	})
})

function showSidebar() {
	const sidebar = document.querySelector('.sidebar')
	sidebar.style.display = 'flex'
}

function hideSidebar() {
	const sidebar = document.querySelector('.sidebar')
	sidebar.style.display = 'none'
}
