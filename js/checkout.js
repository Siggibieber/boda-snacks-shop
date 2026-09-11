/* =========================================================
   BODA SNACKS SHOP
   VOLLSTÄNDIGER TEST-CHECKOUT

   - keine echte Bestellung
   - keine Datenübertragung
   - keine echte Zahlung
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    const B = window.Boda;

    const items = document.getElementById("checkoutItems");
    const form = document.getElementById("demoCheckoutForm");
    const button = document.getElementById("placeOrderButton");
    const warning = document.getElementById("checkoutWarning");
    const confirmation = document.getElementById("orderConfirmation");

    const cardFields = document.getElementById("cardFields");
    const paypalInfo = document.getElementById("paypalInfo");
    const cashInfo = document.getElementById("cashInfo");

    if (
        !B ||
        !items ||
        !form ||
        !button ||
        !warning
    ) {
        console.error(
            "BODA Checkout: notwendige Elemente fehlen."
        );

        return;
    }


    /* =====================================================
       WARENKORB ANZEIGEN
    ===================================================== */

    function render() {

        const cart = B.getCart();
        const sum = B.totals();

        items.innerHTML = cart.length
            ? cart.map(row => {

                const p = B.product(row.id);

                if (!p) {
                    return "";
                }

                const unitPriceCents =
                    Math.round(p.price * 100);

                const itemTotalCents =
                    unitPriceCents * row.quantity;

                return `
                    <div class="checkout-item">

                        <div class="checkout-item-image">
                            ${
                                B.artwork(
                                    p,
                                    "checkout-mini-pack"
                                )
                            }
                        </div>

                        <div class="checkout-item-info">

                            <strong>
                                ${B.escape(p.name)}
                            </strong>

                            <small>
                                ${B.escape(p.size)}
                            </small>

                            <span>
                                ${row.quantity}
                                ×
                                ${B.money(unitPriceCents)}
                            </span>

                        </div>

                        <strong>
                            ${B.money(itemTotalCents)}
                        </strong>

                    </div>
                `;

            }).join("")

            : `
                <p>
                    Dein Warenkorb ist leer.

                    <a href="index.html#sortiment">
                        Snacks auswählen
                    </a>
                </p>
            `;


        document.getElementById(
            "checkoutSubtotal"
        ).textContent =
            B.money(sum.subtotal);


        document.getElementById(
            "checkoutShipping"
        ).textContent =
            B.money(sum.shipping);


        document.getElementById(
            "checkoutTotal"
        ).textContent =
            B.money(sum.total);


        const depositNote =
            document.getElementById("depositNote");

        if (depositNote) {

            depositNote.textContent =
                sum.unknownDeposit
                    ? (
                        "Pfand noch offen. Die Demo-Summe enthält " +
                        "kein noch unbekanntes Pfand."
                    )
                    : (
                        "Testberechnung auf Basis der aktuellen Shoppreise."
                    );

        }


        button.disabled =
            Boolean(sum.missing) ||
            !sum.count;


        if (!sum.count) {

            warning.textContent =
                "Dein Warenkorb ist leer.";

        }

        else if (sum.missing) {

            warning.textContent =
                "Zum Mindestwarenwert fehlen noch " +
                B.money(sum.missing) +
                ".";

        }

        else {

            warning.textContent = "";

        }

    }


    /* =====================================================
       ZAHLUNGSART
    ===================================================== */

    function updatePaymentMethod() {

        const selected =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!selected) {
            return;
        }

        const payment = selected.value;


        if (cardFields) {
            cardFields.hidden =
                payment !== "card";
        }

        if (paypalInfo) {
            paypalInfo.hidden =
                payment !== "paypal";
        }

        if (cashInfo) {
            cashInfo.hidden =
                payment !== "cash";
        }


        const cardName =
            document.getElementById("cardName");

        const cardNumber =
            document.getElementById("cardNumber");

        const cardExpiry =
            document.getElementById("cardExpiry");

        const cardCvc =
            document.getElementById("cardCvc");


        [
            cardName,
            cardNumber,
            cardExpiry,
            cardCvc
        ].forEach(input => {

            if (input) {
                input.required =
                    payment === "card";
            }

        });

    }


    document
        .querySelectorAll(
            'input[name="payment"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                updatePaymentMethod
            );

        });


    /* =====================================================
       TEST-KARTENNUMMER FORMATIEREN
    ===================================================== */

    const cardNumber =
        document.getElementById("cardNumber");

    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            () => {

                let value =
                    cardNumber.value
                        .replace(/\D/g, "")
                        .slice(0, 16);

                value =
                    value
                        .replace(
                            /(.{4})/g,
                            "$1 "
                        )
                        .trim();

                cardNumber.value =
                    value;

            }
        );

    }


    /* =====================================================
       ABLAUFDATUM FORMATIEREN
    ===================================================== */

    const expiry =
        document.getElementById("cardExpiry");

    if (expiry) {

        expiry.addEventListener(
            "input",
            () => {

                let value =
                    expiry.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

                if (value.length > 2) {

                    value =
                        value.slice(0, 2) +
                        "/" +
                        value.slice(2);

                }

                expiry.value = value;

            }
        );

    }


    /* =====================================================
       CVC FORMATIEREN
    ===================================================== */

    const cvc =
        document.getElementById("cardCvc");

    if (cvc) {

        cvc.addEventListener(
            "input",
            () => {

                cvc.value =
                    cvc.value
                        .replace(/\D/g, "")
                        .slice(0, 3);

            }
        );

    }


    /* =====================================================
       PLZ FORMATIEREN
    ===================================================== */

    const zip =
        document.getElementById("zip");

    if (zip) {

        zip.addEventListener(
            "input",
            () => {

                zip.value =
                    zip.value
                        .replace(/\D/g, "")
                        .slice(0, 5);

            }
        );

    }


    /* =====================================================
       E-MAIL PRÜFEN
    ===================================================== */

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================================
       PLZ PRÜFEN
    ===================================================== */

    function validZip(zipCode) {

        return /^\d{5}$/.test(zipCode);

    }

