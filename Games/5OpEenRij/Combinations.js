
/* 
===== object: combination =====
curtype:    		E voor Empty , X#, O#, D voor Dead
curnumbers: []		nummers in de combinatie. Negatief voor geen waarde, positief heeft waarde  
*/


var gaCombinations = [];
var WinWidth = 5;
var RowWidth = 10;
var gsValue = "O";
var gaMarked = [];
var gbGameActive = false;
var gbDead = false;
var gsFilter = "A"
var gsStartUser = gsValue;

function SetTitle(){
	let myTitle = document.getElementById('Title');
	if(myTitle)	myTitle.textContent = WinWidth.toString() + ' in a Row';
}


// RowWidth = 3, WinWidth = 3
// 123
// 456
// 789

// H123
// V147
// L159
// V258
// V369
// R357
// H456
// H789
// totaal 8 stuks


function Create(NoMsg) {
	let result = false;

	if(gaCombinations.length > 0) {
		if(!gbGameActive){
			result = confirm("Start new game?");
		} else {
			result = confirm("Game active! \nStart new game?");
		}
	    if(result == false) return;
	} 

	gsStartUser = Opponent(gsValue);
	gsValue = gsStartUser;
	gsFilter = "A";
	gaCombinations = [];
	OptionClearAll("AllCombs");

	let txtobj = document.getElementById("OnTurn");
	txtobj.style.backgroundColor='White';

	createCombinations(RowWidth,WinWidth);

	document.getElementById('Filter').value = 'A';

	ShowAllCombinations(gsFilter);

	Game();

	document.getElementById("OnTurn").innerHTML = "OnTurn: " + gsValue;
	gbGameActive = true;

	ComputerMove();
}


function Game() {
	let sHtml = "";
	for( var iRow = 1; iRow <= RowWidth; iRow++ ){
			  for( var iCol = 1; iCol <= RowWidth; iCol++) {  
				var iButton = (iRow * RowWidth) + iCol - RowWidth;
				  var sIdVal = iButton.toString();
				  sHtml = sHtml + "<input type='button' id=" + sIdVal + " class='mybutton_normal' value=' ' onclick='Button(" + sIdVal + ")'/>";
			  }
			  sHtml = sHtml + "<br/>";
	}
    document.getElementById("game").innerHTML = sHtml;

}


function ComputerMove(){
	if(gbGameActive){ 
		let computerID = gsValue + "_Computer";
		if(document.getElementById(computerID).checked){
			let bttnnr = GetAdvice();
			if(bttnnr > 0) Button(bttnnr);
		}
	}
}

function newcombination(newcombtype,newnumbers) {
	let value = {curtype:newcombtype, curnumbers:newnumbers};
	return value;
}


function createCombinations(RowWidth,WinWidth) {
	let maxcol = RowWidth + 1 - WinWidth;
	let maxrow = RowWidth + 1 - WinWidth;

    for(row = 1 ; row <= RowWidth; row++) {
		for(col = 1; col <= RowWidth; col++){

			let nr = ((row-1) * RowWidth) + col;

			// horizontal
			if(col <= maxcol){
				gaCombinations.push(newcombination("E",GetNumbers(nr, 1, WinWidth)));
			} 

			// vertical
			if(row <= maxrow){
				gaCombinations.push(newcombination("E",GetNumbers(nr, RowWidth, WinWidth)));
			} 

			// TlBr
			if((col <= maxcol) && (row <= maxrow)){
				gaCombinations.push(newcombination("E",GetNumbers(nr, RowWidth + 1, WinWidth)));
			} 

			// TrBl
			if((col >= WinWidth) && (row <= maxrow)){
				gaCombinations.push(newcombination("E",GetNumbers(nr, RowWidth - 1, WinWidth)));
			} 
		}
	}
}

function GetNumbers(StartNummer, delta, WinWidth) {
	let arr = [];
	for(i=0; i < WinWidth; i++){
		let nr= StartNummer + (i * delta);
		arr.push(nr)
	}
	return arr;
}


