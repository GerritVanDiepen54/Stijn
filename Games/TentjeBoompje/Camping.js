window.onbeforeunload = function(){

    let item = document.getElementById(1);
    if(item) {

        let game = "";
        for(let i=1; i <= (g_Cols * g_Rows) ; i++) {
            game = game + GetImageValue(i);
        }
        localStorage.setItem(g_CampingGame, game);

        let maxrows = GetCountValues("row_");
        localStorage.setItem(g_CampingMaxRows, maxrows);

        let maxcols = GetCountValues("col_")
        localStorage.setItem(g_CampingMaxColumns, maxcols);

        let tentsdata = GetTentsData();
        localStorage.setItem(g_CampingTents, tentsdata);

    } else {
        localStorage.setItem(g_CampingGame, "");
    }
};


var g_Rows = 10;
var g_Cols = 10;  

var g_WdtPuzzle = 0;
var g_HgtPuzzle = 0;

var g_TentsInPuzzle = [];

const g_redborder = "3px solid red";
const g_greenborder = "3px solid green";
const g_CampingGame = "Camping.Game";
const g_CampingMaxRows = "Camping.MaxRows";
const g_CampingMaxColumns = "Camping.MaxColumns";
const g_CampingTents = "Camping.TentsData";

const g_Boom = "boom.bmp"; 
const g_Tent = "tent.bmp";
const g_TentTry = "tenttry.bmp";
const g_Gras = "gras.bmp";
const g_GrasNat = "grasnat.bmp"

const g_ScreenWdt = screen.width;
const g_ScreenHgt = screen.height;

const g_Direction = {
    _Ortho : 0,
    _All : 1,
}


const CampingVeld = {
    Gras : 0,
    Tent : 1,
    Boom : 2,
    GrasNat : 3,
    TentTry : 4,
}



function Activate(id) {
    let itemcolor = "orange"
    let iditem = "X_" + id;
    let item = document.getElementById(iditem);
    if(iditem == "X_GrasNat") {
        if(item.style.backgroundColor == itemcolor) {
            switch(item.value) {
                case "" :
                    item.value = "regel";
                    break;
            
                case "regel" :
                    item.value = "kolom";
                    break;
                
                case "kolom" :
                    item.value = "";
                    break;
            }
        } else {
            item.value = ""; 
        }
    }
    DeActivate();
    item.style.backgroundColor = itemcolor;
}

function AllToGras() {
    for(i=1; i <= g_Cols * g_Rows; i++){
        if(IsItem(i, g_Boom) == false) {
            let img = document.getElementById(i);
            img.src = "images/Gras.bmp";
        }
    } 
    UpdateAllCounters();   
}


function ArrayAdd(MyArray, FromInt, UpToInt) {
    for(let i = FromInt; i <= UpToInt; i++) {
        MyArray.push(i)
    }
    return MyArray;
}


function ArrayContains(MyArray, Number) {
    var found = false;
    for(let i = 0; i < MyArray.length; i++) {
        if (MyArray[i] == Number) {
            found = true;
            break;
        }
    }
    return found;
}


// var MyArray = [1, 2, 3, 4, 5, 5, 6, 7, 8, 5, 9, 0];
// MyArray = IntArraySplice(MyArray,5);

function ArraySplice(MyArray, number) {  
    let arr = [];

    for(let i=0; i < MyArray.length; i++){
        if(MyArray[i] != number) arr.push(MyArray[i]);
    }
    return arr;
}
// output => [1, 2, 3, 4, 6, 7, 8, 9, 0]



function ArrayShow(MyArray, Info) {
    let msg = ""
    for(let i=0; i<MyArray.length; i++) {
        msg = msg + MyArray[i].toString() + "\n";
    }
    return msg;
}


function CheckCounter(id) {
    let item = document.getElementById(id);
    let itemtxt = item.innerHTML;
    let txtitems = itemtxt.split("/");
    if(txtitems[0] != txtitems[1]) {
        return false;
    } else {
        return true;
    } 
}


