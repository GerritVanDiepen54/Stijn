//(function() {
    //// Functie die de zoom-to-fit berekening en aanpassing uitvoert
    //function doZoomToFit() {
        //// Reset eventuele eerdere zoom om de pure contentgrootte te meten
        //document.body.style.transform = 'none';
        //document.body.style.transformOrigin = 'top left';
        //document.body.style.width = 'auto';

        //// Haal de afmetingen van de viewport en de totale content op
        //const viewportWidth = window.innerWidth;
        //const viewportHeight = window.innerHeight;

        //const contentWidth = Math.max(
            //document.documentElement.scrollWidth,
            //document.body.scrollWidth
        //);
        //const contentHeight = Math.max(
            //document.documentElement.scrollHeight,
            //document.body.scrollHeight
        //);

        //// Bereken de benodigde schaalfactor (kies de kleinste om te zorgen dat alles past)
        //const scaleX = viewportWidth / contentWidth;
        //const scaleY = viewportHeight / contentHeight;
        //const scale = Math.min(scaleX, scaleY, 1); // Maximaal 1 (100%) om overmatig vergroten te voorkomen

        //// Pas de schaling toe via CSS Transform voor de beste cross-browser compatibiliteit
        //document.body.style.width = (100 / scale) + '%';
        //document.body.style.transform = `scale(${scale})`;
    //}

    //// 1. Voer de routine uit zodra de HTML volledig is geladen
    //if (document.readyState === 'loading') {
        //window.addEventListener('DOMContentLoaded', doZoomToFit);
    //} else {
        //doZoomToFit();
    //}

    //// Variabelen voor de mobiele longpress detectie
    //let longpressTimer;
    //const longpressDuration = 800; // Tijd in milliseconden voor een longpress

    //// 2. Laptop/Desktop: Alleen na een rechtsklik (contextmenu)
    //window.addEventListener('contextmenu', function(event) {
        //// Controleer of het een muisklik is (pointerType muis of traditionele klik)
        //if (event.pointerType === 'mouse' || !('pointerType' in event)) {
            //event.preventDefault(); // Voorkom het standaard snelmenu van de browser
            //doZoomToFit();
        //}
    //});

    //// 3. Mobiel: Alleen na een longpress (touch events)
    //window.addEventListener('touchstart', function(event) {
        //// Start de timer zodra het scherm wordt aangeraakt
        //longpressTimer = setTimeout(function() {
            //doZoomToFit();
        //}, longpressDuration);
    //}, { passive: true });

    //window.addEventListener('touchend', function() {
        //// Annuleer de timer als de vinger voortijdig wordt opgetild
        //clearTimeout(longpressTimer);
    //});

    //window.addEventListener('touchmove', function() {
        //// Annuleer de timer als de gebruiker begint te scrollen of slepen
        //clearTimeout(longpressTimer);
    //});
//})();


(function() {
    let originalWidth = 0;
    let originalHeight = 0;

    // Functie om de allereerste, pure contentgrootte éénmalig vast te leggen
    function initOriginalSizes() {
        // Reset eventuele eerdere stylen om puur te meten
        document.documentElement.style.transform = 'none';
        document.documentElement.style.width = 'auto';
        document.documentElement.style.height = 'auto';
        document.body.style.width = 'auto';
        document.body.style.height = 'auto';

        // Leg de échte opstartgrootte van de content vast
        originalWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        originalHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

        // Mocht de meting om wat voor reden ook 0 zijn, pak dan de viewport als veilige fallback
        if (originalWidth === 0) originalWidth = window.innerWidth;
        if (originalHeight === 0) originalHeight = window.innerHeight;
    }

    function doZoomToFit() {
        // Als de originele maten nog niet zijn vastgelegd, doe dat dan eerst
        if (originalWidth === 0 || originalHeight === 0) {
            initOriginalSizes();
        }

        // Haal de actuele venstergrootte op
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Bereken de schaalfactor op basis van de ONGEVERANDERDE originele maten
        const scaleX = viewportWidth / originalWidth;
        const scaleY = viewportHeight / originalHeight;

        // Kies de kleinste om te zorgen dat alles past, tot maximaal 100% (1)
        const scale = Math.min(scaleX, scaleY, 1);

        const root = document.documentElement;
        if (scale < 1) {
            // Pas de schaling toe op de root (html-tag) zodat alles perfect mee-schaalt
            root.style.transformOrigin = 'top left';
            root.style.width = (100 / scale) + 'vw';
            root.style.height = (100 / scale) + 'vh';
            root.style.transform = `scale(${scale})`;
        } else {
            // Reset naar standaard als het scherm groot genoeg is
            root.style.transform = 'none';
            root.style.width = '100vw';
            root.style.height = '100vh';
        }

        // Verberg scrollbars die de weergave kunnen verstoren
        root.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    // Luister direct naar elke verandering (zowel breedte als hoogte)
    window.addEventListener('resize', doZoomToFit);

    // Voer uit zodra de pagina en alle elementen (zoals afbeeldingen/tabellen) VOLLEDIG geladen zijn
    // Dit is cruciaal om de juiste beginmaten te kunnen meten!
    if (document.readyState === 'complete') {
        doZoomToFit();
    } else {
        window.addEventListener('load', doZoomToFit);
    }

    // Handmatige triggers (Rechtsklik & Longpress) om de boel eventueel te herberekenen
    window.addEventListener('contextmenu', function(event) {
        if (event.pointerType === 'mouse' || !('pointerType' in event)) {
            event.preventDefault();
            initOriginalSizes(); // Reset de basismethode bij handmatige trigger
            doZoomToFit();
        }
    });

    let longpressTimer;
    window.addEventListener('touchstart', function() {
        longpressTimer = setTimeout(function() {
            initOriginalSizes();
            doZoomToFit();
        }, 800);
    }, { passive: true });

    window.addEventListener('touchend', function() { clearTimeout(longpressTimer); });
    window.addEventListener('touchmove', function() { clearTimeout(longpressTimer); });
})();
