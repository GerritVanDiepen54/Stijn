let bord = [
	[' ', ' ', ' '],
	[' ', ' ', ' '],
	[' ', ' ', ' '],
];

const cellinfo = {
	teken : 0,
	ander : 0,
	leeg :  0,
	rijleeg : -1,
	kolomleeg : -1,
};
  
let spelAfgelopen = false;
let spelerAanZet;

let autorij = -1;
let autokolom = -1;
let spelnr = 0;
let ZettenGedaan = 0


let alleStatussen = [
	'Klik [nieuw spel] om te beginnen',
	'Speler X is aan zet',
	'Speler O is aan zet',
	'Speler X heeft gewonnen',
	'Speler O heeft gewonnen',
	'Gelijkspel',
];
let msgstatus = 'Klik [nieuw spel] om te beginnen';

let hgt = 460

function moveImage(top,left,bottom,right) {

   document.getElementById('image').style.top = top.toString() + 'px';
   document.getElementById('image').style.left = left.toString() + 'px';
   document.getElementById('image').style.bottom = bottom.toString() + 'px';
   document.getElementById('image').style.right = right.toString() + 'px';

   let newhgt = hgt + top + bottom;
   document.getElementById('divimage').style.height = newhgt.toString() + 'px';

}

function pak(id) {
	const element = document.getElementById(id);

	if (!element) {
		alert(`Je hebt pak('${id}') aangeroepen, maar er bestaat geen element met ID ${id} op de pagina!`);
	}

	return element;
}

function aanZet() {

	if( spelnr % 2 == 0) {
		spelerAanZet = 'X';
		msgstatus = 'Speler X is aan zet';
	} else {
		spelerAanZet = 'O';
		msgstatus = 'Speler O is aan zet';		
	}
}

function nieuwSpel() {
	bord = [
		[' ', ' ', ' '],
		[' ', ' ', ' '],
		[' ', ' ', ' '],
	];
	spelAfgelopen = false;

	autorij = -1;
	autokolom = -1;
	spelnr++;

	ZettenGedaan = 1

	ShowFoto(0);

	aanZet();
	
	beeldSpelAf();

	automatic();


}

function beeldSpelAf() {
	for (let rij = 0; rij < 3; rij++) {
		for (let kolom = 0; kolom < 3; kolom++) {
			let vakje = pak("rij_" + rij + "_kolom_" + kolom);
			vakje.style.display = "block";
			vakje.innerText = bord[rij][kolom];

			if(bord[rij][kolom] != " ") {
				vakje.className = "button_Game" + bord[rij][kolom] ;
			}
		}
	}

	let bttn = pak("nieuwspel");
	if(spelAfgelopen) {
		bttn.className = "button_NieuwSpel";
	} else {
		bttn.className = "button_NieuwSpel_Actief";
	}

	showmessage();

}

function isWinnaar(teken) {
	for (let kolom = 0; kolom < 3; kolom++) {
		if (isKolomWinnaar(kolom, teken)) {
			return true;
		}
	}

	for (let rij = 0; rij < 3; rij++) {
		if (isRijWinnaar(rij, teken)) {
			return true;
		}
	}

	if (isDiagonaalLinksBovenRechtsOnderWinnaar(teken)) {
		return true;
	}

	if (isDiagonaalLinksOnderRechtsBovenWinnaar(teken)) {
		return true;
	}

	return false;
}


function isKolomWinnaar(kolom, teken) {
	return	bord[0][kolom] === teken && bord[1][kolom] === teken && bord[2][kolom] === teken
}



function isRijWinnaar(rij, teken) {
    return bord[rij][0] === teken && bord[rij][1] === teken && bord[rij][2] === teken
}


function isDiagonaalLinksBovenRechtsOnderWinnaar(teken) {
	return bord[0][0] === teken && bord[1][1] === teken && bord[2][2] === teken;
}

function isDiagonaalLinksOnderRechtsBovenWinnaar(teken) {
	return bord[0][2] === teken && bord[1][1] === teken && bord[2][0] === teken;
}


