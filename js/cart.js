/* =========================================================
   BODA SNACKS SHOP
   Warenkorb

   Benötigt:
   - products.js
   - core.js
   - die neue index.html
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       ELEMENTE UND GEMEINSAME FUNKTIONEN
    ===================================================== */

    const B = window.Boda;

    const panel =
        document.getElementById("cartPanel");

    if (!panel || !B) {
        return;
    }

    const items =
        document.getElementById("cartItems");

    const checkout =
        document.getElementById("checkoutButton");

    const opener =
        document.getElementById("openCart");

    const toast =
        document.getElementById("toast");

    let toastTimer;


    /* =====================================================
       KURZE STATUSMELDUNG
    ===================================================== */

    function message(text) {
        clearTimeout(toastTimer);

        toast.textContent = text;

        toast.classList.add("show");

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }


    /* =====================================================
       WARENKORB ANZEIGEN
    ===================================================== */

    function render() {
        const cart = B.getCart();

        const sum = B.totals();

        const focused = document.activeElement;

        const focusKey = items.contains(focused)
            ? {
                id: focused.dataset.id,
                action: focused.dataset.action
            }
            : null;


        /* PRODUKTE ODER LEERZUSTAND */

        items.innerHTML = cart.length
            ? cart.map(row => {
                const p = B.product(row.id);

                const unitPriceCents = Math.round(
                    p.price * 100
                );

                const itemTotalCents =
                    unitPriceCents * row.quantity;

                const maximumReached =
                    row.quantity >= B.config.maxQuantity;

                return `
                    <div class="cart-item">

                        <div class="cart-thumb">
                            ${B.artwork(p)}
                        </div>

                        <div>

                            <h4>
                                ${B.escape(p.name)}
                            </h4>

                            <p class="item-price">
                                ${B.escape(p.size)} ·
                                ${B.money(unitPriceCents)} / Stück
                            </p>

                            <div class="qty">

                                <button
                                    type="button"
                                    data-action="minus"
                                    data-id="${p.id}"
                                    aria-label="Einmal weniger ${B.escape(p.name)}"
                                >
                                    −
                                </button>

                                <span aria-label="Menge">
                                    ${row.quantity}
                                </span>

                                <button
                                    type="button"
                                    data-action="plus"
                                    data-id="${p.id}"
                                    aria-label="Einmal mehr ${B.escape(p.name)}"
                                    ${maximumReached ? "disabled" : ""}
                                >
                                    +
                                </button>

                            </div>

                            <button
                                class="remove"
                                type="button"
                                data-action="remove"
                                data-id="${p.id}"
                                aria-label="${B.escape(p.name)} entfernen"
                            >
                                Entfernen
                            </button>

                        </div>

                        <strong>
                            ${B.money(itemTotalCents)}
                        </strong>

                    </div>
                `;
            }).join("")
            : `
                <div class="empty-cart">

                    <h3>
                        Dein Warenkorb ist leer
                    </h3>

                    <p>
                        Schließe den Warenkorb und suche
                        dir Snacks zum Ausprobieren aus.
                    </p>

                </div>
            `;


        /* ARTIKELANZAHL */

        document.getElementById(
            "cartCount"
        ).textContent = sum.count;

        opener.setAttribute(
            "aria-label",
            `Testwarenkorb öffnen, ${sum.count} Artikel`
        );


        /* PREISE */

        document.getElementById(
            "cartSubtotal"
        ).textContent = B.money(sum.subtotal);

        document.getElementById(
            "shippingCost"
        ).textContent = B.money(sum.shipping);

        document.getElementById(
            "cartTotal"
        ).textContent = B.money(sum.total);


        /* MINDESTWARENWERT */

        document.getElementById(
            "minimumText"
        ).textContent = sum.missing
            ? `Noch ${B.money(sum.missing)}`
            : "Erreicht";

        const progress = Math.min(
            100,
            sum.subtotal / B.config.minimumCents * 100
        );

        document.getElementById(
            "minimumProgress"
        ).style.width = `${progress}%`;


        /* WECHSEL ZUR TESTÜBERSICHT */

        const disabled =
            Boolean(sum.missing) ||
            !sum.count ||
            !B.canPersist();

        checkout.classList.toggle(
            "disabled",
            disabled
        );

        checkout.setAttribute(
            "aria-disabled",
            String(disabled)
        );


        /* KONDITIONEN UND SPEICHERHINWEISE */

        const hint = panel.querySelector(
            ".cart-hint"
        );

        if (!B.canPersist()) {
            hint.textContent =
                "Dein Browser konnte den Warenkorb nicht " +
                "speichern. Die Testübersicht ist deshalb " +
                "gesperrt. Bitte erlaube Website-Speicher " +
                "und ändere die Menge erneut.";
        } else {
            const depositHint = sum.unknownDeposit
                ? (
                    "Pfand noch offen; nicht vollständig " +
                    "in dieser Demo-Summe enthalten. "
                )
                : "";

            hint.textContent =
                `${B.conditions()} ` +
                depositHint +
                "Keine echte Bestellung.";
        }


        /* TASTATURFOKUS NACH MENGENÄNDERUNG ERHALTEN */

        if (focusKey) {
            const next = items.querySelector(
                `[data-id="${Number(focusKey.id)}"]` +
                `[data-action="${focusKey.action}"]` +
                ":not(:disabled)"
            );

            const fallback =
                items.querySelector("button") ||
                document.getElementById("closeCart");

            (next || fallback).focus();
        }
    }


    /* =====================================================
       PRODUKT HINZUFÜGEN
       Wird von shop.js aufgerufen.
    ===================================================== */

    window.bodaAddToCart = id => {
        const p = B.product(id);

        if (!p) {
            return;
        }

        const cart = B.getCart();

        const row = cart.find(item => {
            return item.id === p.id;
        });

        if (
            row &&
            row.quantity >= B.config.maxQuantity
        ) {
            message(
                "Maximal 99 Stück je Musterprodukt."
            );

            return;
        }

        if (row) {
            row.quantity += 1;
        } else {
            cart.push({
                id: p.id,
                quantity: 1
            });
        }

        const saved = B.save(cart);

        message(
            saved
                ? `${p.name} im Testwarenkorb.`
                : (
                    "Warenkorb nur vorübergehend verfügbar. " +
                    "Speichern wurde vom Browser blockiert."
                )
        );
    };


    /* =====================================================
       WARENKORB ÖFFNEN
    ===================================================== */

    opener.addEventListener("click", () => {
        panel.removeAttribute("inert");

        panel.removeAttribute("aria-hidden");

        panel.classList.add("show");

        panel.showModal();

        document.body.classList.add(
            "cart-open"
        );

        opener.setAttribute(
            "aria-expanded",
            "true"
        );

        document.getElementById(
            "closeCart"
        ).focus();
    });


    /* =====================================================
       WARENKORB SCHLIESSEN
    ===================================================== */

    document
        .getElementById("closeCart")
        .addEventListener("click", () => {
            panel.close();
        });

    /*
     * Dieses Ereignis wird auch ausgelöst,
     * wenn der native Dialog per Escape geschlossen wird.
     */

    panel.addEventListener("close", () => {
        panel.classList.remove("show");

        document.body.classList.remove(
            "cart-open"
        );

        opener.setAttribute(
            "aria-expanded",
            "false"
        );

        panel.setAttribute(
            "aria-hidden",
            "true"
        );

        panel.setAttribute("inert", "");

        opener.focus();
    });


    /* KLICK AUF DEN HINTERGRUND LINKS NEBEN DEM WARENKORB */

    panel.addEventListener("click", event => {
        const leftEdge =
            panel.getBoundingClientRect().left;

        if (
            event.target === panel &&
            event.clientX < leftEdge
        ) {
            panel.close();
        }
    });


    /* =====================================================
       MENGEN ÄNDERN ODER ARTIKEL ENTFERNEN
    ===================================================== */

    items.addEventListener("click", event => {
        const button = event.target.closest(
            "[data-action]"
        );

        if (!button || button.disabled) {
            return;
        }

        const id = Number(
            button.dataset.id
        );

        const cart = B.getCart();

        const row = cart.find(item => {
            return item.id === id;
        });

        if (!row) {
            return;
        }

        if (button.dataset.action === "remove") {
            row.quantity = 0;
        }

        if (button.dataset.action === "minus") {
            row.quantity -= 1;
        }

        if (button.dataset.action === "plus") {
            row.quantity += 1;
        }

        /*
         * core.js entfernt Einträge mit Menge 0
         * und benachrichtigt die Anzeige automatisch.
         */

        B.save(cart);
    });


    /* =====================================================
       TESTÜBERSICHT NUR MIT GÜLTIGEM WARENKORB
    ===================================================== */

    checkout.addEventListener("click", event => {
        const sum = B.totals();

        if (
            sum.missing ||
            !sum.count ||
            !B.canPersist()
        ) {
            event.preventDefault();

            const hint = panel.querySelector(
                ".cart-hint"
            );

            hint.textContent = !B.canPersist()
                ? (
                    "Speichern nicht möglich. Bitte erlaube " +
                    "Website-Speicher, bevor du zur " +
                    "Testübersicht gehst."
                )
                : (
                    "Für die Testübersicht fehlen noch " +
                    `${B.money(sum.missing)} Warenwert. ` +
                    "Mindestwarenwert: " +
                    `${B.money(B.config.minimumCents)}.`
                );
        }
    });


    /* =====================================================
       AUF WARENKORBÄNDERUNGEN REAGIEREN
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
