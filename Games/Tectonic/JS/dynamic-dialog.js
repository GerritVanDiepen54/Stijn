
    /**
     * Toont een dynamische Yes/No modal en geeft het resultaat terug.
     * @param {string} title - De titel van de modal.
     * @param {string} message - De tekst/vraag in de modal.
     * @param {boolean} [showNoButton=true] - Optioneel: toon of verberg de No-knop.
     * @returns {Promise<boolean>} - True bij 'Yes', False bij 'No'.
     */
    function showConfirmDialog(title, message, txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true) {
        return new Promise((resolve) => {
            // Maak de modal overlay aan
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';

            // Bepaal de inline stijl voor de No-knop op basis van de parameter
            const noButtonDisplay = showNoButton ? 'inline-block' : 'none';

            message = message.replaceAll("\n","<br>");

            // Injecteer de HTML structuur
            modalOverlay.innerHTML = `
                <div class="modal-box">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="modal-buttons">
                        <button id="modal-yes" class="btn btn-yes">${txtBtnYes}</button>
                        <button id="modal-no" class="btn btn-no" style="display: ${noButtonDisplay};">${txtBtnNo}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modalOverlay);

            // Luister naar de 'Yes' klik
            modalOverlay.querySelector('#modal-yes').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            // Luister naar de 'No' klik
            modalOverlay.querySelector('#modal-no').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Helper om de modal netjes uit de HTML te verwijderen
            function cleanup() {
                modalOverlay.remove();
            }
        });
    }
    async function deleteFile() {
        // Toont gewoon de Ja en Nee knop
        const confirmed = await showConfirmDialog(
            "Verwijderen", 
            "Weet je zeker dat je dit bestand wilt verwijderen?\nHeel        erg"
        );
        return confirmed;
    }

    async function showAlert() {
        // Toont ALLEEN de Ja-knop
        // txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true)
        await showConfirmDialog(
            "Systeem Update", 
            "De update is succesvol voltooid.\nKlik op Ja om door te gaan.", 
            txtBtnYes="Sluiten",txtBtnNo="No",showNoButton = false);
        return true;
    }


    // async function test(){
    //     const result = await deleteFile();
    //     alert("Result: " + result.toString());

    //     const result2 = await showAlert();
    //     alert("Result2: " + result2.toString());

    // }