function CheckTrees() {
    // get all trees
    var trees = [];
    for(let i=1; i <= (g_Rows * g_Cols); i++ ){
        if(IsItem(i, g_Boom) == true) {
            trees.push(i);
        }  
    }

    var usedtents = [];
    var changed = true;
    var map = new Map();

    while (changed == true) {
        changed = false;

        for(let i=0; i < trees.length; i++) {
            let nrtree = trees[i];

            if(map.has(nrtree) == false) {
                let Tents = TentsArroundTree(nrtree);
                let chknr = [];
                for(n=0; n<Tents.length; n++){
                    if(ArrayContains(usedtents,Tents[n]) == false) chknr.push(Tents[n]);
                }

                if(chknr.length == 1) {
                    let nrtent = chknr[0];
                    if(ArrayContains(usedtents, nrtent) == false) {
                        map.set(nrtree,nrtent);
                        usedtents.push(nrtent);
                        changed = true;
                    }                   
                }
            }
        }
    }

    let msg = "";
    let nrhilite = [];

    for(i=0; i<trees.length; i++){
        let nr = trees[i];
        if(map.has(nr) == false) {
            msg = msg + "\nBoom:" + nr.toString() + " heeft geen tent"
            nrhilite.push(nr);
        }
    }
    if(nrhilite.length > 0) HiliteItems(nrhilite);

    if(trees.length != map.size) { 
        msg = "\n\nElke boom heeft geen tent: " + msg;  
        for (let [key, value] of map) {
            msg = msg + "\nBoom:" + key.toString() + " , Tent:" + value.toString();
        }
    }   
    return msg;
}



// Call changeImage() function on button click
function ChangeImage(id){
    // ["X_Boom", "X_Tent", "X_TentTry" ,"X_Gras" , "X_GrasNat" ];
    let imgX = GetActive();

    if (document.getElementById(id)) {
        if(IsItem(id,g_Boom) == true) {
            alert("Attentie\n\n" + "Een Boom is niet te veranderen in een actief spel...");
            return;
        }

        if(imgX == "X_GrasNat") {
            let delta = 0;
            let start = 0;
            let currow = GetRow(id);
            let curcol = GetCol(id);
            let action = document.getElementById("X_GrasNat") // PuzzleActionValue();

            switch (action.value) {
                case "kolom":
                    delta = g_Cols;
                    start = curcol;
                    start = parseInt(start);                   
                    break;
                case "regel":
                    delta = 1;
                    start = ((currow - 1) * g_Cols) + 1;
                    start = parseInt(start);                
                    break;            
                default:
                    break;
            }
            // if delta > 0 multiple GrasNat
            if(delta > 0) {
                for(i = 0; i < g_Cols; i++) {
                    let nr = start + (i * delta);
                    if(IsItem(nr, g_Gras) == true) {
                        let newimg = 'images/' + imgX.replace("X_", "") + '.bmp';
                        document.getElementById(nr).src = newimg;
                    }
                }
                return;
            }
        }
        
        let curimg = document.getElementById(id).src;
        let newimg = 'images/' + imgX.replace("X_", "") + '.bmp'
        
        // check if active img is same as selected
        if( curimg.includes(newimg) ) {
            newimg = 'images/' + "Gras" + '.bmp'
        } 

        // set correct image
        document.getElementById(id).src = newimg;
        UpdateCounters(id);

        // update number of tents
        CountTents();
    } 

}



function Create() {

    let game =  localStorage.getItem(g_CampingGame);

    if(game == null) game = "";

    if(game.length > 0) { 
        let wdthgt = Math.sqrt(game.length);
        SelectSize(wdthgt.toString());
    }

    let item = document.getElementById(1);
    if(item) {

        if(confirm("Er is al een spel actief !!\n\nNieuw spel maken?")){

        }else {
            return;
        }
    }

    let size = document.getElementById("PuzzleSize");
    let wdthgt = parseInt(size.value);
    g_Rows = wdthgt;
    g_Cols = g_Rows;
    
    DeActivate();
    Activate("Tent");
    TableCreate(g_Rows, g_Cols);

    let IdList = [ "TablePuzzle" , "TablePuzzle"];

    ZoomWindow( IdList);

    if (game.length == 0) {
        CreatePuzzle();

    } else {

        // alert("Game:\n>" + localStorage.getItem(g_CampingGame) + "<");
        for(i=0; i < game.length; i++){
            SetImage(i + 1, game.charAt(i));
        }
        
        
        let rowcnt = localStorage.getItem(g_CampingMaxRows);
        // alert("Loaded MaxRow: >" + rowcnt + "<");
        let rowitems = rowcnt.split(":");
        if(rowitems.length > 1)
            for(let i=0; i < rowitems.length; i++){
                let nr = i + 1;
                let idname = "row_" + nr.toString();
                document.getElementById(idname).innerHTML = rowitems[i]
            }

        
        let colcnt = localStorage.getItem(g_CampingMaxColumns);
        // alert("Loaded MaxCol: >" + colcnt + "<");
        let colitems = colcnt.split(":");
        if(colitems.length > 1)
            for(let i=0; i < colitems.length; i++){
                let nr = i + 1;
                let idname = "col_" + nr.toString();
                document.getElementById(idname).innerHTML = colitems[i]
            }

        localStorage.setItem(g_CampingGame, "");

        // get solution
        let tentsdata = localStorage.getItem(g_CampingTents);
        let tentsarray = tentsdata.split(";");
        g_TentsInPuzzle = [];
        if(tentsdata.length > 0){
            for(let i=0; i<tentsarray.length; i++){
                let val = tentsarray[i];
                if(val.length > 0){
                    let nr = parseInt(val);
                    g_TentsInPuzzle.push(nr);
                }
            }
        }

    }

    UpdateAllCounters();

    CountTrees();

    CountTents();

}