function isBordVol() {
	for (let rij = 0; rij < 3; rij++) {
		for (let kolom = 0; kolom < 3; kolom++) {
			if (bord[rij][kolom] === ' ') {
				return false;
			}
		}
	}
	return true;
}


function verwerkZet() {

	if (isWinnaar('X')) {
		spelAfgelopen = true;
		msgstatus = 'Speler X heeft gewonnen';
		let Iwon = document.getElementById("wonX").value;
		Iwon = parseInt(Iwon) + 1;
		document.getElementById("wonX").value = Iwon;
		PlaySound("X");

	} else if (isWinnaar('O')) {
		spelAfgelopen = true;
		msgstatus = 'Speler O heeft gewonnen';
		let Iwon = document.getElementById("wonO").value;
		Iwon = parseInt(Iwon) + 1;
		document.getElementById("wonO").value = Iwon;
		PlaySound("O");
		
	} else if (isBordVol()) {
		spelAfgelopen = true;
		msgstatus = 'Gelijkspel';
		PlaySound("=");

	} else if (spelerAanZet === 'X') {
		spelAfgelopen = false;
		msgstatus = 'Speler X is aan zet';
		automatic();

	} else {
		spelAfgelopen = false;
		msgstatus = 'Speler O is aan zet';
		automatic();

	}
}

function ShowFoto(nr) {
	if(nr == 0) {
		moveImage(-190,0,-230,0)
	} else {
		moveImage(0,0,0,0)
	}
}