function Button(id){

	if(!gbGameActive) return;

	let curval = document.getElementById(id).value;
	if(curval !== " ") return;

	document.getElementById(id).value = gsValue;

	let ids = [];
	ids.push(id);
	MarkButtons(ids);

	CombinationChange(id);
	ShowAllCombinations();


	// check winner
	let idx = GetCombination(gsValue + WinWidth);
	if(idx.length > 0){
		let mycomb = gaCombinations[idx[0]];
		let mytype = mycomb.curtype;
		let mynrs = mycomb.curnumbers;
		MarkButtons(mynrs);
		// for(let i = 0; i < mynrs.lenght; i++) ButtonShow(mynrs[i],true);

		let txtobj = document.getElementById("OnTurn");
		txtobj.style.backgroundColor='LightGreen';
		document.getElementById("OnTurn").innerHTML = "Winner >>>> " + gsValue;
		// update Winner
		let WinID = gsValue + "_winner";
		let WinNr = parseInt(document.getElementById(WinID).value) + 1;
		document.getElementById(WinID).value = WinNr;
		gbGameActive = false;

	} else {
		gsValue = Opponent(gsValue);
		document.getElementById("OnTurn").innerHTML = "OnTurn: " + gsValue;
	}

	ComputerMove();

}


function OptionAdd(id, myValue, Clean) {
	let optelem = document.getElementById(id);
	if(Clean == true) {
		while (optelem.length > 0) {
			optelem.remove(0);
		}
		// optelem.removeAll;
	}
	var opt = document.createElement('option');
	opt.value = myValue;
	opt.innerHTML = myValue;
	optelem.appendChild(opt);
}


function OptionClearAll(id) {
	let optelem = document.getElementById(id);
	while (optelem.length > 0) {
		optelem.remove(0);
	}
}


function ShowAllCombinations() {
	let optID = "AllCombs";
	let count = 0;
	let dead = 0;
	let curfilter = gsFilter;

	if(!curfilter) curfilter = "A";

	OptionClearAll(optID)

	if(gaCombinations.length == 0) return 0;

	for(let i=0; i< gaCombinations.length; i++){
		let comb = gaCombinations[i];
		let mytype = comb.curtype;
		let mynrs = comb.curnumbers;

		if(mytype == "D") dead++;

		if(curfilter == "A"){
			OptionAdd(optID,mytype + ":" + mynrs.toString());
			count++;
		}else {
			let curtype = mytype.substring(0,1);
			if(curfilter == curtype){
				OptionAdd(optID,mytype + ":" + mynrs.toString());
				count++;
			}
		}
		
	}
	gbDead = (gaCombinations.length == dead);

	var MyObj = document.getElementById("Count");
	// MyObj.innerText = "Combinations: " + gaCombinations.length.toString() + "<br> Filter: " + gsFilter + "<br> Visible: " + count.toString();
	MyObj.innerHTML = "Combinations: " + gaCombinations.length.toString() + "<br> Filter: " + gsFilter + "<br> Visible: " + count.toString();
	if(gbDead) MyObj.innerText += "  >>> No winner possible..."
	return count;
}


function CombinationChange(id){
	let bttnnr = parseInt(id);
	let ichanged = 0;

	for(let iComb=0; iComb < gaCombinations.length; iComb++){
		// let value = {curtype:newcombtype, curnumbers:newnumbers};
		let comb = gaCombinations[iComb];
		let mytype = comb.curtype;
		let mynrs = comb.curnumbers;

		let idx = mynrs.indexOf(bttnnr);
		if( idx >= 0){
			mynrs[idx] = -bttnnr;
			mytype = SetType(mynrs);

			// replace comb
			let value = newcombination(mytype,mynrs);
			gaCombinations[iComb] = newcombination(mytype,mynrs);
		}
	}
}


function SetType(MyNumbers) {
	let Xnr = 0;
	let Onr = 0;
	let myType = "E";

	for(i=0; i < MyNumbers.length; i++){
		let nr = Math.abs(MyNumbers[i]);
		let sval = document.getElementById(nr.toString()).value;
		switch (sval) {
			case "X":
				Xnr+=1;
				break;
		case "O":
			Onr+=1;
			break;		
		default:
			break;
		}
	}

	if(Xnr == 0 && Onr == 0){
		myType = "E";
	} else if(Xnr !== 0 && Onr !== 0){
	    myType = "D";
	} else 
	if(Xnr > 0 && Onr == 0){
	    myType = "X" + Xnr.toString();
	} else 
	if(Xnr == 0 && Onr !== 0){
	    myType = "O" + Onr.toString();
	}
	return myType;
}

function ViewInfo() {
	let vi = document.getElementById("ViewInfo");
	let x = document.getElementById("InfoTable");
	if(vi.checked)
		x.style.display = "block"; 
	else
		x.style.display = "none";

}

function Selected(id) {
    var selectBox = document.getElementById(id);
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	var pos = selectedValue.indexOf(":");

	if(pos >= 0){
		let arrtext = selectedValue.substring(pos+1);
		let nrs = arrtext.split(",");
		MarkButtons(nrs);
	}
}

