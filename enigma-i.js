String.prototype.letterIndex = function () {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(this[0]);
};

Number.prototype.mod = function (n) {
		return ((this % n) + n) % n;
}

var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

var rotors = ['EKMFLGDQVZNTOWYHXUSPAIBRCJ',
				'AJDKSIRUXBLHWTMCQGZNPYFVOE',
				'BDFHJLCPRTXVZNYEIWGAKMUSQO',
				'ESOVPZJAYQUIRHXLNFTGKDCMWB',
				'VZBRGITYUPSDNHLXAWMJQOFECK'
];

var reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split('');

var steps = "ACEINQTVY";

populateEmptyArrays = function (vars, num) {
		//Function to pre-populate multiple 2D arrays
		//vars = Array of variable names to pre-populate with arrays
		//num = Array size
		if (!(vars instanceof Array) || isNaN(num)) return;

		for (i in vars)
				window[vars[i]] = function (a) {
						while (a.push([]) < num);
						return a
		}([]);

};

initRotors = function (ori, rot) {
		//set = Initial rotor setting, e.g. AOAKN
		//ori = Rotor Orientation
		//rot = Initial rotor configuration

		//These store the initial letters of the rotor e.g. ['E','K','M'..]
		populateEmptyArrays(['Lrotor', 'Mrotor', 'Rrotor', 'Lstator', 'Rstator'], 0);

		//Generate Empty Rotor Arrays
		populateEmptyArrays(['L', 'M', 'R', 'LS', 'RS'], 26);

		//Generate Inverse Rotor Arrays
		populateEmptyArrays(['L_inv', 'M_inv', 'R_inv', 'LS_inv', 'RS_inv'], 26);

		// initialize rotor and reflector arrays
		for (i = 0; i < 26; ++i) {
				Lrotor[i] = rotors[rot[0]][i];
				Mrotor[i] = rotors[rot[1]][i];
				Rrotor[i] = rotors[rot[2]][i];
				Lstator[i] = rotors[rot[3]][i];
				Rstator[i] = rotors[rot[4]][i];
		} // next i


		// sets initial permutation
		for (i = 0; i < 26; ++i) {
				L[0][i] = Lrotor[i];
				M[0][i] = Mrotor[i];
				R[0][i] = Rrotor[i];
				LS[0][i] = Lstator[i];
				RS[0][i] = Rstator[i];
		} // next i

		// sets permutation for all other letters
		for (i = 1; i < 26; ++i) {
				for (j = 0; j < 26; ++j) {
						L[i][j] = Lrotor[(i + j) % 26];
						M[i][j] = Mrotor[(i + j) % 26];
						R[i][j] = Rrotor[(i + j) % 26];
						LS[i][j] = Lstator[(i + j) % 26];
						RS[i][j] = Rstator[(i + j) % 26];
				} // next j
		} // next i


		//Reverse rotors
		for (i = 0; i < 5; ++i) {
				if (ori[i] == 1) {
						reverse(i);
				}
		}

		// find inverse permutation
		for (i = 0; i < 26; ++i) {
				for (j = 0; j < 26; ++j) {
						L_inv[i][L[i][j].letterIndex()] = alpha[j];
						M_inv[i][M[i][j].letterIndex()] = alpha[j];
						R_inv[i][R[i][j].letterIndex()] = alpha[j];
						LS_inv[i][LS[i][j].letterIndex()] = alpha[j];
						RS_inv[i][RS[i][j].letterIndex()] = alpha[j];
				}
		}
		//console.log(L[0]);
		//console.log(L_inv[0]);
		//console.log(R[1][0]); //Right rotor 1 step forward, encode plaintext letter A

}



simulator = function () {
		initRotors('00000', '01234');
		var key = 'ABCAA';
		var ct = "AEFAEJXXBNXYJTY".split('');

		stepL = 0;
		stepM = 0;
		stepR = 0;

		cur_L = key[0].letterIndex();
		cur_M = key[1].letterIndex();
		cur_R = key[2].letterIndex();
		cur_LS = key[3].letterIndex();
		cur_RS = key[4].letterIndex();

		output = '';

		for (var x in ct) {
				ct_letter = ct[x].letterIndex();

				//Stepping
				//Advance right rotor 1 step
				cur_R = (cur_R + 1).mod(26);

				a = R[cur_R][ct_letter];
				b = M[cur_M][(a.letterIndex() - cur_R).mod(26)];
				c = L[cur_L][(b.letterIndex() - cur_M).mod(26)];
				ref = reflector[(c.letterIndex() - cur_L).mod(26)];
				d = L_inv[cur_L][(ref.letterIndex() + cur_L).mod(26)];
				e = M_inv[cur_M][(d.letterIndex() + cur_M).mod(26)];
				f = R_inv[cur_R][(e.letterIndex() + cur_R).mod(26)];


				output += f;

				//if(x==0) break;

		}

		console.log(output);

}

simulator();




reverse = function (x) {
		var i, j;
		var newrotor = [];

		for (i = 0; i < 26; i++) {
				newrotor[i] = [];
		}

		// reverse Left rotor
		if (x == 0) {
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								newrotor[i][j] = L[i][(26 - j) % 26];
						}
				}
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								L[i][j] = newrotor[i][j];
						}
				}
		}
		// reverse Middle rotor
		if (x == 1) {
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								newrotor[i][j] = M[i][(26 - j) % 26];
						}
				}
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								M[i][j] = newrotor[i][j];
						}
				}
		}
		// reverse Right rotor
		if (x == 2) {
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								newrotor[i][j] = R[i][(26 - j) % 26];
						}
				}
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								R[i][j] = newrotor[i][j];
						}
				}
		}
		// reverse Left Stator
		if (x == 3) {
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								newrotor[i][j] = LS[i][(26 - j) % 26];
						}
				}
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								LS[i][j] = newrotor[i][j];
						}
				}
		}
		// reverse Right Stator
		if (x == 4) {
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								newrotor[i][j] = RS[i][(26 - j) % 26];
						}
				}
				for (i = 0; i < 26; ++i) {
						for (j = 0; j < 26; ++j) {
								RS[i][j] = newrotor[i][j];
						}
				}
		}

}