function CreatePuzzle() {
    var BoomPlekken = [];
    BoomPlekken = ArrayAdd(BoomPlekken, 1, g_Rows * g_Cols);
    var TentPlekken = [];
    TentPlekken = ArrayAdd(TentPlekken, 1, g_Rows * g_Cols);
    var Bomen = [];
    var Tenten = [];

    while (BoomPlekken.length > 0) {
        var len = BoomPlekken.length;
        // alert("CreatePuzzle BoomPlekken = " + len.toString());

        let Nr = GetRandom(0,BoomPlekken.length - 1);
        let BoomPlek = BoomPlekken[Nr];
        let PlekRondom = NumbersArround(BoomPlek, 0);

        // ShowArray(PlekRondom, "Plekken rondom, voor plek: " + BoomPlek.toString() + "\n");

        if(PlekRondom.length == 0) {
            // geen mogelijke tentplek rondom boom
            // alert("Geen plek rondom...");
            BoomPlekken = ArraySplice(BoomPlekken, BoomPlek);
        } else {
            // mogelijke tentplek rondom boom
            let Rondom = [];
            for(let i=0; i < PlekRondom.length; i++) {
                if(ArrayContains(TentPlekken,PlekRondom[i])) {
                    Rondom.push(PlekRondom[i]);
                }
            }

            // ShowArray(Rondom, "Vrije Plekken rondom, aantal: " + Rondom.length.toString());

            if(Rondom.length == 0) {
                BoomPlekken = ArraySplice(BoomPlekken, BoomPlek);
            } else {
                // kies random plek uit rondom
                let TentNr = GetRandom(0, Rondom.length - 1);
                let TentPlek = Rondom[TentNr];
                // alert("Gekozen Tentplek uit lijst: " + TentPlek.toString());
                BoomPlekken = ArraySplice(BoomPlekken, BoomPlek);
                BoomPlekken = ArraySplice(BoomPlekken, TentPlek);
                TentPlekken = ArraySplice(TentPlekken, TentPlek); 

                let Bezet = NumbersArround(TentPlek, 1);
                for(let x=0; x<Bezet.length; x++) {
                    TentPlekken = ArraySplice(TentPlekken, Bezet[x]); 
                }
                
                // bewaar plek boom en tent
                Bomen.push(BoomPlek);
                // ShowArray(Bomen, "Alle bomen: \n");

                Tenten.push(TentPlek);
                // ShowArray(Tenten, "Alle tenten: \n");
            }
        }
        
    }

    // ShowArray(Bomen, "Bomen planten...");

    // img.src = 'images/Gras.bmp';
    // plant bomen
    let imgname = 'images/Boom.bmp'
    let err = "";

    for(let i=0; i < Bomen.length; i++) {
        let nr = Bomen[i];
        let img = document.getElementById(nr);
        if(img) {
            img.src = imgname;
        } else {
            err = err + nr.toString() + " "
        }
    }
    if (err.length > 0 ) {
        alert("Attentie\n\n" + "Niet gevonden boomplekken: \n" + err)
    }
    // ShowArray(Tenten, "Tenten plaatsen...");
    // plaats tenten
    imgname = 'images/Tent.bmp'
    err = "";

    for(let i=0; i < Tenten.length; i++) {
        let nr = Tenten[i];
        let img = document.getElementById(nr);
        if(img)  { 
            img.src = imgname;
        } else {
            err = err + nr.toString() + " "
        }
    }
    if (err.length > 0 ) { 
        alert("Attentie\n\n" + "Niet gevonden tentplekken: \n" + err);
    }
    // alert("CreatePuzzle... klaar !!");

    UpdateMaxCounters();

    HideTentsInPuzzle();

}


function CountTrees() {
    let counter = 0;
    for(let i=1; i < (g_Cols * g_Rows); i++) {
        if(IsItem(i,g_Boom) == true) counter++;
    }

    let txtitem = document.getElementById("X_Boom");
    if(txtitem) {
        txtitem.value = counter.toString();
    } else alert("Attentie\n\n"+"Aantal bomen niet gezet ...");
}