function GetFilter(id) {
    var selectBox = document.getElementById(id);
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	gsFilter = selectedValue;
	var visible = ShowAllCombinations(selectedValue);
	
}


function MarkButtons(buttonnrs){
	// unmark previous
	for(let i=0; i<gaMarked.length; i++){
		ButtonShow(gaMarked[i], false);
	}

	for(let i=0; i<buttonnrs.length; i++){
		ButtonShow(buttonnrs[i], true);
	}
	gaMarked = buttonnrs;
}

function ButtonShow(id, mark) {
    let myID = "";
	// make numeric  if (typeof x !== 'number
	if(typeof(id) == 'number'){
		let nr=Math.abs(id);
		myID = nr.toString();
	} else 	if(typeof(id) == 'string'){
		let nr=parseInt(id);
		nr=Math.abs(id);
		myID = nr.toString();
	}

	if(myID=="") return;
 
	var MyObj = document.getElementById(myID);
	var MyVal = MyObj.value;

	if(MyVal == " ") MyVal = "";

	// .mybutton_Xhilite
	let clname = "mybutton_" + MyVal;
	if(mark){
		MyObj.setAttribute("class", clname + "hilite");
	} else {
		MyObj.setAttribute("class", clname + "normal");
	}	
 }

function GetCombination(searchType){
	let foundidx = [];
	// let msg = "Search: " + searchType + "\n";

	for(let iComb=0; iComb < gaCombinations.length; iComb++){
		// let value = {curtype:newcombtype, curnumbers:newnumbers};
		let mycomb = gaCombinations[iComb];
		let mytype = mycomb.curtype;
		let mynrs = mycomb.curnumbers;

		if(mytype == searchType){
			foundidx.push(iComb);
			// msg += "Index:" + iComb.toString() + " = " + mytype + ":" + mynrs.toString() + "\n";
		}
	}
	// alert(msg);
	return foundidx;
}

function Advise() {
	if(!gbGameActive) return;

	let nr = GetAdvice();

	if(nr)
		if(nr > 0) Button(nr); else alert("No Advised number ... ");

}


function GetAdvice(){
	let own = gsValue;
	let opp = Opponent(own);
	let advnr = 0;

	// check if (WinWidth - 1) exist for ButtonValue
	advnr = AdvicedNumber(own + (WinWidth-1).toString(), false);
	if(advnr > 0) return advnr;

	// check if (WinWidth - 1) exist for opponent of ButtonValue
	advnr = AdvicedNumber(opp + (WinWidth-1).toString(), false);
	if(advnr > 0) return advnr;

	// check crossing
	for(let cnt = WinWidth-2; cnt > 0; cnt--){
		advnr = AdvicedNumber(own + cnt.toString(), true);
		if(advnr > 0) return advnr;

		advnr = AdvicedNumber(opp + cnt.toString(), true);
		if(advnr > 0) return advnr;
	}
	// check NOT crossing
	for(let cnt = WinWidth-2; cnt > 0; cnt--){
		advnr = AdvicedNumber(own + cnt.toString(), false);
		if(advnr > 0) return advnr;

		advnr = AdvicedNumber(opp + cnt.toString(), false);
		if(advnr > 0) return advnr;
	}

	// if not returned
	advnr = AdvicedFreeNumber();
	return advnr;
}

