
// const RowSize, ColumnSize
var ROWSIZE = 9;
var COLUMNSIZE = 9;
var GROUPNR = 1;

var TECTONICMAP = new Map();


var LASTBUTTON = "";
var LASTAREA = [];

const BUTTONPREFIX = "Button_";

const colorPairs = [
  ["#f60606ff",  "#FFFFFF" ],
  ["#ee9494ff",  "#FFFFFF" ],
  ["#f66e06ff",  "#FFFFFF" ],
  ["#ca8f62ff",  "#FFFFFF" ],

  ["#fc09b4ff",  "#FFFFFF"], 
  ["#f26ccaff",  "#FFFFFF"], 
  ["#f3a2dbff",  "#FFFFFF"], 

  ["#5B2C6F",  "#FFFFFF"], 
  ["#AF7AC5",  "#000000"], 

  ["#eb6912ff",  "#000000"], 
  ["#E59866",  "#000000"], 
  ["#d4aa8fff",  "#000000"], 
  
  ["#eaf603ff",  "#000000"], 
  ["#f6faa8ff",  "#000000"], 

  ["#0cf26bff",  "#FFFFFF"], 
  ["#56ac7aff",  "#FFFFFF"], 
  ["#afcbbbff",  "#FFFFFF"], 

  ["#0a1399ff",  "#FFFFFF"],
  ["#0918f2ff",  "#FFFFFF"], 
  ["#5b64efff",  "#FFFFFF"], 
  ["#a5aaf1ff",  "#FFFFFF"], 

  ["#4328bfff",  "#FFFFFF"], 
  ["#2874A6",  "#FFFFFF"], 
  ["#85C1E9",  "#000000"], 
  ["#5DADE2",  "#FFFFFF"], 
  ["#2E86C1",  "#FFFFFF"] 
  ["#9b9d9eff", "#050505ff"] 
 
];



const DATA_DEFAULT = {
    "groupNr": 0,
    "areaNrs": [],
    "allowedNrs": []
} 

function keyData_Empty() {
    const data = Object.create(DATA_DEFAULT);
    return data;
}

function keyData_SetGroup(curdata,newgroupnr) {
    curdata.groupNr = newgroupnr;
    // const data = Object.create(DATA_DEFAULT);
    // // change item:    
    // data.groupNr = newgroupnr;
    // data.areaNrs = curdata.areaNrs;
    // data.allowedNrs = curdata.allowedNrs;
    return curdata;
}
function keyData_GetGroup(curdata) {
    return curdata.groupNr;
}

function keyData_SetArea(curdata,area) {
    curdata.areaNrs = area;
    return curdata;
}
function keyData_GetArea(curdata) {
    return curdata.areaNrs;
}

function keyData_SetAllowed(curdata,allowed) {
    curdata.allowedNrs = allowed;
}
function keyData_GetAllowed(curdata) {
    return curdata.allowedNrs;
}