function CountTents() {
    let counter = 0;
    for(let i=1; i <= (g_Cols * g_Rows); i++) {
        if(IsItem(i, g_Tent) == true) counter++;
    }
    let txtitem = document.getElementById("X_Tent");
    if(txtitem) {
        txtitem.value = counter.toString();
    } else alert("Attentie\n\n"+"Aantal tenten niet gezet ...");
}


function CountRowTents(row) {
    let start = ((row - 1) * g_Cols) + 1;
    let delta = 1;
    let count = 0;

    for(let i=1; i<= g_Cols; i++) {
        let nr = start + ((i - 1) * delta);
        if(IsItem(nr, g_Tent) == true) count++;
    }
    return count;
}

function CountColumnTents(col) {
    let start = col;
    let delta = g_Cols;
    let count = 0;

    for(let i=1; i<= g_Rows; i++) {
        let nr = start + ((i - 1)* delta);
        if(IsItem(nr, g_Tent) == true) count++;
    }
    return count;
}


function DeActivate() {
    const Plekken = ["X_Tent", "X_TentTry" ,"X_Gras" , "X_GrasNat"];
    for( let i= 0; i < Plekken.length; i++) {
        let item = document.getElementById(Plekken[i]);
        item.style.backgroundColor = "white";
    }
}



 
function GetActive() {
    const Plekken = ["X_Tent", "X_TentTry" ,"X_Gras" , "X_GrasNat"];
    for( let i= 0; i < Plekken.length; i++) {
        let item = document.getElementById(Plekken[i]);
        if (item.style.backgroundColor != "white") {
            return Plekken[i];
        }
    }
    return "";
}



function GetImageValue(id) {
    let img = document.getElementById(id);
    let imgname = img.src;
    imgname = imgname.toUpperCase();
    let rtn = " ";

    if(imgname.endsWith("IMAGES/GRAS.BMP")) rtn = "0"; 
    if(imgname.endsWith("IMAGES/TENT.BMP")) rtn = "1"; 
    if(imgname.endsWith("IMAGES/BOOM.BMP")) rtn = "2"; 
    if(imgname.endsWith("IMAGES/GRASNAT.BMP")) rtn = "3"; 
    if(imgname.endsWith("IMAGES/TENTTRY.BMP")) rtn = "4";   

    return rtn;  
}


function GetCountValues(prefix) {
    let rtnval = "";

    for(let i=1; i<= g_Cols; i++) {
        let id = prefix + i.toString();
        let cnt = document.getElementById(id);
        if(cnt){
            let txt = cnt.innerHTML;
            if(txt) {
                rtnval = rtnval + txt;
                if(i < g_Cols) rtnval = rtnval + ":";
            }
        }
    }
    return rtnval;
}



function GetCol(number) {
    let rownr = 1;
    let colnr = 0;
    let curnr = number;

    while (curnr > g_Cols) {
        curnr = curnr - g_Cols;
        rownr++;
    }
    return curnr;
}

function GetItemArray(ItemBmpName) {
    let Items = [];
    for(let i=1; i <= (g_Rows * g_Cols); i++ ){
        if(IsItem(i, ItemBmpName) == true) {
                Items.push(i);
        }
    } 
    return Items;
}


function GetItemsArround(Number, BmpName, Direction) {
    var MyArray = [];
    if(Number == null){
        alert("Attentie\n\n"+"Variable 'Number' is undefined.");
        return MyArray;
    } 
    if(Direction == null){
        alert("Attentie\n\n"+"Variable 'Direction' is undefined.");
        return MyArray;
    } 

    var curRow = GetRow(Number);
    var curCol = GetCol(Number);

    if(curCol > 1) MyArray.push(Number - 1);                // links
    if(curCol < g_Cols) MyArray.push(Number + 1);           // rechts

    if(curRow > 1) MyArray.push(Number - g_Cols);           // boven
    if(curRow < g_Rows) MyArray.push(Number + g_Cols);      // onder   
    
    if( Direction == g_Direction._All) {

        if( (curCol > 1) && (curRow > 1) ) MyArray.push(Number - (g_Cols + 1));           // links boven
        if( (curCol < g_Cols) && (curRow > 1) ) MyArray.push(Number - (g_Cols - 1));      // rechts boven

        if( (curCol > 1) && (curRow < g_Rows) ) MyArray.push(Number + (g_Cols - 1));      // links onder
        if( (curCol < g_Cols) && (curRow < g_Rows) ) MyArray.push(Number + (g_Cols + 1)); // rechts onder

    }

    var founditems = [];
    
    for(i = 0; i < MyArray.length; i++){
        if(IsItem(MyArray[i] ,BmpName) == true ) founditems.push(MyArray[i]);
    }
    return founditems;
}


function GetRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

