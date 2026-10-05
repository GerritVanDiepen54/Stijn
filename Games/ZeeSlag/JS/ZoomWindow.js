// ZoomWindow
// berekent het zoom percentages aan de hand van de array van ID namen
// geef de id van het meest rechtsonder op het scherm gelegen object
// evt meerdere ids geven
// ids in een array mee geven
//
function ZoomWindow(IdList) {
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

        // console.log("IdName: " + idName + "  X: " + rect.right.toString() + "  Y: " + rect.bottom.toString());
      } else {
        // console.log("ZoomWindow() -> Item NOT found: " + idName );
      }
   }
 
    let Xzoom = (ScreenWdt / maxX) * 100;
    let Yzoom = (ScreenHgt / maxY) * 100;
    let zoomfactor = Xzoom;
    
    if (Yzoom < Xzoom) zoomfactor = Yzoom;

    zoomfactor = 0.98 * zoomfactor;  // 2% marge
    zoomfactor = Math.floor(zoomfactor);

    // console.log("ScreenWdt: " + ScreenWdt + " / MaxX: " + maxX + " * 100 ");
    // console.log("ScreenHgt: " + ScreenHgt + " / MaxY: " + maxY + " * 100 ");
    // console.log("ZoomFactor: " + zoomfactor.toString() );
    document.body.style.zoom = zoomfactor.toString() + "%";
    // console.log("ZoomWindow() -> Zoom: " + document.body.style.zoom.toString());
} 