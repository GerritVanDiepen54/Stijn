"use strict";


const g_MaxRow = 12;
const g_MaxColumn = 12;
var   g_PuzzleSolved = false;

const g_Empty = 0;
const g_Water = 1;
const g_Boat = 2;
const g_FixedWater = -1;
const g_FixedBoat = -2;

var g_WaterType = 0;
var g_CheckCount = 0;
var g_BoatList = [];
var g_DebugActive = false;
var g_DebugPW = "";

const imgboats = {
	// key			: value
	"img_leeg" 		: "0",
	"img_water" 	: "1",
	"img_mijn" 		: "2",
	"img_boot_vs" 	: "3",
	"img_boot_ve" 	: "4",
	"img_boot_m"	: "5",
	"img_boot_hs" 	: "6",
	"img_boot_he"	: "7"
}


async function Help(){
	let msg = "Voor een nieuwe puzzel: Kies aantal zichtbare bootonderdelen";
	msg += "\nGele rechthoek: aantal te plaatsen boten en hun vorm";
	msg += "\nBlauwe rechthoek: klik op het te plaatsen onderdeel";
	msg += "\nKlik hierna een op een cel in de puzzel\n";
	msg += "\n1. Plaats Water RIJ waar linker kolom overeenkomt met rechter kolom";
	msg += "\n2. Plaats Water KOLOM waar bovenste rij overeenkomt met de onderste";
	msg += "\n3. Plaats water direct grenzend aan boten";
	msg += "\n4. Plaats boot onderdelen waar het zeker is";
	msg += "\n\nHerhaal 1 tm 4"
	msg += "\n\nDe rest plaatsen en eventueel een 'Toon Oplossing'";
	msg += "\n\n\nSucces !!";

	await showConfirmDialog("Hulp",msg,"Akkoord","No",false);
}

function GetMilitairyDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	return yyyy + mm + dd;
}