function GetRow(number) {
    let rownr = 1;
    let colnr = 0;
    let curnr = number;

    while (curnr > g_Cols) {
        curnr = curnr - g_Cols;
        rownr++;
    }
    return rownr;
}

function GetTentsData() {
    if(g_TentsInPuzzle.length == 0) return "";

    let data = ""
    for(i = 0; i < g_TentsInPuzzle.length; i++){
        let nr = g_TentsInPuzzle[i];
        let val = nr.toString();
        data = data + val + ";" ;
    }
    return data;
}


function GrasNat_Text(text) {
    let item = document.getElementById("X_GrasNat");
    if(item) {
        item.value = text;
    }
}

function Help() {
    let msg = "";
    msg = msg + "Oplossen puzzel via onderstaande regels:\n";
    msg = msg + "\n1 - Plaats 'NatGras' op Grasvelden van een rij of kolom met gelijke aantallen, bijv. 3/3";
    msg = msg + "\n2 - Plaats een 'Tent' op Grasvelden waar dit zeker is";
    msg = msg + "\n3 - Plaats een 'Voorlopige' Tent om te testen";
    msg = msg + "\n4 - Druk op [Controleer] voor controle oplossing";
    alert("Attentie\n\n" + msg);
}


function HiliteItems(NrArray) {
    for (let i=0; i < NrArray.length; i++){
        ImageBorder(NrArray[i], true);
    }   
}



function HideTentsInPuzzle() {
    g_TentsInPuzzle = [];

    for(let i=1; i <= (g_Cols * g_Rows); i++) {
        let img = document.getElementById(i);
        let imgname = img.src;
        imgname = imgname.toUpperCase();
        if(imgname.endsWith("IMAGES/TENT.BMP")) {
            img.src = "images/Gras.bmp";
            g_TentsInPuzzle.push(i);
        }        
    }
}


function ImageBorder(imgid, border){
    let img = document.getElementById(imgid);
    if(border) {
        if(img.style.border != g_redborder) {
            img.style.border = g_redborder;
        }
    } else {
        if(img.style.border == g_redborder) {
            img.style.border = g_greenborder;
        }       
    }
}



function IsItem(Number, ItemName) {
    let item = document.getElementById(Number);
    let found = false;

    if(item == undefined){
        alert("Attentie\n\n" + "IMG niet gevonden met nr:" + Number.toString());
    } else {
        let imgname = item.src;
        imgname = imgname.toUpperCase();
        if(imgname.endsWith(ItemName.toUpperCase())) found = true;  
    }
    return found;
}



function NumbersArround(Number, Direction) {
    // Direction 0 =  hor+vert
    // Direction 1 =  hor+vert+diag

    if(Number == null){
        alert("Attentie\n\n" + "Variable 'Number' is undefined.");
    } 
    if(Direction == null){
        alert("Attentie\n\n" + "Variable 'Direction' is undefined.");
    } 

    var MyArray = [];
    var curRow = GetRow(Number);
    var curCol = GetCol(Number);

    if(curCol > 1) MyArray.push(Number - 1);                // links
    if(curCol < g_Cols) MyArray.push(Number + 1);           // rechts

    if(curRow > 1) MyArray.push(Number - g_Cols);           // boven
    if(curRow < g_Rows) MyArray.push(Number + g_Cols);      // onder   
    
    if( Direction == g_Direction._All) {

        if( (curCol > 1) && (curRow > 1) ) MyArray.push(Number - (g_Cols + 1));           // links boven
        if( (curCol < g_Cols) && (curRow > 1) ) MyArray.push(Number - (g_Cols - 1));      // rechts boven

        if( (curCol > 1) && (curRow < g_Rows) ) MyArray.push(Number + (g_Cols - 1));      // links onder
        if( (curCol < g_Cols) && (curRow < g_Rows) ) MyArray.push(Number + (g_Cols + 1)); // rechts onder

    }
    return MyArray;
}


function PuzzleActionValue() {
    let action = document.getElementById("PuzzleAction");
    return action.value;
}

function ActionOK(name) {
    let action = confirm("Doorgaan met gekozen actie: \n\n'" + name + "' ??");
    return action
}

