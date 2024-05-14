class AffineCipher {
	static M = 26

	static gcd(a, b) {
		if (a == 0) return b

		return this.gcd(b % a, a)
	}

	static isCoprimeAndLessThanM(a) {
		return this.gcd(a, this.M) == 1 && a < this.M
	}

	static encryptMessage(message, a, b) {
		let cipherText = ''
		for (let i = 0; i < message.length; i++) {
			if (message[i] != ' ') {
				let charIndex = message[i].charCodeAt(0)
				if (charIndex >= 65 && charIndex <= 90) {
					cipherText += String.fromCharCode(
						((a * (message[i].charCodeAt(0) - 65) + b) % this.M) + 65
					)
				} else if (charIndex >= 97 && charIndex <= 150) {
					cipherText += String.fromCharCode(
						((a * (message[i].charCodeAt(0) - 97) + b) % this.M) + 97
					)
				}
			} else {
				cipherText += message[i]
			}
		}
		return cipherText
	}

	static decryptCipher(cipher, a, b) {
		let plainText = ''
		let a_inv = 0
		let flag = 0

		for (let i = 0; i < this.M; i++) {
			flag = (a * i) % this.M
			if (flag == 1) {
				a_inv = i
			}
		}

		for (let i = 0; i < cipher.length; i++) {
			if (cipher[i] != ' ') {
				let charIndex = cipher[i].charCodeAt(0)
				if (charIndex >= 65 && charIndex <= 90) {
					plainText += String.fromCharCode(
						((a_inv * (charIndex + 65 - b)) % this.M) + 65
					)
				} else if (charIndex >= 97 && charIndex <= 122) {
					let upperCaseIndex = charIndex - 32
					plainText += String.fromCharCode(
						((a_inv * (upperCaseIndex + 65 - b)) % this.M) + 97
					)
				}
			} else {
				plainText += cipher[i]
			}
		}

		return plainText
	}
}