function getKey(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function getValue(object,keyname) {
    return object[keyname];
};

let g_Marked = false;

let g_GameData = SetGameData(g_MaxRow, g_MaxColumn);



function SetGameData( rows, cols){

  let arr = [];

  // Creates all lines:
  for(let r=0; r < rows; r++){
      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[r].push( new Array(cols));

      for(let c=0; c < cols; c++){
		if(r == 0 || r == rows - 1){
			arr[r][c] = getValue(imgboats,"img_water");
		} else {
			if(c > 0 && c < cols-1){
				arr[r][c] = getValue(imgboats,"img_leeg");
			} else {
				arr[r][c] = getValue(imgboats,"img_water");
			}
		}
      }
  }
return arr;
}

function ResetGameData(){

  for(let r=1; r < g_MaxRow - 1; r++){
      for(let c=1; c < g_MaxColumn - 1; c++){
		let imgid = "R" + r.toString() + "C" + c.toString();
		let img = document.getElementById(imgid);
		img.src = "Image/" + getKey(imgboats,imgboats.img_leeg) + ".png";
		img.className = "img_large";
	  }
  }
}

function BoatOK(curboat, msg){
	let errmsg = "";

	for(let i = 0; i < curboat.length; i++){
		let r = curboat[i][0];
		let c = curboat[i][1];

		if (r.toString() == "NaN") {
			errmsg = errmsg + "R geen nummer\n";
		}
		if (c.toString() == "NaN") {
			errmsg = errmsg + "R geen nummer\n";
		}
	}

	if(errmsg.length > 0){
		// console.log(msg + "\n" + errmsg);
		return false;
	}

	return true;
}

function ArrayRowCol( rows, cols){
  let arr = [];

  // Creates all lines:
  for(let r=0; r < rows; r++){
      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[r].push( new Array(cols));

      for(let c=0; c < cols; c++){
		arr[r][c] = 0;
      }
  }
return arr;
}

function Message(id, msg, blink) {
	msg = msg.replace("\n","<br>");
	document.getElementById(id).innerHTML = msg;
	document.getElementById(id).style.color = "red";
	if(blink) document.getElementById(id).style.backgroundColor = "yellow";
}

function GetRowFromID(id){
	//  012345
	// "R11C11"
	let idx = id.indexOf('C');
	let sval = id.substring(1,idx);
	return parseInt(sval);
}
function GetColumnFromID(id){
	let idx = id.indexOf('C');
	let sval = id.substring(idx+1);
	return parseInt(sval);
}

function UnMark(){
	for(let r = 1; r < g_MaxRow-1; r++){
		for(let c = 1; c < g_MaxColumn-1; c++){
			let img = document.getElementById("R" + r.toString() + "C" + c.toString());
			let imgclass = img.className;
			if(imgclass == "img_large_mark" || imgclass == "img_large_error"){
				img.className = "img_large";
			}
		}
	}
	g_Marked = false;
	Message("Message","");
}

function RowWater(row,column){
	for(let c=1; c<g_MaxColumn-1; c++){
		let imgid = "R" + row.toString() + "C" + c.toString();
		let img = document.getElementById(imgid);
		let curimg = img.src;
		if(curimg.indexOf("img_leeg") > 0){
			img.src = "Image/" + getKey(imgboats,imgboats.img_water) + ".png";
			img.className = "img_large";
		}
	}
}

function ColumnWater(row,column){
	for(let r=1; r<g_MaxRow-1; r++){
		let imgid = "R" + r.toString() + "C" + column.toString();
		let img = document.getElementById(imgid);
		let curimg = img.src;
		if(curimg.indexOf("img_leeg") > 0){
			img.src = "Image/" + getKey(imgboats,imgboats.img_water) + ".png";
			img.className = "img_large";
		}
	}
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GameData_Row(row){
	let data = "";
	if (isNaN(row)) {
    	// Row parameter is Not a Number!
		return data;
  	}
	for(let c = 0; c < g_MaxColumn; c++){
		data += g_GameData[row][c].toString();
	}
	return data;
}

function GameData_Column(col){
	let data = "";
	if (isNaN(col)) {
    	// Col parameter is Not a Number!
		return data;
  	}
	for(let r = 0; r < g_MaxRow; r++){
		data += g_GameData[r][col].toString();
	}
	return data;
}

function foundlist(data, boatlen){
	let boatval = "";
	for(let i = 0; i < boatlen; i++) boatval += "0";

	let list = [];
	for(let i = 0; i < (data.length - boatval.length); i++){
		let sdata = data.substring(i, i+boatval.length);
		if(sdata == boatval){
			list.push(i);
		}
	}
	return list;
}

function removeArrayItem(arr, value) {
  let index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function PutBoat(boatdata){
	let direction = "v";
    let boatname = "img_boot_m";

	if(boatdata.length > 1){
		let c1 = boatdata[0][1];
		let c2 = boatdata[1][1];
		if(c2 != c1) direction = "h"
	}

	for(let i = 0; i < boatdata.length; i++){
		let r = boatdata[i][0];
		let c = boatdata[i][1];

		switch (boatdata.length) {
			case 1:
				boatname = "img_mijn";
				break;

			case 2:
				boatname = "img_boot_" + direction;
				if(i == 0)	boatname += "s"; else boatname += "e";
				break;	

			default:
				boatname = "img_boot_m"; 
				if(i == 0 || (i == (boatdata.length - 1))){
					boatname = "img_boot_" + direction
					if(i == 0)	boatname += "s"; else boatname += "e";
				}
				break;
		}
		let val = getValue(imgboats,boatname);
		g_GameData[r][c] = val;
	}
	
}

function IsBoat_GameData(row,col){
	let sval = g_GameData[row][col];
	let ival = parseInt(sval);
	ival = Math.abs(ival);
	if(ival > 1) return true;

	return false;
}

function IsBoat_Image(id){
	let img = document.getElementById(id);
	let imgsrc = img.src;

	// imgboats.img_water
	// imgboats.img_leeg
	if(imgsrc.indexOf("img_water") > 0) return false;
	if(imgsrc.indexOf("img_leeg") > 0) return false;
	return true;
}

function PutWater(boatdata){
	// set boatrow ,col in GameData
	for(let i = 0; i < boatdata.length; i++){
		let r = boatdata[i][0];
		let c = boatdata[i][1];
			
	    if(IsBoat_GameData(r-1,c-1) == false) g_GameData[r-1][c-1] = getValue(imgboats,"img_water");		// 	TL

		if(IsBoat_GameData(r-1,c) == false) g_GameData[r-1][c] = getValue(imgboats,"img_water");			// 	T
		if(IsBoat_GameData(r-1,c+1) == false) g_GameData[r-1][c+1] = getValue(imgboats,"img_water");		// 	TR

		if(IsBoat_GameData(r,c-1) == false) g_GameData[r][c-1] = getValue(imgboats,"img_water");			//  L
		if(IsBoat_GameData(r,c+1) == false) g_GameData[r][c+1] = getValue(imgboats,"img_water");			// R

		if(IsBoat_GameData(r+1,c-1) == false) g_GameData[r+1][c-1] = getValue(imgboats,"img_water");		// BL
		if(IsBoat_GameData(r+1,c) == false) g_GameData[r+1][c] = getValue(imgboats,"img_water");			// B
		if(IsBoat_GameData(r+1,c+1) == false) g_GameData[r+1][c+1] = getValue(imgboats,"img_water");		// BR
	}
	// LogBoates();
	
}

function SetCounter(row,col,val){
    let id = "R" + row.toString() + "C" + col.toString();
	let bttn = document.getElementById(id);
	if(!bttn) bttn = document.getElementById(id + "v");

	if(bttn) bttn.innerText = val;
}

function CheckColorCount(row,col){
	// check row color at C11
	let id0 = "R" + row.toString() + "C0";
	let id11 = "R" + row.toString() + "C11" + "v";
	let bttn0 = document.getElementById(id0);
	let bttn11 = document.getElementById(id11);

	if(bttn0.innerText == bttn11.innerText){
		bttn11.className = "button_large_OK";
	} else {
		bttn11.className = "button_large"
	}
	// check col color at R11
	id0 = "R0" + "C" + col.toString();
	id11 = "R11" + "C" + col.toString() + "v";
	bttn0 = document.getElementById(id0);
	bttn11 = document.getElementById(id11);

	if(bttn0.innerText == bttn11.innerText){
		bttn11.className = "button_large_OK";
	} else {
		bttn11.className = "button_large"
	}
}

function UpdateCounting(row,col){
	// update row
	let cnt = 0;
	for(let c = 1; c < g_MaxColumn-1; c++){
		let id = "R" + row.toString() + "C" + c.toString();
		if(IsBoat_Image(id)) cnt++;
	}
	SetCounter(row,g_MaxColumn-1,cnt);

	// update column
	cnt = 0;
	for(let r = 1; r < g_MaxRow-1; r++){
		let id = "R" + r.toString() + "C" + col.toString();
		if(IsBoat_Image(id)) cnt++;
	}
	SetCounter(g_MaxRow-1,col,cnt);
}

function UpdateCounters(){
	// update row counters
	for(let r = 1; r < g_MaxRow-1; r++){
		let cnt = 0;
		let fixed = 0;
		for(let c = 1; c < g_MaxColumn-1; c++){
			let sval = g_GameData[r][c];
			let ival = parseInt(sval);
			ival = Math.abs(ival)
			if(ival >= 2) cnt++;
		}
		SetCounter(r,0,cnt);
	}
	// update column counters
	for(let c = 1; c < g_MaxColumn-1; c++){
		let cnt = 0;
		let fixed = 0;
		for(let r = 1; r < g_MaxRow-1; r++){
			let sval = g_GameData[r][c];
			let ival = parseInt(sval);
			ival = Math.abs(ival)
			if(ival >= 2) cnt++;
		}
		SetCounter(0,c,cnt);
	}	
}

function UpdatePresent(){
	for(let i = 1; i < g_MaxRow-1; i++){
		UpdateCounting(i,i);
		CheckColorCount(i,i);		
	}
}


function AddBoat(boatlen, nrofboats){

	let rows=[]	// rows to check
	for(let i = 1; i< g_MaxRow-1; i++) rows.push(i);

	let cols=[]	// cols to check
	for(let i = 1; i < g_MaxRow-1; i++) cols.push(i);

	let dir = 0;	// 0 = nothing to check, 1 = row, 2 = column
	let ifound = [];
  	let itemdata = "";

	for(let iboat=0;iboat<nrofboats;iboat++){

		let boatdata = []	// empty boat

		while (boatdata.length == 0 && ( rows.length > 0 || cols.length > 0)) {
		
			// check rows, cols to check
			if(rows.length>0 && cols.length>0) dir = getRandomInt(1,3);
			if(rows.length>0 && cols.length == 0) dir = 1;
			if(rows.length==0 && cols.length>0) dir = 2;
			if(rows.length==0 && cols.length==0) dir = 0;

			if(dir == 0){
				dialogMsg("Attentie","Kan geen boot plaatsen met lengte: " + boatlen.toString()+"\nStart puzzle opnieuw");
				return false;
			}

			if(dir==1){
				// check rows
				let rownr = rows[getRandomInt(0,rows.length -1)];
				itemdata = GameData_Row(rownr);
				ifound = foundlist(itemdata,boatlen);

				if(ifound.length==0){
					removeArrayItem(rows,rows[rownr]);
				} else {
					let startcol = ifound[getRandomInt(0,ifound.length)];
					boatdata = ArrayRowCol(boatlen,2);

					for(let i=0;i<boatlen;i++){
						let c = startcol + i;
						boatdata[i][0] = rownr;
						boatdata[i][1] = c;
					}

				}

			} else {
				// check cols
				let colnr=cols[getRandomInt(0,cols.length-1)];
				itemdata = GameData_Column(colnr);
				ifound = foundlist(itemdata,boatlen);

				if(ifound.length==0){
					removeArrayItem(cols,cols[colnr]);
				} else {
					let startrow = ifound[getRandomInt(0,ifound.length)];
					boatdata = ArrayRowCol(boatlen,2);

					for(let i = 0; i<boatlen; i++){
						let r = startrow + i;
						boatdata[i][0] = r;
						boatdata[i][1] = colnr;
					}
				}		
			}

			// check boat found
			if(boatdata.length == boatlen){
				if(BoatOK(boatdata,"AddBoat")){
					// set boatrow ,col in GameData
					PutBoat(boatdata);
					// add water around boat
					PutWater(boatdata);					
				} else {
					boatdata = [];
				}

			}
	
		}
		if(boatdata.length < boatlen){
			dialogMsg("Attentie","Kan geen boot voor lengte:" + boatlen.toString() + " maken !!");
			g_BoatList = [];
			return false;
		} else {
			g_BoatList.push(boatdata);
		}
		
	}
	

	return true;
}

function CheckImgData(row,col, class_ok, class_error){
	let curval = g_GameData[row][col].toString();
	let srcname = getKey(imgboats,curval);
	let ival = parseInt(curval);
	let ids = "R"+row.toString()+"C"+col.toString();
	let item = document.getElementById(ids);

	if(item.className == "img_large_fixed"){
		// console.log(ids + "=fixed")
		return true;
	} 

	if(IsBoat_GameData(row,col) && IsBoat_Image(ids)){
		// beide zijn een boot,check types
		let mysrc = "Image/" + srcname + ".png";
		let idx = item.src.indexOf(mysrc);
		// console.log(ids + ":" + curval + " >" + srcname + "< >" + item.src + "< Index=" + idx.toString());
		if(idx > 0){
			item.className = class_ok;

			return true;
		} else {
			// cel markeren
			item.className = class_error;
			g_Marked = true;
			return false;			
		}
	}
	if(IsBoat_GameData(row,col) && IsBoat_Image(ids) == false){
		// cel markeren
		// console.log(ids + ":" + curval + " >" + srcname + "< >" + item.src);
		item.className = class_error;
		g_Marked = true;
		return false;
	}
	if(IsBoat_GameData(row,col)== false && IsBoat_Image(ids) == true){
		// cel markeren
		// console.log(ids + ":" + curval + " >" + srcname + "< >" + item.src);
		item.className = class_error;
		g_Marked = true;
		return false;
	}
	// console.log(ids + ":" + curval + " >" + " > OK");

	return true;
}


function compareNumbers(a, b) {
  return a - b;
}

function SetCountButton(id){
	document.getElementById(id).innerText = "0";
	document.getElementById(id).className = "button_large";
}

function ResetButtons(){
	ColorSmall("boot4",0,1);
	ColorSmall("boot3",0,2);
	ColorSmall("boot2",0,3);
	ColorSmall("mijn",0,4);

	for(let r = 0; r < g_MaxRow; r++){
		for(let c = 0; c < g_MaxColumn; c++){
			let id = "R" + r.toString() + "C" + c.toString();
			let idv = id + "v";

			if(r == 0 || r == g_MaxRow-1){
				// set toprow / bottomrow
				if(c > 0 && c < g_MaxColumn){
					if(r == 0) SetCountButton(id);
					if(r == g_MaxRow-1) SetCountButton(idv);
				}
			} else {
				// set leftcolumn / rightcolumn
				if(c == 0 || c == g_MaxColumn-1){
					if(c == 0) SetCountButton(id);
					if(c == g_MaxColumn-1) SetCountButton(idv);
				}
			}
		}
	}
}

function IsFree(row,col,orgrow,orgcol){
	let r=row;
	let c=col;

	if(IsBoat_GameData(row,col)) return false;

	if(row > 1){					// top
		r=row-1;
		c=col;
		// if(IsBoat_GameData(r,c)) return false;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(row < g_MaxRow -1){			// bottem
		r=row+1;
		c=col;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(col > 1){					// left	
		r=row,
		c=col-1;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(col < g_MaxColumn -1){		// right
		r=row;
		c=col+1;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(col > 1 && row > 1){			// top-left
		r=row-1;
		c=col-1;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}

	if(col < g_MaxColumn-1 && row > 1){			// top-right
		r=row-1;
		c=col+1;
			if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(col < g_MaxColumn-1 && row < g_MaxRow-1){// bottom-right
		r=row-1;
		c=col-1;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}
	if(col > 1 && row < g_MaxRow-1){			// bottom-left
		r=row+1;
		c=col-1;
		if(r != orgrow || c != orgcol)
			if(IsBoat_GameData(r,c)) return false;
	}	
	return true;
}

function SetImageGameData(row,col,boottype,fixed){
	g_GameData[row][col] = boottype;

	let sid = "R" + row.toString() + "C" + col.toString();
	let fixsrc = "Image/" + getKey(imgboats,boottype) + ".png";
	let img = document.getElementById(sid);

	img.src = fixsrc;
	if(fixed){
		img.className = "img_large_fixed";
		g_GameData[row][col] = "-" + boottype;
	} else {
		img.className = "img_large";
		g_GameData[row][col] = boottype;
	}
}


const CheckBoten = () => {
	let errcnt = 0;
	let msg = "";
	// check boot aantallen
	let bt4 = document.getElementById("boot4").innerText;
	if(bt4 != "1"){ msg += "\nBoot lengte 4, aantal: " + bt4.toString() + " (correct = 1)" ; errcnt++;}
	let bt3 = document.getElementById("boot3").innerText;
	if(bt3 != "2"){ msg += "\nBoot lengte 3, aantal: " + bt3.toString() + " (correct = 2)" ; errcnt++;}
	let bt2 = document.getElementById("boot2").innerText;
	if(bt2 != "3"){ msg += "\nBoot lengte 2, aantal: " + bt2.toString() + " (correct = 3)" ; errcnt++;}
	let bt1 = document.getElementById("mijn").innerText;
	if(bt1 != "4"){ msg += "\nBoot lengte 1, aantal: " + bt1.toString() + " (correct = 4)" ; errcnt++;}

	// check aantallen regels
	let rmsg = "";
	for(let r = 1; r < g_MaxRow-1; r++){
		let id11 = "R" + r.toString() + "C11" + "v";
		let bttn11 = document.getElementById(id11);
		if(bttn11.className != "button_large_OK"){ rmsg += " " + r.toString() ; errcnt++;}
	}
	if(rmsg.length > 0) msg += "\n\nAantal elementen fout in regel: " + rmsg;


	// check aantallen kolommen
	let cmsg = "";
	for(let c = 1; c < g_MaxColumn-1; c++){
		let id11 = "R11" + "C" + c.toString() + "v";
		let bttn11 = document.getElementById(id11);
		if(bttn11.className != "button_large_OK"){ cmsg += " " + c.toString() ; errcnt++;}
	}
	if(cmsg.length > 0) msg += "\n\nAantal elementen fout in kolom: " + cmsg;
	return [ errcnt, msg ];
}

async function ShowSolution(Check){
	Message("ActiveMessage","",false);  // clear msg area

	if(document.getElementById("Zichtbaar").value == "0") return;

	UnMark();
	let errcnt = 0;

	g_Marked = true;
	let cls_ok = "img_large_mark";
	let cls_err = "img_large_error";

	// console.log("CheckImgData:");
	for(let r = 1; r < g_MaxRow-1; r++){
		for(let c = 1; c < g_MaxColumn-1; c++){	
			if(CheckImgData(r,c,cls_ok,cls_err) == false) errcnt++;
		}
	}

	let misplaced = errcnt;
	let msgcorrect = "";
	let msg = "";

	if(Check){
		const [errchk,errmsg] = CheckBoten();
		let msgchk = errmsg;
		errcnt += errchk;
		msgchk = "\n\nAantal elementen foutief geplaatst: " + misplaced.toString() + "\n" + msgchk;
		let actmsg = ";"

		if(errcnt > 0){
			actmsg = "Oplossing niet correct.  Aantal fouten: " + errcnt.toString();
			msg = "Oplossing niet correct.  Aantal fouten: " + errcnt.toString() + msgchk;
			// dialogMsg("Controle",msg);
			await showConfirmDialog("Controle", msg, "Akkoord", "Nee",false);
		} else {
			g_PuzzleSolved = true;
			msgcorrect = "Oplossing correct !";
			actmsg = msgcorrect;
			if(g_CheckCount == 0){
				msgcorrect += "\nZonder vooraf getoonde oplossing !!";
			} else {
				msgcorrect += "\nVooraf getoonde oplossingen: " + g_CheckCount.toString();
			}
			msgcorrect += "\n\n\n\nNieuwe puzzel wordt gestart!";
		}
		Message("ActiveMessage", actmsg,true);
	}
	g_CheckCount++;

	if(g_PuzzleSolved){
		g_CheckCount = 0;
		await VisableBoatsSet("Puzzle opgelost",msgcorrect,"Akkoord","Afbreken",false);
		StartGame();
	}
}


function Mirror(b1,b2){
	let b1row = [];
	let b1col = [];
	let b2row = [];
	let b2col = [];

	let len = b1.length;
	if(b2.length < len) len = b2.length;

	// console.log("Check mirror =========================");
	for(let i = 0; i < len; i++){
		b1row.push(b1[i][0]);
		b1col.push(b1[i][1]);
		// console.log("b1 r" + b1row[i].toString() + "c" + b1col[i].toString());

		b2row.push(b2[i][0]);
		b2col.push(b2[i][1]);
		// console.log("b2 r" + b2row[i].toString() + "c" + b2col[i].toString());
	}

	// controleer elke positie of het een vaste waarde is
	for(let i = 0; i < len; i++){
		let bt1val = g_GameData[b1row[i]][b1col[i]];
		let bt2val = g_GameData[b2row[i]][b2col[i]];

		if(bt1val.startsWith("-") || bt2val.startsWith("-")){
			// fixed object found
			// console.log("Fixed item: " + bt1val + " , " + bt2val );
			return;
		}		
	}

	// controleer bij lengte > 1 of beiden horizontaal of beiden verticaal zijn
	if(len > 1){
		let delta1 = b1row[1] - b1row[0];
		let delta2 = b2row[1] - b2row[0];
		if(delta1 != delta2){
			// richting van de boten is ongelijk
			// console.log("Niet paralel: " + delta1.toString() + " , " + delta2.toString() );
			return;
		}
	}

	// controleer in zelde rij of kolom
	if(b1row[0] == b2row[0] || b1col[0] == b2col[0]){
		// console.log("Same row/col...")
		return;
	}

	// check if mir1 AND mir2 is in free water
	let freecount = 0;

	// fout in freecount !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// 00X0	R1C3
	// 0X00	R2C2
	//
	// mirror R1C3 >> R1C2
	// mirror R2C2 >> R2C3
	//
	for(let i = 0; i < len; i++){
		let fr1 = IsFree(b1row[i],b2col[i],b1row[i],b1col[i]);
		let fr2 = IsFree(b2row[i],b1col[i],b2row[i],b2col[i]);

		if(fr1 && fr2){
			freecount++;
		}		
	}
	if(freecount == len){
		// mirror is possible
		SetImageGameData(b1row[0],b2col[0],imgboats.img_water,true);
	}
}


function CheckMirror(){
	// console.log(g_BoatList);
	let msg = "";

	for(let i = 0; i < g_BoatList.length; i++){
		let curboat = g_BoatList[i];
		let blen = curboat.length;
		msg+= "boot l=" + blen.toString() + " ";

		for(let y = 0; y < curboat.length; y++){
			msg += y.toString() + "=" + curboat[y][0].toString() + "," + curboat[y][1].toString() + "\n"
		}

	}
	// console.log(msg);

	// check boats length = 1  example
	// 0 123456789
	// 1    x
	// 2
	// 3       x
	// 4       
	// 5

	// bt1 = 1,4
	// bt2 = 3,7
	// mir1= 1,7	
	// mir2= 3,4 

	// check bootlengte 3
	Mirror(g_BoatList[1],g_BoatList[4]);
	Mirror(g_BoatList[2],g_BoatList[5]);

	// check bootlengte 2
	Mirror(g_BoatList[3],g_BoatList[4]);
	Mirror(g_BoatList[3],g_BoatList[5]);
	Mirror(g_BoatList[4],g_BoatList[5]);
	// check bootlengte 1
	Mirror(g_BoatList[6],g_BoatList[7]);
	Mirror(g_BoatList[6],g_BoatList[8]);
	Mirror(g_BoatList[6],g_BoatList[9]);

	Mirror(g_BoatList[7],g_BoatList[8]);
	Mirror(g_BoatList[7],g_BoatList[9]);

	Mirror(g_BoatList[8],g_BoatList[9]);
}

async function SetFixedBoates(){
	InitGameData();
	ResetButtons();
	Message("ActiveMessage"," ");
	g_CheckCount = 0;
	g_BoatList = [];

	// set fixed boats for puzzle
	// boatitems 4 + 3 + 3 + 2 + 2 + 2 + 1 + 1 + 1 + 1 = 20
	// 
	let fixed = document.getElementById("Zichtbaar").value;
	fixed = parseInt(fixed);

	Message("Message"," ");
	g_GameData = [];
	
	if(InitGameData() == false){
		dialogMsg("Attentie","Fout in plaatsen van boten...");
	}

	let fixitems = [];
	while (fixitems.length < fixed) {
		let nr = getRandomInt(1,21);
		if(fixitems.indexOf(nr) < 0) fixitems.push(nr);	
	}
	fixitems.sort(compareNumbers);

	let fixnr = 0;
	for(let r=1; r<g_MaxRow-1; r++){
		for(let c=1; c<g_MaxColumn-1; c++){
			if(IsBoat_GameData(r,c)){
				fixnr++;
				if(fixitems.indexOf(fixnr) > -1){
					let sval = g_GameData[r][c];
					let sid = "R" + r.toString() + "C" + c.toString();
					let fixsrc = "Image/" + getKey(imgboats,sval) + ".png";
					let img = document.getElementById(sid);

					img.src = fixsrc;
					img.className = "img_large_fixed";
					let tmpval = "-" + sval;
					g_GameData[r][c] = tmpval;
					// console.log("g_GameData[" + r.toString() + "][" + c.toString() + "] = " + tmpval);
				} 
			}
		}
	}
	// check if mirror is possible
	CheckMirror();

	UpdatePresent();

	Zoom();
}

function Zoom(){
	let idlist = [];
	idlist.push("R11C11v");
	ZoomWindow(idlist);
}

function InitGameData(){

	g_GameData = SetGameData(g_MaxRow, g_MaxColumn);

	ResetGameData();

	g_BoatList = [];

	//Add Boats
	if(AddBoat(4,1) == false) return false;
	if(AddBoat(3,2) == false) return false;
	if(AddBoat(2,3) == false) return false;
	
	if(AddBoat(1,4) == false) return false;

	UpdateCounters();

	return true;
}

async function StartGame(){
	Zoom();
	ResetGameData();
	g_PuzzleSolved = false;
	let fixed = document.getElementById("Zichtbaar").value;
	if(fixed == "0"){
		let boatset = await VisableBoatsSet();
		if(!boatset){
			alert("Error...");
			return;
		}
	}
    SetFixedBoates()
}

async function NewPuzzle(){
	Zoom();
	let result = await showConfirmDialog("Er is een puzzel actief!", 
    									 "Toch een nieuwe puzzel starten?",
										"Ja","Nee",true);
	if(result == false) return;
	
	ResetGameData();
	let boatset = await VisableBoatsSet();
	if(!boatset){
		alert("Error...");
		return;
	}
	SetFixedBoates()
}


function WaterActive(id){
	let img = document.getElementById(id);
	let srcname = img.src;
	let imgwater = getKey(imgboats, imgboats.img_water);
	let idx = srcname.indexOf(imgwater);
	return idx > 0;
}

function MessageWater(){
		switch (g_WaterType) {
			case 1:	
				Message("ActiveMessage", "Water RIJ &nbsp;_&nbsp;_&nbsp;_&nbsp;_&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;Klik [Actief] voor Kolom");
				break;
			case 2:
				Message("ActiveMessage", "Water KOLOM &nbsp;&nbsp;|&nbsp;&nbsp;|&nbsp;&nbsp;|&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Klik [Actief] voor Water")
				break;	
			default:
				Message("ActiveMessage", "Water &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Klik [Actief] voor Rij")
				break;
		}
}

function CheckWater(){
	// let imgname = document.getElementById('img-actief').src;
	if(WaterActive('img-actief')){
		switch (g_WaterType) {
			case 0:			// single
				g_WaterType = 1;
				break;
			case 1:			// row
				g_WaterType = 2;
				break;		
			default:		// column
				g_WaterType = 0;
				break;
		}
		MessageWater();
	}
}

async function VisableBoatsSet(title="Attentie",
	                           message="Er zijn 20 bootelementen in de puzzel\nKies aantal zichtbaar te plaatsen boot cellen",
							   txtBtnYes="Akkoord",txtBtnNo="No",showNoButton=false) {

	let res = await getNumberOfBoats(title,message,txtBtnYes,txtBtnNo,showNoButton);
	let fixed = document.getElementById("Zichtbaar").value;
	if(fixed == "0"){
		// function showConfirmDialog(title, message, txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true)
		await showConfirmDialog("Attentie","Er zijn 20 bootelementen in de puzzel\nKies aantal zichtbaar te plaatsen boot cellen","Akkoord","No",false);
		return false;
	}
	return true;
}


async function imgselectclick(id){
	Message("ActiveMessage", " ", false);

	// let boatset = await VisableBoatsSet();
	// if(!boatset) return;

	if(g_Marked){
		UnMark();
	}
	if(WaterActive(id)){
		g_WaterType = 0;
		MessageWater();
	} else {
		Message("ActiveMessage", " ", false);
	}
	let img = document.getElementById(id);
	let srcname = img.src;
	document.getElementById('img-actief').src = srcname;
}

function ImgCheck(id,keyname){
	let img = document.getElementById(id);
	if(img.src.indexOf(keyname) > 0) return true;
	return false;
}

function CountBoat(len){
	let cnt = 0;
	let btnames_h = [];
	let btnames_v = [];
	let idemcount = 0;

	switch (len) {
		case 1:
			btnames_h.push(getKey(imgboats,imgboats.img_mijn));
			break;
		case 2:
			btnames_h.push(getKey(imgboats,imgboats.img_boot_hs));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_he));

			btnames_v.push(getKey(imgboats,imgboats.img_boot_vs));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_ve));
			break;	
		case 3:
			btnames_h.push(getKey(imgboats,imgboats.img_boot_hs));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_he));

			btnames_v.push(getKey(imgboats,imgboats.img_boot_vs));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_ve));
			break;	
		default:
			btnames_h.push(getKey(imgboats,imgboats.img_boot_hs));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_h.push(getKey(imgboats,imgboats.img_boot_he));

			btnames_v.push(getKey(imgboats,imgboats.img_boot_vs));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_m));
			btnames_v.push(getKey(imgboats,imgboats.img_boot_ve));
			break;
	}
	// count in row
	for(let r=1; r < g_MaxRow-1; r++){

		for(let c=1; c < g_MaxColumn-len; c++){
			cnt = 0;
			for(let delta = 0; delta < len; delta++){
				let offset = delta + c;
				let id = "R" + r.toString() + "C" + offset.toString();
				
				if(ImgCheck(id,btnames_h[delta])){
					cnt++;
				} else {
					break;
				}
			}
			if(cnt == len) idemcount++;
		}
	}

	if(len > 1){

		// count in column
		for(let c=1; c < g_MaxColumn-1; c++){

			for(let r=1; r < g_MaxColumn-len; r++){
				cnt = 0;
				for(let delta = 0; delta < len; delta++){
					let offset = delta + r;
					let id = "R" + offset.toString() + "C" + c.toString();
					
					if(ImgCheck(id,btnames_v[delta])){
						cnt++;
					} else {
						break;
					}
				}
				if(cnt == len) idemcount++;
			}
		}

	}
	return idemcount;
}