const pforzheimZipCodes = [
    "75172",
    "75173",
    "75175",
    "75177",
    "75179",
    "75180",
    "75181"
];

function validPforzheimAddress(zipCode, city) {

    const normalizedCity =
        city
            .trim()
            .toLowerCase();

    return (
        normalizedCity === "pforzheim" &&
        pforzheimZipCodes.includes(zipCode)
    );
}
    /* =====================================================
       TEST-BESTELLNUMMER
    ===================================================== */

    function createOrderNumber() {

        const now = new Date();

        const date =
            now
                .getFullYear()
                .toString()
                .slice(-2) +

            String(
                now.getMonth() + 1
            ).padStart(2, "0") +

            String(
                now.getDate()
            ).padStart(2, "0");


        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return (
            "BODA-" +
            date +
            "-" +
            random
        );

    }


    /* =====================================================
       ZAHLUNGSART LESBAR AUSGEBEN
    ===================================================== */

    function paymentLabel(payment) {

        if (payment === "card") {
            return "Kreditkarte";
        }

        if (payment === "paypal") {
            return "PayPal";
        }

        if (payment === "cash") {
            return "Bar bei Lieferung";
        }

        return "Nicht angegeben";

    }


    /* =====================================================
       BESTELLUNG ABSCHLIESSEN
    ===================================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            warning.textContent = "";


            const cart = B.getCart();
            const sum = B.totals();


            /* ---------------------------------------------
               WARENKORB
            --------------------------------------------- */

            if (!sum.count) {

                warning.textContent =
                    "Dein Warenkorb ist leer.";

                return;

            }


            if (sum.missing) {

                warning.textContent =
                    "Der Mindestbestellwert wurde noch nicht erreicht.";

                return;

            }


            /* ---------------------------------------------
               FELDER
            --------------------------------------------- */

            const firstName =
                document
                    .getElementById("firstName")
                    .value
                    .trim();

            const lastName =
                document
                    .getElementById("lastName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const street =
                document
                    .getElementById("street")
                    .value
                    .trim();

            const zipCode =
                document
                    .getElementById("zip")
                    .value
                    .trim();

            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            /* ---------------------------------------------
               HTML-PFLICHTFELDER
            --------------------------------------------- */

            if (!form.reportValidity()) {
                return;
            }


            /* ---------------------------------------------
               VORNAME / NACHNAME
            --------------------------------------------- */

            if (
                firstName.length < 2 ||
                lastName.length < 2
            ) {

                warning.textContent =
                    "Bitte gib deinen vollständigen Vor- und Nachnamen ein.";

                return;

            }


            /* ---------------------------------------------
               E-MAIL
            --------------------------------------------- */

            if (!validEmail(email)) {

                warning.textContent =
                    "Bitte gib eine gültige E-Mail-Adresse ein.";

                document
                    .getElementById("email")
                    .focus();

                return;

            }


            /* ---------------------------------------------
               STRASSE + HAUSNUMMER
            --------------------------------------------- */

            if (
                street.length < 3 ||
                !/\d/.test(street)
            ) {

                warning.textContent =
                    "Bitte gib Straße und Hausnummer vollständig ein.";

                document
                    .getElementById("street")
                    .focus();

                return;

            }


            /* ---------------------------------------------
               PLZ
            --------------------------------------------- */

            if (!validZip(zipCode)) {

                warning.textContent =
                    "Bitte gib eine gültige fünfstellige Postleitzahl ein.";

                document
                    .getElementById("zip")
                    .focus();

                return;

            }


            /* ---------------------------------------------
               ORT
            --------------------------------------------- */

            if (city.length < 2) {

                warning.textContent =
                    "Bitte gib einen gültigen Ort ein.";

                document
                    .getElementById("city")
                    .focus();

                return;

            }


            /* ---------------------------------------------
               ZAHLUNGSART
            --------------------------------------------- */

            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!selectedPayment) {

                warning.textContent =
                    "Bitte wähle eine Zahlungsart aus.";

                return;

            }


            const payment =
                selectedPayment.value;


            /* ---------------------------------------------
               KREDITKARTEN-TEST
            --------------------------------------------- */

            if (payment === "card") {

                const digits =
                    cardNumber
                        ? cardNumber.value
                            .replace(/\D/g, "")
                        : "";

                if (digits.length !== 16) {

                    warning.textContent =
                        "Bitte gib eine 16-stellige Test-Kartennummer ein.";

                    cardNumber.focus();

                    return;

                }


                if (
                    !expiry ||
                    !/^\d{2}\/\d{2}$/
                        .test(expiry.value)
                ) {

                    warning.textContent =
                        "Bitte gib ein gültiges Test-Ablaufdatum im Format MM/JJ ein.";

                    expiry.focus();

                    return;

                }


                if (
                    !cvc ||
                    !/^\d{3}$/
                        .test(cvc.value)
                ) {

                    warning.textContent =
                        "Bitte gib eine dreistellige Test-CVC ein.";

                    cvc.focus();

                    return;

                }

            }


            /* =================================================
               BESTELLBESTÄTIGUNG
            ================================================= */

            if (!confirmation) {

                console.error(
                    "Bestellbestätigung fehlt in checkout.html."
                );

                warning.textContent =
                    "Die Testbestätigung konnte nicht geladen werden.";

                return;

            }


            const orderNumber =
                createOrderNumber();


            document.getElementById(
                "orderNumber"
            ).textContent =
                orderNumber;


            document.getElementById(
                "confirmationCustomer"
            ).innerHTML =
                B.escape(
                    firstName +
                    " " +
                    lastName
                ) +
                "<br>" +
                B.escape(email);


            document.getElementById(
                "confirmationAddress"
            ).innerHTML =
                B.escape(street) +
                "<br>" +
                B.escape(
                    zipCode +
                    " " +
                    city
                );


            document.getElementById(
                "confirmationPayment"
            ).textContent =
                paymentLabel(payment);


            document.getElementById(
                "confirmationTotal"
            ).textContent =
                B.money(sum.total);


            const confirmationItems =
                document.getElementById(
                    "confirmationItems"
                );


            confirmationItems.innerHTML =
                cart.map(row => {

                    const p =
                        B.product(row.id);

                    if (!p) {
                        return "";
                    }

                    const price =
                        Math.round(
                            p.price * 100
                        );

                    const total =
                        price *
                        row.quantity;


                    return `
                        <div class="checkout-item">

                            <div class="checkout-item-info">

                                <strong>
                                    ${B.escape(p.name)}
                                </strong>

                                <span>
                                    ${row.quantity}
                                    ×
                                    ${B.money(price)}
                                </span>

                            </div>

                            <strong>
                                ${B.money(total)}
                            </strong>

                        </div>
                    `;

                }).join("");