function RunAction(evt) {
    let action = evt.target.value;

    switch(action) {
        case "---":
            GrasNat_Text("");
            break;

        case "Maak nieuwe Puzzel":
          Create();
          evt.target.value = "---";
          GrasNat_Text("");
          break;

        case "Leeg actieve Puzzel":
            if(!ActionOK("Leeg actieve Puzzel")) {
                evt.target.value = "---";
                GrasNat_Text("");
                break;              
            };
            UnMark();
            AllToGras();
            evt.target.value = "---";
            GrasNat_Text("");
            break;
 
        case "Alle Tent? naar Tent":
            if(!ActionOK("Alle Tent? naar Tent")) {
                evt.target.value = "---";
                GrasNat_Text("");
                break;              
            };
            UnMark();
            TryToTent();
            evt.target.value = "---";
            GrasNat_Text("");
            break;

        case "Controleer oplossing":
            UnMark();

            let result = CheckAllTrees();
            let msg = "Solved:" + result.Solved.toString() + "\nMessage:\n" + result.Message;

            let CheckData = Solution_Check();
            let Solved = CheckData.Solved;
            let Message = CheckData.Message;

            if(Solved) {
                let ShowData = Solution_Show();
                // let SolvedShow = ShowData.Solved;
                // let MessageShow = ShowData.Message;
                alert("Attentie\n\nDe oplossing is correct!!");

            } else {
                if(confirm(Message + "\n\nToon correcte oplossing?")){
                    let ShowData = Solution_Show();
                    let SolvedShow = ShowData.Solved;
                    let MessageShow = ShowData.Message;
                    alert("Attentie\n\n" + MessageShow + "\n\nZie gemarkeerde velden");               
                }
            }
            evt.target.value = "---";
            GrasNat_Text("");
            break;

        case "Zet markering uit":
            UnMark();
            evt.target.value = "---";
            GrasNat_Text("");
            break;

        case "Help":
            Help();
            evt.target.value = "---";
            GrasNat_Text("");
            break;
        default:
            alert("Attentie","Niet ondersteunde actie: '" + action + "'");
    }

}


function Solution_Check() {
    let Solved = false;
    let Message = "";
    let nrs = "";

    for(let r=1; r <= g_Rows; r++) {
        if(CheckCounter("row_"  + r.toString()) == false) {
            nrs += " " + r.toString();
        }
    }
    if(nrs.length > 0){
         Message = Message + "\nAantal tenten fout in Rij: " + nrs;
         nrs = "";
    }

    for(let c=1; c <= g_Cols; c++) {
        if(CheckCounter("col_"  + c.toString()) == false) {
            nrs += " " + c.toString();
        }
    }
    if(nrs.length > 0){
        Message = Message + "\nAantal tenten fout in Kolom: " + nrs;
   }

    if(Message.length > 0) {
        Message = "\n\nAantallen onjuist !!\n" + Message
        return { Solved, Message };
    }

    // check image tent, mogen elkaar niet raken
    let rakendetenten = TentenRaken();
    if(rakendetenten.length > 0) {
        HiliteItems(rakendetenten);
    }

    if(Message.length > 0) {
        Message = Message + "\n\nTenten raken elkaar\n[MarkeerUit] om markering uit te zetten"
        return { Solved, Message };
    }

    Message = Message + CheckTrees();

    if(Message.length > 0) {
        Solved = false;
        Message = "Oplossing is niet juist!   Gevonden fouten:" + Message;
    } else {
        Solved = true;
        Message = "Oplossing van de puzzel is juist";
    }
    return { Solved, Message };

}

function Solution_Show() {
    let Solved = false;
    let Message = "";

    if(g_TentsInPuzzle.length == 0){
        Message = "Oplossing puzzel niet bekend ...";
        return { Solved, Message}
    }

    UnMark();

    let ok = 0;
    for(let i=0; i < g_TentsInPuzzle.length; i++) {
        if(IsItem(g_TentsInPuzzle[i], g_Tent) == true) ok++;
        ImageBorder(g_TentsInPuzzle[i], true);
    }
    if(ok == g_TentsInPuzzle.length) {
        Message = "Oplossing is identiek !";
        Solved = true;
    } else {
        Solved = false;
        Message = "Oplossing is NIET identiek aan puzzel\n"+ 
                  ok.toString() + " van de " + g_TentsInPuzzle.length.toString() + " komen overeen";
            
    }
    return { Solved, Message};
}

function SelectSize(valueToSelect) {    
    let element = document.getElementById("PuzzleSize");
    element.value = valueToSelect;
}


function SetImage(imgid, imgvalue) {
    let img = document.getElementById(imgid);

    switch(imgvalue) {
        case "0":
            img.src = "images/Gras.bmp";
          break;
        case "1":
            img.src = "images/Tent.bmp";
          break;
          case "2":
            img.src = "images/Boom.bmp";
          break;
          case "3":
            img.src = "images/GrasNat.bmp";
          break;
          case "4":
            img.src = "images/TentTry.bmp";
          break;

        default:
            alert("Attentie\n\n" + "Onbekende waarde >" + imgvalue + "<");
      }
}


