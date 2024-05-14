function downloadImg() {
	const stegoImg = document.getElementById('stego-img')
	const a = document.createElement('a')
	a.href = stegoImg.src
	a.download = `${new Date().getTime()}-stego-image.png`

	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
}

function hideMessageToImage(e) {
	e.preventDefault()

	const uploadedImg = document.getElementById('img-upload')
	const stegoImg = document.getElementById('stego-img')
	const messageInput = document.getElementById('insert-message')

	const aKey = document.getElementById('a-cipher-key').value
	const bKey = document.getElementById('b-cipher-key').value

	if (!uploadedImg) {
		alert(
			'Gambar belum terbaca oleh sistem, silahkan unggah gambar terlebih dahulu.'
		)
		return
	}

	if (!messageInput.value) {
		alert('Pesan kosong, silahkan masukkan pesan terlebih dahulu.')
		return
	}

	const messagePattern = /^[A-Za-z\t\n ]+$/

	console.log(messagePattern.test(messageInput.value))
	if (!messagePattern.test(messageInput.value)) {
		alert(
			'Pesan harus alphabet yaitu huruf (a-z) dalam kapital ataupun huruf kecil.'
		)
		return
	}

	if (!aKey && !bKey) {
		alert(
			'kunci a dan b kosong, silahkan isi masing - masing kunci terlebih dahulu.'
		)
		return
	}

	if (!AffineCipher.isCoprimeAndLessThanM(parseInt(aKey))) {
		alert('kunci a harus koprima dan kurang dari 26')
		return
	}

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	const img = new Image()
	img.onload = function () {
		canvas.width = img.width
		canvas.height = img.height

		context.drawImage(img, 0, 0)
		const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
		const data = imgData.data
		let msg = messageInput.value

		// encrypt msg
		const encryptedMsg = AffineCipher.encryptMessage(
			msg,
			parseInt(aKey),
			parseInt(bKey)
		)

		// text to binary
		let binarizedText = new String()
		for (let i = 0; i < encryptedMsg.length; i++) {
			binarizedText += encryptedMsg[i]
				.codePointAt(0)
				.toString(2)
				.padStart(8, '0')
		}

		// insert message to the image rgb bit
		let binaryIndex = 0
		for (let i = 0; i < data.length; i += 4) {
			for (let j = 0; j < 3; j++) {
				data[i + j] =
					(data[i + j] & ~1) | parseInt(binarizedText[binaryIndex])
				binaryIndex++
			}
		}

		context.putImageData(imgData, 0, 0)
		stegoImg.src = canvas.toDataURL()
	}

	img.src = URL.createObjectURL(uploadedImg.files[0])
	alert(`Pesan "${messageInput.value}" berhasil disisipkan ke gambar.`)
}

function extractMessageFromImage(e) {
	e.preventDefault()

	const uploadedImg = document.getElementById('img-upload')
	const stegoImg = document.getElementById('extracted-img')
	const messageExtracted = document.getElementById('insert-message')

	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	const aKey = document.getElementById('a-cipher-key').value
	const bKey = document.getElementById('b-cipher-key').value

	if (!uploadedImg) {
		alert(
			'Gambar belum terbaca oleh sistem, silahkan unggah gambar terlebih dahulu.'
		)
		return
	}

	if (!aKey && !bKey) {
		alert(
			'kunci a dan b kosong, silahkan isi masing - masing kunci terlebih dahulu.'
		)
		return
	}

	var img = new Image()

	img.onload = function () {
		canvas.width = img.width
		canvas.height = img.height

		context.drawImage(img, 0, 0)
		const imgData = context.getImageData(0, 0, img.width, img.height)
		const data = imgData.data

		// text to binary
		let binaryText = new String()

		for (let i = 0; i < data.length; i += 4) {
			for (let j = 0; j < 3; j++) {
				binaryText += (data[i + j] & 1).toString()
			}
		}

		// insert message to the image rgb bit
		let encryptedMsg = new String()
		for (let i = 0; i < binaryText.length; i += 8) {
			var byte = binaryText.slice(i, i + 8)
			if (!parseInt(byte, 2)) {
				break
			}
			encryptedMsg += String.fromCharCode(parseInt(byte, 2))
		}

		const msg = AffineCipher.decryptCipher(
			encryptedMsg,
			parseInt(aKey),
			parseInt(bKey)
		)

		context.putImageData(imgData, 0, 0)
		stegoImg.src = canvas.toDataURL()
		messageExtracted.value = msg
	}

	img.src = URL.createObjectURL(uploadedImg.files[0])
	alert(`Pesan berhasil diekstrak dari gambar.`)
}
