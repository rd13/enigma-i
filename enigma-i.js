String.prototype.letterIndex = function () {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(this[0]);
};

Number.prototype.mod = function (n) {
		return ((this % n) + n) % n;
}

function populateArray(vars, num) {
	//Function to pre-populate multiple 2D arrays
	//vars = Array of variable names to pre-populate with arrays
	//num = Array size
	if (!(vars instanceof Array) || isNaN(num)) return;

	for (i in vars)
		this[vars[i]] = function (a) {
			while (a.push([]) < num);
			return a
	}([]);
};

enigma = function() {
	
	this.rotors = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ',
					'AJDKSIRUXBLHWTMCQGZNPYFVOE',
					'BDFHJLCPRTXVZNYEIWGAKMUSQO',
					'ESOVPZJAYQUIRHXLNFTGKDCMWB',
					'VZBRGITYUPSDNHLXAWMJQOFECK'
	];

	this.reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

}

enigma.prototype.crypt = function() {
		this.initRotors('012');
		var key = 'ABC';
		var ct = "AEFAEJXXBNXYJTY".split('');

		stepL = 0;
		stepM = 0;
		stepR = 0;

		cur_L = key[0].letterIndex();
		cur_M = key[1].letterIndex();
		cur_R = key[2].letterIndex();

		output = '';

		for (var x in ct) {
				ct_letter = ct[x].letterIndex();

				//Stepping of right rotor
				cur_R = (cur_R + 1).mod(26);

				a = R[cur_R][ct_letter];
				b = M[cur_M][(a.letterIndex() - cur_R).mod(26)];
				c = L[cur_L][(b.letterIndex() - cur_M).mod(26)];
				ref = this.reflector.split('')[(c.letterIndex() - cur_L).mod(26)];
				d = L_inv[cur_L][(ref.letterIndex() + cur_L).mod(26)];
				e = M_inv[cur_M][(d.letterIndex() + cur_M).mod(26)];
				f = R_inv[cur_R][(e.letterIndex() + cur_R).mod(26)];


				output += f;

		}

		console.log(output);

};

enigma.prototype.initRotors = function (rot) {

		alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

		//Store the initial letters of the rotor e.g. ['E','K','M'..]
		populateArray(['Lrotor', 'Mrotor', 'Rrotor'], 0);

		//Generate Empty Rotor Arrays
		populateArray(['L', 'M', 'R'], 26);

		//Generate Inverse Rotor Arrays
		populateArray(['L_inv', 'M_inv', 'R_inv'], 26);

		// initialize rotor and reflector arrays
		for (i = 0; i < 26; ++i) {
				Lrotor[i] = this.rotors[rot[0]][i];
				Mrotor[i] = this.rotors[rot[1]][i];
				Rrotor[i] = this.rotors[rot[2]][i];
		} // next i


		// sets initial permutation
		for (i = 0; i < 26; ++i) {
				L[0][i] = Lrotor[i];
				M[0][i] = Mrotor[i];
				R[0][i] = Rrotor[i];
		} // next i

		// sets permutation for all other letters
		for (i = 1; i < 26; ++i) {
				for (j = 0; j < 26; ++j) {
						L[i][j] = Lrotor[(i + j) % 26];
						M[i][j] = Mrotor[(i + j) % 26];
						R[i][j] = Rrotor[(i + j) % 26];
				} // next j
		} // next i

		// find inverse permutation
		for (i = 0; i < 26; ++i) {
				for (j = 0; j < 26; ++j) {
						L_inv[i][L[i][j].letterIndex()] = alpha[j];
						M_inv[i][M[i][j].letterIndex()] = alpha[j];
						R_inv[i][R[i][j].letterIndex()] = alpha[j];
				}
		}
		//console.log(L[0]);
		//console.log(L_inv[0]);
		//console.log(R[1][0]); //Right rotor 1 step forward, encode plaintext letter A

}

var e = new enigma();

e.crypt();