function TableCreate(rows, cols) {

    // Creating "body" element
    var H = document.createElement("body");
    // Retaining id
    H.setAttribute("id", "NewGame");

    var tbl = document.createElement('table');
    var imgcounter = 1;
    tbl.setAttribute('border', '0px');
    tbl.id = "TablePuzzle";
    var tbdy = document.createElement('tbody');

    for (let ir = 1; ir < rows + 2; ir++) {
      var tr = document.createElement('tr');
      for (let ic = 1; ic < cols + 2; ic++) {
          var td = document.createElement('td');
          
          if( ir < rows + 1) {
            
            if( ic < cols + 1) {
                // image op elke plek <= cols
                var img = document.createElement("img");
                img.src = 'images/Gras.bmp';
                img.id = imgcounter.toString();
                img.style.border = g_greenborder;
                img.setAttribute('onclick', "ChangeImage(id)");
                td.appendChild(img);
                imgcounter++;
            } else {
                // aantal tenten in regel
                var txt = document.createElement("text");
                txt.id = "row_" + ir.toString();
                txt.innerHTML = "0/0";
                txt.style.backgroundColor = "white"
                td.appendChild(txt);
            }

          } else {
            if(ic < cols + 1) {
                var txt = document.createElement("text");
                txt.id = "col_" + ic.toString();
                txt.innerHTML = "0/0";
                txt.style.backgroundColor = "white"
                td.appendChild(txt);               
            }
          }
          tr.appendChild(td);
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    H.appendChild(tbl);

    

    // Replacing one element with another
    GameArea.replaceChild(H, GameArea.childNodes[0]);

}


function TentenRaken() {
    let tentenfout = [];

    for(let i=1; i <= (g_Rows * g_Cols); i++) {
        if(IsItem(i, g_Tent) == true) {
            let omheen = NumbersArround(i,1);

            for(let x=0; x < omheen.length; x++){
                let imgnr = omheen[x];
                if(IsItem(imgnr, g_Tent) == true) tentenfout.push(imgnr);
            }
        }
    }
    return tentenfout;
}


function TentenOmBoom(nr, IsInArray) {
    let rondom = NumbersArround(nr,0);
    let tentom = [];

    for(let i=0; i < rondom.length; i++){
        // plek omboom
        let nr = rondom[i];
        if(IsItem(nr, g_Tent) == true) {
            // controleer of tent nog vrij is
            if(ArrayContains(IsInArray,nr)) tentom.push(nr);
        }
    }
    return tentom;
}


function TentsArroundTree(nr) {
    let rondom = NumbersArround(nr,0);
    let tentom = [];

    for(i=0; i < rondom.length; i++){
        // plek omboom
        let nr = rondom[i];
        if(IsItem(nr, g_Tent) == true) {
            tentom.push(nr);
        }
    }
    return tentom;
}

function TryToTent() {
    for(i=1; i <= g_Cols * g_Rows; i++){
        if(IsItem(i, g_TentTry) == true) {
            let img = document.getElementById(i);
            img.src = "images/Tent.bmp";
        }
    }  
}

   


function UnMark() {
    for(let i=1; i <= (g_Cols * g_Rows); i++) {
        ImageBorder(i, false);
    }
}

function UpdateAllCounters() {
    for(let ix=1; ix <= g_Cols; ix++) {
        let nr = ((ix - 1) * g_Cols) + ix;
        UpdateCounters(nr);
    }
}

function UpdateCounters(id) {
    let nr = parseInt(id);
    let c = GetCol(nr);
    let r = GetRow(nr);

    let tntrow = CountRowTents(r);

    let txt_id = "row_" + r.toString();
    let txt = document.getElementById(txt_id).innerHTML;
    let txtitems = txt.split("/");

    let newtxt = tntrow.toString() + "/" + txtitems[1];
    document.getElementById(txt_id).innerHTML = newtxt;

    UpdateColor(txt_id, tntrow == txtitems[1]);

    let tntcol = CountColumnTents(c);

    txt_id = "col_" + c.toString();
    txt = document.getElementById(txt_id).innerHTML;
    txtitems = txt.split("/");

    newtxt = tntcol.toString() + "/" + txtitems[1];
    document.getElementById(txt_id).innerHTML = newtxt;

    UpdateColor(txt_id, tntcol == txtitems[1]);
}


function UpdateColor(id, IsOK) {
    let item = document.getElementById(id);
    if(IsOK) {
        item.style.backgroundColor = "lightgrey"
    } else {
        item.style.backgroundColor = "orange"
    }
    
}


function UpdateMaxCounters() {

    // count row items
    for(let r=1; r <= g_Rows; r++) {
        let tnt = 0;
        for(let c=1; c<=g_Cols;c++) {
            let nr = ((r - 1) * g_Cols) + c
            let img = document.getElementById(nr);
            let imgname = img.src;
            imgname = imgname.toUpperCase();
            if(imgname.endsWith("IMAGES/TENT.BMP")) tnt++;
        }
        let txt_id = "row_" + r.toString();
        let txt = document.getElementById(txt_id).innerHTML;
        let txtitems = txt.split("/");

        let newtxt = txtitems[0] + "/" + tnt.toString();
        document.getElementById(txt_id).innerHTML = newtxt;
    }

    // count col items
    for(let c=1; c <= g_Cols; c++) {
        let tnt = 0;
        for(let r=1; r <= g_Rows; r++) {
            let nr = ((r - 1) * g_Cols) + c
            let img = document.getElementById(nr);
            let imgname = img.src;
            imgname = imgname.toUpperCase();
            if(imgname.endsWith("IMAGES/TENT.BMP")) tnt++;
        }
        let txt_id = "col_" + c.toString();
        let item = document.getElementById(txt_id);
        let txt = item.innerHTML;
        let txtitems = txt.split("/");

        let newtxt = txtitems[0] + "/" + tnt.toString();
        document.getElementById(txt_id).innerHTML = newtxt;
    }
}


function CheckAllTrees() {
    let Solved = false;
    let Message = "";

    let trees = GetItemArray(g_Boom);
    let tents = GetItemArray(g_Tent);

    return { Solved, Message };
}

function CheckAllOpponent(curtrees, curtents, itemtocheck) {
    
    // check itemtocheck with one opponent
    // check itemtocheck without opponent

    let singleList = [];
    let itemcount = 0
    let opponent = ""
    let itemlist = [];
    let opplist = [];

    if(itemtocheck == g_Boom){
        opponent = g_Tent;
        itemcount = curtrees.length;
        for(i=0; i < curtrees.length; i++) itemlist.push(curtrees[i]);
        for(i=0; i < curtents.length; i++) opplist.push(curtents[i]);
    } else {
        opponent = g_Boom;
        itemcount = curtents.length;
        for(i=0; i < curtrees.length; i++) itemlist.push(curtents[i]);
        for(i=0; i < curtents.length; i++) opplist.push(curtrees[i]);
    }

    for(let i=itemcount - 1; i >= 0; i--) {
        let oppnrs = GetItemsArround(itemlist[i], opponent, g_Direction._Ortho);
        let oppfound = 0;
        let itemfound = 0;
        let found = 0;
        for(b=0; b < oppnrs.length; b++){
            found++;
            oppfound = oppnrs[b];
            itemfound = curitems[i];
        }
        switch (found) {
            case 0:
                singleList.push(i)
                break;
            case 1:
                // remove tent and treeitem
                itemlist = ArraySplice(itemlist,itemfound);
                opplist = ArraySplice(opplist,oppfound);
                break;
            default:
                break;
        }
    }
    return ( itemlist, opplist, singleList );

}


// ZoomWindow
// berekent het zoom percentages aan de hand van de array van ID namen
//
function ZoomWindow( IdList) {
    document.body.style.zoom = "100%";
    let maxX = 0;
    let maxY = 0;
    let ScreenWdt = window.innerWidth;
    let ScreenHgt = window.innerHeight;

    for(i = 0; i < IdList.length; i++) {
      let idName = IdList[i];
    	let idObj = document.getElementById(idName);

      if(idObj){
        const rect = idObj.getBoundingClientRect();
        if( rect.right > maxX) maxX = rect.right;
        if( rect.bottom > maxY) maxY = rect.bottom;

        console.log("IdName: " + idName + "  X: " + rect.right.toString() + "  Y: " + rect.bottom.toString());
      } else {
         console.log("ZoomWindow() -> Item NOT found: " + idName );
      }
   }
 
    let Xzoom = (ScreenWdt / maxX) * 100;
    let Yzoom = (ScreenHgt / maxY) * 100;
    let zoomfactor = Xzoom;
    
    if (Yzoom < Xzoom) zoomfactor = Yzoom;

    zoomfactor = 0.98 * zoomfactor;  // 2% marge
    zoomfactor = Math.floor(zoomfactor);

    console.log("ScreenWdt: " + ScreenWdt + " / MaxX: " + maxX + " * 100 ");
    console.log("ScreenHgt: " + ScreenHgt + " / MaxY: " + maxY + " * 100 ");
    console.log("ZoomFactor: " + zoomfactor.toString() );
    document.body.style.zoom = zoomfactor.toString() + "%";
    console.log("ZoomWindow() -> Zoom: " + document.body.style.zoom.toString());
}

