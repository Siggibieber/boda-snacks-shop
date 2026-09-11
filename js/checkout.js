/* =========================================================
   BODA SNACKS SHOP
   Testübersicht und unverbindlicher Testabschluss

   Benötigt:
   - products.js
   - core.js
   - die neue checkout.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       GEMEINSAME FUNKTIONEN UND ELEMENTE
    ===================================================== */

    const B = window.Boda;

    const items =
        document.getElementById("checkoutItems");

    if (!B || !items) {
        return;
    }

    const button =
        document.getElementById("placeOrderButton");

    const warning =
        document.getElementById("checkoutWarning");

    const result =
        document.getElementById("demoResult");


    /* =====================================================
       TESTÜBERSICHT ANZEIGEN
    ===================================================== */

    function render() {
        const cart = B.getCart();

        const sum = B.totals();


        /* ARTIKEL ODER LEERZUSTAND */

        items.innerHTML = cart.length
            ? cart.map(row => {
                const p = B.product(row.id);

                const unitPriceCents = Math.round(
                    p.price * 100
                );

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
                    Dein Testwarenkorb ist leer.

                    <a href="index.html#sortiment">
                        Snacks auswählen
                    </a>
                </p>
            `;


        /* SUMMEN */

        document.getElementById(
            "checkoutSubtotal"
        ).textContent = B.money(sum.subtotal);

        document.getElementById(
            "checkoutShipping"
        ).textContent = B.money(sum.shipping);

        document.getElementById(
            "checkoutTotal"
        ).textContent = B.money(sum.total);


        /* PFANDHINWEIS */

        document.getElementById(
            "depositNote"
        ).textContent = sum.unknownDeposit
            ? (
                "Pfand noch offen. Die Demo-Summe enthält " +
                "kein noch unbekanntes Pfand."
            )
            : (
                "Demo-Summe aus Musterpreisen; " +
                "keine Zahlungsforderung."
            );


        /* MINDESTWARENWERT PRÜFEN */

        button.disabled =
            Boolean(sum.missing) ||
            !sum.count;

        if (!sum.count) {
            warning.textContent =
                "Dein Warenkorb ist leer.";
        } else if (sum.missing) {
            warning.textContent =
                "Zum Mindestwarenwert fehlen noch " +
                `${B.money(sum.missing)}.`;
        } else {
            warning.textContent = "";
        }


        /* ALTES TESTERGEBNIS BEI ÄNDERUNGEN AUSBLENDEN */

        result.hidden = true;
    }


    /* =====================================================
       TEST ABSCHLIESSEN
    ===================================================== */

    document
        .getElementById("demoCheckoutForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const sum = B.totals();


            /* WARENKORB ERNEUT PRÜFEN */

            if (!sum.count || sum.missing) {
                render();
                return;
            }


            /* BESTÄTIGUNG DER TESTVERSION PRÜFEN */

            if (!event.currentTarget.reportValidity()) {
                return;
            }


            /* KEINE BESTELLUNG UND KEINE ZAHLUNG AUSLÖSEN */

            result.hidden = false;

            result.textContent =
                "Test abgeschlossen. Deine Auswahl umfasst " +
                `${sum.count} Artikel und eine Demo-Summe ` +
                `von ${B.money(sum.total)}. ` +
                "Es wurde keine Bestellung versendet, " +
                "kein Vertrag geschlossen und keine Zahlung " +
                "ausgelöst. Dein Warenkorb bleibt erhalten.";

            result.focus();
        });


    /* =====================================================
       ÄNDERUNGEN AM WARENKORB ÜBERNEHMEN
    ===================================================== */

    window.addEventListener(
        "boda:cartchange",
        render
    );


    /* =====================================================
       START
    ===================================================== */

    render();

});
