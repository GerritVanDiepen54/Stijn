
    /**
     * Toont een dynamische Yes/No modal en geeft het resultaat terug.
     * @param {string} title - De titel van de modal.
     * @param {string} message - De tekst/vraag in de modal.
     * @param {string} [txtBtnYes="Ja"] tekstinhoud van txtBtnYes
     * @param {string} [txtBtnNo="Nee"] tekstinhoud van txtBtnNo
     * @param {boolean} [showNoButton=true] - Optioneel: toon of verberg de No-knop.
     * @returns {Promise<boolean>} - True bij 'Yes', False bij 'No'.
     */
    function showConfirmDialog(title, message, txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true) {
        const htmlTekst = message.replace(/\n/g, '<br />');
        return new Promise((resolve) => {
            // Maak de modal overlay aan
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';

            // Bepaal de inline stijl voor de No-knop op basis van de parameter
            const noButtonDisplay = showNoButton ? 'inline-block' : 'none';

            // Injecteer de HTML structuur
            modalOverlay.innerHTML = `
                <div class="modal-box">
                    <h3>${title}</h3>
                    <p>${htmlTekst}</p>
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

    // voorbeelden:

    // async function deleteFile() {
    //     // Toont gewoon de Ja en Nee knop
    //     const confirmed = await showConfirmDialog(
    //         "Verwijderen", 
    //         "Weet je zeker dat je dit bestand wilt verwijderen?"
    //     );
    //     return confirmed;
    // }

    // async function showAlert() {
    //     // Toont ALLEEN de Ja-knop
    //     // txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true)
    //     await showConfirmDialog(
    //         "Systeem Update", 
    //         "De update is succesvol voltooid.\nKlik op Ja om door te gaan.", 
    //         txtBtnYes="Sluiten",txtBtnNo="No",showNoButton = false);
    //     return true;
    // }


    // async function test(){
    //     const result = await deleteFile();
    //     alert("Result: " + result.toString());
    //     const result2 = await showAlert();
    //     alert("Result2: " + result2.toString());
    // }


        /**
     * Toont een dynamische Yes/No modal en geeft het resultaat terug.
     * @param {string} title - De titel van de modal.
     * @param {string} message - De tekst/vraag in de modal.
     * @param {string} [txtBtnYes="Ja"] tekstinhoud van txtBtnYes
     * @param {string} [txtBtnNo="Nee"] tekstinhoud van txtBtnNo
     * @param {boolean} [showNoButton=true] - Optioneel: toon of verberg de No-knop.
     * @returns {Promise<boolean>} - True bij 'Yes', False bij 'No'.
     */
    function getNumberOfBoats(title, message, txtBtnYes="Ja", txtBtnNo="Nee",showNoButton = true) {
        const htmlTekst = message.replace(/\n/g, '<br />');
        return new Promise((resolve) => {
            // Maak de modal overlay aan
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';

            // Bepaal de inline stijl voor de No-knop op basis van de parameter
            const noButtonDisplay = showNoButton ? 'inline-block' : 'none';

            // Injecteer de HTML structuur
            modalOverlay.innerHTML = `
                <div class="modal-box">
                    <h3>${title}</h3>
                    <p>${htmlTekst}</p>
                    <br><br>
                    <p>
                    <label>
                        Aantal zichtbare boot elementen:
                        <select id="nrBoats">
                        <option value="default">9</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        </select>
                    </label>
                    </p> 

                    <div class="modal-buttons">
                        <button id="modal-yes" class="btn btn-yes">${txtBtnYes}</button>
                        <button id="modal-no" class="btn btn-no" style="display: ${noButtonDisplay};">${txtBtnNo}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modalOverlay);

            // Luister naar de 'Yes' klik
            modalOverlay.querySelector('#modal-yes').addEventListener('click', () => {
                var e = document.getElementById("nrBoats");
                var value = e.value;
                var text = e.options[e.selectedIndex].text;
                // let val = modalOverlay.returnValue; //getElementById("nrBoats").value;
                resolve(text);
                document.getElementById("Zichtbaar").value = text;

                cleanup();
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