function keyData_RemoveAllowed(curdata,remove) {
    var arr = curdata.allowedNrs;
    arr = removeItemAll(arr,allowed);
    curdata.allowedNrs = arr;
    return curdata;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function createMap() {
    // create empty map
    TECTONICMAP = new Map();

    for (let index = 1; index <= (ROWSIZE * COLUMNSIZE); index++) {
        TECTONICMAP.set(index,keyData_Empty());       
    }
    return TECTONICMAP;
}


function getAllowed( index ) {
    var Info = TECTONICMAP.get(index); 
    return keyData_GetAllowed(Info);
}
function setAllowed( index, allowed ) {
    var Info = TECTONICMAP.get(index); 
    var newinfo = keyData_SetAllowed(Info,allowed);
    TECTONICMAP.set(index,newinfo); 
}

function getGroupNumber( index ) {
    var Info = TECTONICMAP.get(index); 
    return keyData_GetGroup(Info);
}
function setGroupNumber( index , NewGroupNr) {
    var Info = TECTONICMAP.get(index); 
    var newinfo = keyData_SetGroup(Info,NewGroupNr);
    TECTONICMAP.set(index, newinfo);
}

function getArea( index ) {
    var Info = TECTONICMAP.get(index); 
    return keyData_GetArea(Info);
}
function setArea( index, area ) {
    var Info = TECTONICMAP.get(index); 
    var newinfo = keyData_SetArea(Info,area);
    TECTONICMAP.set(index,newinfo); 
}



function freeInMap( index ){
    var Info = TECTONICMAP.get(index); 
    var grpnr = keyData_GetGroup(Info);
    return grpnr === 0;
}


// createArea from position and size



function createArea( position, size ) {
    var rtnArea = [position];

    // create area of given size
    // if size is impossible return smaller size

    var ok = rtnArea.length < size;

    while (ok) {
        if(rtnArea.length < size) {
            var startsize = rtnArea.length;

            for (let index = 0; index < rtnArea.length; index++) {
                const curnr = rtnArea[index];

                var newArea = addFreeNeighBours(curnr, rtnArea);

                for (let index = 0; index < newArea.length; index++) {
                    const nr = newArea[index];
                    if(rtnArea.includes(nr) == false) rtnArea.push(nr);   
                }  
                if (rtnArea.length >= size) { 
                    rtnArea.length = size;
                    break; 
                }            
            }
            if(rtnArea.length === startsize) ok = false;

        } else {
            rtnArea.length = size;
            break;
        }
    }
    for (let index = 0; index < rtnArea.length; index++) {
        rtnArea[index] = Number(rtnArea[index]);
        
    }
    rtnArea.sort(function(a, b){return a - b});
    return rtnArea;
}

function addFreeNeighBours( position, CurArea) {
    var currow = getRow(position);
    var curcol = getColumn(position);
    var area = [];

    if(curcol > 1)area.push(position - 1);              // add left cell
    if(curcol < COLUMNSIZE) area.push(position + 1);    // add right cell
    if(currow > 1) area.push(position - ROWSIZE);       // add upper cell
    if(currow < ROWSIZE) area.push(position + ROWSIZE); // add lower cell
    
    // check cells
    var rtnarea = []
    for (let index = 0; index < area.length; index++) {
        var cellnr = area[index];

        if((CurArea.includes(cellnr) == false) && freeInMap(cellnr)) rtnarea.push(cellnr);
    }
    return rtnarea;
}

function getNeighBours_OutsideArea( position, CurArea ){
    var currow = getRow(position);
    var curcol = getColumn(position);
    var outsidearea = [];
    var grpNr = getGroupNumber(position);

    var area = [];

    if(curcol > 1) area.push(position - 1);             //add left cell
    if(curcol < COLUMNSIZE) area.push(position + 1);    // add right cell
    if(currow > 1) area.push(position - ROWSIZE);       // add upper cell
    if(currow < ROWSIZE) area.push(position + ROWSIZE); // add lower cell

    for (let index = 0; index < area.length; index++) {
        var cellnr = area[index];
        var curgrp = getGroupNumber(cellnr);
        if(curgrp != grpNr) outsidearea.push(index);
    }
    return outsidearea;
}

function getRandomCell(freecells) {
    var rtnval = 0;
    if(freecells.length > 0) {
        var index = getRandomInt(freecells.length);
        rtnval = freecells[index];
    }
    return rtnval;
}

// getRandomInt(3));
// Expected output: 0, 1 or 2
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRow( index ) {
    var rest = index;
    var rownr = 1;

    while (rest > ROWSIZE) {
        rest -= ROWSIZE;
        rownr += 1;
    }
    return rownr
}

function getColumn( index ) {
    var colnr = index;

    while (colnr > ROWSIZE) {
        colnr -= ROWSIZE;
    }
    return colnr;
}

function firstFree() {
    for (let index = 1; index <= (ROWSIZE * COLUMNSIZE); index++) {
        if(freeInMap(index)) return index;
    }
    return 0;
}


function CreateButtons(rows, columns) {
    var sHtml = "";
    const container = document.getElementById('buttonGridContainer');
      
    for( var iRow = 1; iRow <= rows; iRow++ )    {
        for( var iCol = 1; iCol <= columns; iCol++) {
            var iButton = ((iRow - 1) * columns) + iCol;

            // Set the button's text content
            // var grpnr = getGroupNumber(iButton);
            var grpchar = "";

            sIdVal = BUTTONPREFIX + iButton.toString();
            sHtml = sHtml + "<input type='button' id=" + sIdVal + " class='mybutton' value='" + grpchar + "' onclick='pressedButton(" + sIdVal + ")'/>";
        }
        sHtml = sHtml + "<br/>";
    }

    container.innerHTML = sHtml; 
}

function AllowedArray(maxnr){
    var arr = [];
    for (let index = 1; index <= maxnr; index++) {
        arr.push(index);
    }
    return arr;
}


function ColorButtons() {
    for (let index = 1; index <= ROWSIZE * COLUMNSIZE; index++) {
        const keydata = TECTONICMAP.get(index);
        var grpnr = keyData_GetGroup(keydata);
        var area = keyData_GetArea(keydata);

        // set allowed nrs
        var allowarr = AllowedArray(area.length);
        keyData_SetAllowed(keydata,allowarr)

        if(grpnr < colorPairs.length) {
            const bttn = document.getElementById(BUTTONPREFIX + index.toString());          
            var curcolor = colorPairs[grpnr - 1];
            bttn.style.background = curcolor[0];
            bttn.style.color = curcolor[1]; 
            bttn.value = "";        
        }
    }
}

function Hide_Button( Nr ) {
    var item = document.getElementById(bttnName);
    for (i=1; i <= 9; i++) {
        var bttnName = "Val" + i.toString();
        var bttn = document.getElementById(bttnName);
        bttn.style.visibility  = "visible";

        if (i > Nr) {
            bttn.style.visibility = "hidden";
        }
    }
}

function ArrayToString(arr){
    var msg = "";
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        msg += element.toString() + " ";
    }
    return msg;
}