function PlaySound(teken) {
	if( teken == 'X' || teken == 'O' ) {
		let name = pak("name" + teken);
		let val = name.value;
		val = val.toLowerCase();
		if(val === "stijn") {
			ShowFoto(1);
		}
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	let sndbttn = pak("sound");
	if(sndbttn.checked){
		let audio;
		if( teken == 'X' || teken == 'O' ) {
			audio = new Audio('victory.mp3');
			audio.loop = false;
			audio.play(); 
		}
		else {
			audio = new Audio('equal.wav');
			audio.loop = false;
			audio.play(); 
		}
	}

}

function veldGekozen(rij, kolom) {
	if (spelAfgelopen) {
		return;
	}
	if (bord[rij][kolom] !== ' ') {
		return;
	}
	if (msgstatus === 'Klik [nieuw spel] om te beginnen') {
		return;
	}
	autorij = rij;
	autokolom = kolom;
	doeZet(rij, kolom);
	beeldSpelAf();

	ZettenGedaan++;

}



function ander(teken) {
	if (teken === 'X') {
		return 'O';
	} else {
		return 'X';
	}
}

function doeZet(rij, kolom) {
	bord[rij][kolom] = spelerAanZet;
	spelerAanZet = ander(spelerAanZet);
	verwerkZet();
}


function automatic() {
	if(spelAfgelopen === true) {
		console.log("spelAfgelopen !!  ");
		return;
	}
	let comp = "comp" + spelerAanZet

	if(document.getElementById(comp).value != "nee") {

		// indien midden vrij gebruik het dan
		if (bord[1][1] === ' ') {
			veldGekozen(1, 1);
			return;
		}

		if(document.getElementById(comp).value != "zwak"){
			// aanval
			for (let rij = 0; rij < 3; rij++) {
				if(rijwinst(rij, spelerAanZet)) {
					console.log("aanval rijwinst  ");
					return;
				}
			}

			for (let kolom = 0; kolom < 3; kolom++) {
				if(kolomwinst(kolom, spelerAanZet)) {
					console.log("aanval kolomwinst  ");
					return;
				}
			}

			if(diagonaalwinst(spelerAanZet)){
				console.log("aanval diagonaalwinst  ");
				return;
			}

			// verdediging
			for (let rij = 0; rij < 3; rij++) {
				if(rijwinst(rij, ander(spelerAanZet))) {
					console.log("verdediging rijwinst  ");
					return;
				}
			}

			for (let kolom = 0; kolom < 3; kolom++) {
				if(kolomwinst(kolom, ander(spelerAanZet))) {
					console.log("verdediging kolomwinst  ");
					return;
				}
			}

			if(diagonaalwinst(ander(spelerAanZet))){
				console.log("verdediging diagonaalwinst  ");
				return;
			}
		}


		// winst voor spelerAanZet
		// alleen indien in midden spelerAanZet
		// en zet 1 van opponent is een midden in de rand

		if(document.getElementById(comp).value == "sterk") {
			if (bord[1][1] === spelerAanZet && ZettenGedaan == 2) {
				let Opponent = ander(spelerAanZet)
				if(bord[0][1] === Opponent) {
					// middenboven
					veldGekozen(2,0);
					console.log("winst in 2  ");
					return;
				}
				else if(bord[1][2] === Opponent) {
					// middenrechts
					veldGekozen(0, 0);
					console.log("winst in 2  ");
					return;
				}
				else if(bord[2][1] === Opponent) {
					// middenonder
					veldGekozen(0, 0);
					console.log("winst in 2  ");
					return;
				}
				else if(bord[1][0] === Opponent) {
					// middenlinks
					veldGekozen(2, 0);
					console.log("winst in 2  ");
					return;
				}
			}
		}

		if(document.getElementById(comp).value == "sterk") {
			// zoek eigen intersecties
			for(r=0;r < 3; r++) {
				for(k=0; k < 3; k++){
					if(bord[r][k] === ' '){
						if(intersection(r,k, spelerAanZet)) {
							console.log("aanval intersectie  ");
							return;
						}
					}

				}
			}
			// zoek opponent intersecties
			for(r=0;r < 3; r++) {
				for(k=0; k < 3; k++){
					if(bord[r][k] === ' '){
						if(intersection(r,k, ander(spelerAanZet))) {
							console.log("verdediging intersectie  ");
							return;
						}
					}

				}
			}
		}



		// zoek de eerste lege hoek
		if (bord[0][0] === ' ') {
			veldGekozen(0, 0);
			console.log("eerste hoek leeg  ");
			return;
		} else if (bord[0][2] === ' ') {
			veldGekozen(0, 2);
			console.log("eerste hoek leeg  ");
			return;
		} else if (bord[2][0] === ' ') {
			veldGekozen(2, 0);
			console.log("eerste hoek leeg  ");
			return;
		} else if (bord[2][2] === ' ') {
			veldGekozen(2, 2);
			console.log("eerste hoek leeg  ");
			return;
		}  	  		

		// indien nog niet gezet, zoek de eerste lege
		for (let rij = 0; rij < 3; rij++) {
			for (let kolom = 0; kolom < 3; kolom++) {
				if (bord[rij][kolom] === ' ') {
					veldGekozen(rij, kolom);
					console.log("eerste leeg  ");
					return;
				}
			}
		}
	}
}

function rijwinst(rij, teken) {
	let MyInfo = Object.create(cellinfo);

	for (let kolom = 0; kolom < 3; kolom++) {
		info(rij,kolom, teken, MyInfo);
	}
	if(MyInfo.teken === 2 && MyInfo.ander === 0 && MyInfo.leeg === 1) {
		veldGekozen(MyInfo.rijleeg, MyInfo.kolomleeg);
		return true;
	}
	return false;
}


function kolomwinst(kolom, teken) {
	let MyInfo = Object.create(cellinfo);

	for (let rij = 0; rij < 3; rij++) {
		info(rij,kolom, teken, MyInfo);
	}
	if(MyInfo.teken === 2 && MyInfo.ander === 0 && MyInfo.leeg === 1) {
		veldGekozen(MyInfo.rijleeg, MyInfo.kolomleeg);
		return true;
	}
	return false;
}


function diagonaalwinst(teken) {

	// diagonaal 1
	let MyInfo = Object.create(cellinfo);
	for(let i=0; i < 3; i++){
		info(i,i, teken, MyInfo);
	}
	if(MyInfo.teken === 2 && MyInfo.ander === 0 && MyInfo.leeg === 1) {
		veldGekozen(MyInfo.rijleeg, MyInfo.kolomleeg);
		return true;
	}

	// diagonaal 2
	MyInfo = Object.create(cellinfo);

	info(0,2, teken, MyInfo);
	info(1,1, teken, MyInfo);
	info(2,0, teken, MyInfo);

	if(MyInfo.teken === 2 && MyInfo.ander === 0 && MyInfo.leeg === 1) {
		veldGekozen(MyInfo.rijleeg, MyInfo.kolomleeg);
		return true;
	}

	return false;
}

function intersection(rij, kolom, teken) {

	teken = ander(teken);

	let MyRow = Object.create(cellinfo);
	info(rij,0, teken, MyRow);
	info(rij,1, teken, MyRow);
	info(rij,2, teken, MyRow);

	let MyCol = Object.create(cellinfo);
	info(0,kolom, teken, MyCol);
	info(1,kolom, teken, MyCol);
	info(2,kolom, teken, MyCol);

	if(MyRow.ander > 0 && MyCol.ander > 0 && (rij != 1 && kolom != 1)) return false

	if( MyRow.teken == 1 && MyRow.ander == 0 && MyCol.teken == 1 && MyCol.ander == 0) {
		veldGekozen(rij,kolom);
		return true;	
	}

	let MyDiag1 = Object.create(cellinfo);
	let MyDiag2 = Object.create(cellinfo);
	let check1 = false;
	let check2 = false;

	if(( rij == 0 && kolom == 0) || rij == 2 && kolom == 2){
		info(0,0, teken, MyDiag1);
		info(1,1, teken, MyDiag1);
		info(2,2, teken, MyDiag1);
		check1 = true;
	}
	else if(( rij == 0 && kolom == 2) || rij == 2 && kolom == 0){
		info(0,2, teken, MyDiag1);
		info(1,1, teken, MyDiag1);
		info(2,0, teken, MyDiag1);
		check1 = true;
	}
	else if( rij == 1 && kolom == 1) {
		info(0,2, teken, MyDiag1);
		info(1,1, teken, MyDiag1);
		info(2,0, teken, MyDiag1);

		info(0,0, teken, MyDiag2);
		info(1,1, teken, MyDiag2);
		info(2,2, teken, MyDiag2);
		check1 = true;
		check2 = true;
	}

	if( check1 == true || check2 == true) {

		if(MyDiag1.teken == 1 && MyDiag1.ander == 0 && MyCol.teken == 1 && MyCol.ander == 0) {
			veldGekozen(rij,kolom);
			return true;		
		}
		else if(MyDiag1.teken == 1 && MyDiag1.ander == 0 && MyRow.teken == 1 && MyRow.ander == 0) {
			veldGekozen(rij,kolom);
			return true;		
		}

		if( check2 == true) {
			if (MyDiag2.teken == 1 && MyDiag2.ander == 0 && MyCol.teken == 1 && MyCol.ander == 0) {
				veldGekozen(rij,kolom);
				return true;
			}
			else if (MyDiag2.teken == 1 && MyDiag2.ander == 0 && MyRow.teken == 1 && MyRow.ander == 0) {
				veldGekozen(rij,kolom);
				return true;
			}
			else if (MyDiag2.teken == 1 && MyDiag2.ander == 0 && MyDiag1.teken == 1 && MyDiag1.ander == 0) {
				veldGekozen(rij,kolom);
				return true;
			}
		}

    }
	return false;

}

function info(rij, kolom, teken, MyInfo) {
	if (bord[rij][kolom] === teken) {
		MyInfo.teken++;
	} 
	else if (bord[rij][kolom] === ander(teken)) {
		MyInfo.ander++;
	} 
	else { MyInfo.leeg++;
		   MyInfo.rijleeg = rij;
		   MyInfo.kolomleeg = kolom;
	}
}


function showmessage() {
	let msg = msgstatus;
	let posO = msgstatus.search(" O ");
	let posX = msgstatus.search(" X ");
	let myname = "";

	if(posO > 0){
		myname = document.getElementById("nameO").value;
		if( myname != "O" && myname != "") {
			msg = msgstatus.replace(" O ", " O: " + myname + " ");
		}
	}
	else if(posX > 0){
		myname = document.getElementById("nameX").value;
		if( myname != "X" && myname != "") {
			msg = msgstatus.replace(" X ", " X: " + myname + " ");
		}
	}


	document.getElementById("message").innerText = msg;
}