function ColorSmall(id,nr,chk){
	document.getElementById(id).innerText = nr.toString();
	if(nr == chk)
		document.getElementById(id).className = "button_small_OK";
	else
		document.getElementById(id).className = "button_small";
}

function DebugIMG(){
	let pw = GetMilitairyDate();
	if(g_DebugPW != pw){
		g_DebugPW = prompt("Debug wachtwoord datum " + pw + " of klik op annuleren...");
	}
	if(g_DebugPW == GetMilitairyDate()){
		g_DebugActive = !g_DebugActive;
		if(g_DebugActive){
			document.getElementById('img-actief').className = "img_large_mark";
		} else {
			document.getElementById('img-actief').className = "img_large";
		}
	}
}

async function imgclick(id){

	let img = document.getElementById(id);
    let r = GetRowFromID(id);
	let c = GetColumnFromID(id);

	// is g_DebugActive
	if(g_DebugActive){
		let curval = g_GameData[r][c];
		let ival = Math.abs(parseInt(curval)).toString()
		let srcname = getKey(imgboats,ival);
		let src = img.src;
		let isok = (src.indexOf(srcname) > 0);
		src = src.substring(src.indexOf("Image"));
		let dbgmsg = "GameData: " + curval.toString() + " , key:" + srcname + "\nSrc: " + src;
		dbgmsg += "\nValid: " + isok.toString();
		// dbgmsg += "\n\nKlik op [Nee] voor SolutionConsole()"

		let result = await showConfirmDialog("Debug " + id,dbgmsg,"Akkoord","Nee",false);
		// if(!result) SolutionConsole();
		return;
	}

	if(g_Marked){
		UnMark();
	}

	let clsname = img.className;

	if(clsname == "img_large_fixed"){
		// let val = img.value;
		Message("ActiveMessage", "Niet te veranderen cel !!", true);
		return;
	}

	if(WaterActive('img-actief')){
		switch (g_WaterType) {
			case 1:				// row
				RowWater(r,c);
				break;
			case 2:				// column
				ColumnWater(r,c);
				break;		
			default:
				img.src = document.getElementById('img-actief').src;
				break;
		}
	} else {
		if(img.src == document.getElementById('img-actief').src){
			// set img to leeg
			img.src = "Image/" + getKey(imgboats,imgboats.img_leeg) + ".png";
		} else {
			img.src = document.getElementById('img-actief').src;
		}
	}
	UpdateCounting(r,c);
	CheckColorCount(r,c);

	let cnt = CountBoat(1);
	ColorSmall("mijn",cnt,4);

	cnt = CountBoat(2);
	ColorSmall("boot2",cnt,3);

	cnt = CountBoat(3);
	ColorSmall("boot3",cnt,2);

	cnt = CountBoat(4);
	ColorSmall("boot4",cnt,1);
}