function GetFixedOutsideArea( index ){
    const Info = TECTONICMAP.get(index);
    const area = keyData_GetArea(Info);
}

function GetFixedInArea( index ){
    const Info = TECTONICMAP.get(index);
    const area = keyData_GetArea(Info);
    var used = [];
    for (let index = 0; index < area.length; index++) {
        const val = document.getElementById(BUTTONPREFIX + area[index].toString()).value;
        if(val != ""){
            const valnr = parseInt(val);
            if(used.indexOf(valnr) < 0){
                used.push(valnr);
            }
        }
    }
    return used;
}

function CleanValues( arrvalues, usedvalues){
    var clnval = [];

    for (let index = 0; index < arrvalues.length; index++) {
        const val = arrvalues[index];
        if(usedvalues.indexOf(val) < 0) clnval.push(val);
    }
    return clnval;
}

function ValuesOutSideArea( index ){
    var values = [];
    const nrs = getNeighBours_OutsideArea(index);
    for (let index = 0; index < nrs.length; index++) {
        const btnNr = nrs[index];
        var btn = document.getElementById(BUTTONPREFIX + btnNr.toString());
        if(btn.value != "") {
            var iVal = parseiInt(btn.value);
            if(values.indexOf(iVal) < 0){
                values.push(iVal);
            }
        }
        
    }
    return values;
}

function pressedButton(curbutton) {

    Info_Show();

    // unmark previous button
    if(LASTBUTTON != "") {
        const btn = document.getElementById(LASTBUTTON);
        btn.className = "mybutton"; 
    }

    // unmark previous area
    for (let i = 0; i < LASTAREA.length;  i++){
        var idstr = BUTTONPREFIX + LASTAREA[i].toString();
        const btn = document.getElementById(idstr);
        btn.className = "mybutton";      
    }

    var ID = curbutton.id;
    var pressedbtn = document.getElementById(ID);

    var mapnr = ID.replace(BUTTONPREFIX,"");
    var index = parseInt(mapnr);

    

    document.getElementById("Number").value = index;

    var allowarr = getAllowed(index);
    document.getElementById("Allow").value = ArrayToString(allowarr);

    var fixedNrs = GetFixedInArea(index);
    var clnNrs = CleanValues(allowarr,fixedNrs);

    var fixedOut = ValuesOutSideArea(index);
    clnNrs = CleanValues(clnNrs,fixedOut);

    document.getElementById("Clean").value = ArrayToString(clnNrs);

    document.getElementById("Value").value = pressedbtn.value;

    var areaInfo = getArea(index);
    // document.getElementById("Area").value = ArrayToString(areaInfo);

    // mark area
    for (let i = 0; i < areaInfo.length; i++)  {
        const curarea = document.getElementById(BUTTONPREFIX + areaInfo[i].toString());   
        curarea.className = "mybutton_area";   
    }

    // mark pressed button
    pressedbtn.className = "mybutton_hilite"; 

    Hide_Button(areaInfo.length);

    LASTAREA = areaInfo;
    LASTBUTTON = ID;
}

function Button_SetValue(newvalue) {
    if(LASTBUTTON != "") {
        document.getElementById(LASTBUTTON).value = newvalue;
        document.getElementById("Value").value = newvalue;
    }
}

function Info_Hide(){
    var buttonInfo = document.getElementById("buttonInfo");
    buttonInfo.style.visibility  = "hidden";
}
function Info_Show(){
    var buttonInfo = document.getElementById("buttonInfo");
    buttonInfo.style.visibility  = "visible";
}

function InitGame() {

    Info_Hide();

    createMap();

    var curCell = firstFree();
    while (curCell > 0) {
        var size = getRandomInt(3) + 3;
        var group = createArea(curCell,size);

        
        // write groupnrs
        for (let index = 0; index < group.length; index++) {
            var cellnr = group[index];
            setGroupNumber(cellnr,GROUPNR);
            setArea(cellnr, group);
        }

        GROUPNR += 1;

        // showMap();
        var curCell = firstFree();

        CreateButtons(ROWSIZE,COLUMNSIZE);

    }
           
    ColorButtons();

}