/* ---------------------------------------------
   WARENKORB NACH ERFOLGREICHER BESTELLUNG LEEREN
--------------------------------------------- */

B.save([]);

            /* ---------------------------------------------
               CHECKOUT AUSBLENDEN
            --------------------------------------------- */

            const checkoutGrid =
                document.querySelector(
                    ".checkout-grid"
                );

            if (checkoutGrid) {
                checkoutGrid.hidden = true;
            }


            /* ---------------------------------------------
               DANKE-SEITE ANZEIGEN
            --------------------------------------------- */

            confirmation.hidden = false;


            confirmation.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            confirmation.focus();

        }
    );


    /* =====================================================
       NEUE TESTBESTELLUNG
    ===================================================== */

    const newOrderButton =
        document.getElementById(
            "newTestOrder"
        );


    if (newOrderButton) {

        newOrderButton.addEventListener(
            "click",
            () => {

                confirmation.hidden = true;

                const checkoutGrid =
                    document.querySelector(
                        ".checkout-grid"
                    );

                if (checkoutGrid) {
                    checkoutGrid.hidden = false;
                }


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       WARENKORBÄNDERUNGEN
    ===================================================== */

    window.addEventListener(
        "boda:cartchange",
        render
    );


    /* =====================================================
       START
    ===================================================== */

    updatePaymentMethod();

    render();

});