function AdvicedNumber(sType, crossed) {
	let nr = 0;
	let combIdxs = GetCombination(sType);
	let combIdxsLength = combIdxs.length;

	OptionClearAll("Reason");

	if(combIdxsLength > 0) {
		let nr = 0;
		let snr = sType.substring(2,1);
		let usedcount = parseInt(snr);

		// check for winning combination: usedcound = (rowwidth - 1)
		if(usedcount == WinWidth - 1){
			let mycomb = gaCombinations[combIdxs[0]];
			let nrs = mycomb.curnumbers;
			for(i=0; i < nrs.length; i++){
				let curnr = nrs[i];
				if(curnr > 0) {
					UpdateMoveInfo(sType,crossed,"Fixed:" + (WinWidth - 1).toString() + "<br>Nr:" + curnr.toString());
					OptionAdd("Reason",sType + ":" + nrs.toString());
					return curnr;
				}
			}
			// if not returned
			return 0;
		}
		
		// check for crossed combination
		if(crossed){ 
			if(combIdxs.lenght < 2) {
				// no crossing possible
				return 0;
			} else {
				let istart = 0;
				let imax = combIdxs.length - 1;

				for(let i = 0; i < combIdxs.length - 1; i++){
					for(let n = i+1; n < combIdxs.length; n++){
						let icomb = gaCombinations[combIdxs[i]].curnumbers;
						let ncomb = gaCombinations[combIdxs[n]].curnumbers;
						// check if freenr exists in both combination
						let crossnr = GetCross(icomb, ncomb);
						if(crossnr > 0) {
							UpdateMoveInfo(sType,crossed," ,Nr:" + crossnr.toString());
							// add combs to reason
							OptionAdd("Reason",sType + ":" + icomb.toString());
							OptionAdd("Reason",sType + ":" + ncomb.toString());
							return crossnr;
						}
					}
				}
			}
		} else {
			// not crossed
			if(combIdxsLength > 0) {
				let cmbnr = combIdxs[0];
				let icomb = gaCombinations[cmbnr].curnumbers;
				const icombLenght = icomb.length;
				let usedNrs = [];
				let freeNrs = [];
				let sumNrs = 0;

				for(let i = 0; i < icombLenght; i++){
					let curnr = icomb[i];
					if(curnr < 0){
						sumNrs += Math.abs(curnr);
						usedNrs.push(Math.abs(curnr));
					} else {
						freeNrs.push(curnr);
					}
				}
				// average
				let delta = 1000;
				let rtnval = 0;
				let average = sumNrs / usedNrs.length;
				// console.log("Free:" + freeNrs);
				// console.log("Used:" + usedNrs);
				for(let i = 0; i < freeNrs.length; i++){
					if(average - freeNrs[i] < delta){
						rtnval = freeNrs[i];
						delta = Math.abs(average - freeNrs[i]);
					}
				}
				if(rtnval > 0) {
					UpdateMoveInfo(sType,crossed," ,Nr:" + rtnval.toString());
					// add coms to reason
					OptionAdd("Reason",sType + ":" + icomb.toString());
					return rtnval;
				}
			}
		}
	}

	return nr;
}



function AdvicedFreeNumber(){
	let nr = 0;

	let freenrs = [];
	for(i = 1; i <= ( RowWidth * RowWidth); i++ ){
		let bttn = document.getElementById(i.toString());
		if( bttn.value !== "X" && bttn.value !== "O") freenrs.push(i);
	}
	// if all buttons empty
	if(freenrs.length == (RowWidth * RowWidth)){
		let col = Math.floor(RowWidth / 2);
		let row = col;
		nr = ((row - 1) * RowWidth) + col;
		UpdateMoveInfo("", "", "Use centrum button<br>Nr:" + nr.toString());
		return nr;	
	}
	if(freenrs.length == 0) {
		alert("All buttons used!  No Winner...");
		UpdateMoveInfo("", "", "NO Free cell<br>Nr:" + nr.toString());
		gbGameActive = false;
		return 0;
	}

	// not any combination found, search empty combs
	let combIdxs = GetCombination("E");
	let combIdxsLength = combIdxs.length;

	if(combIdxs.length > 0){
		let cmbnr = combIdxs[0];
		let icomb = gaCombinations[cmbnr].curnumbers;
		// get middle number
		let mid = Math.floor(icomb.length / 2);
		UpdateMoveInfo("", "", "Search in Empty<br>Nr:" + icomb[mid].toString());
		return icomb[mid];
	}

	// if not returned
	let rndnr = Math.floor(getRandomArbitrary(0, freenrs.length - 1));
	return freenrs[rndnr];
}


function UpdateMoveInfo(Type, Crossed, Message){
	var MoveInfo = document.getElementById("Move");
	if(MoveInfo){
		let msg = "Move Info: Type:" + Type + "<br>Crossed:" + Crossed + "<br>Message:" + Message;
		MoveInfo.innerHTML = msg;
	}
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function GetCross(comb1, comb2){
	// check delta, no cross with same delta
	let delta1 = Math.abs(comb1[0] - comb1[1]);
	let delta2 = Math.abs(comb2[0] - comb2[1]);
	if(delta1 == delta2) return 0;

	for(var i = 0; i < WinWidth; i++){
		for(var n = 0; n < WinWidth; n++){
			if(comb1[i] == comb2[n] && comb2[n] > 0) {
				// console.log(comb1 + " <> " + comb2 + " Result:" + comb2[n]);
				return comb2[n];
			}
		}
	}
	return 0;
}

function Opponent(BttnValue) {
	let rtnval = "";
	if(BttnValue == "X") rtnval = "O"; else rtnval = "X";
	return rtnval;
}
