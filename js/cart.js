/* =========================================================
   BODA SNACKS SHOP
   Warenkorb für die drei Boxen
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        "use strict";


        const B =
            window.Boda;


        const panel =
            document.getElementById(
                "cartPanel"
            );


        if (
            !panel ||
            !B
        ) {

            return;

        }


        const items =
            document.getElementById(
                "cartItems"
            );


        const checkout =
            document.getElementById(
                "checkoutButton"
            );


        const opener =
            document.getElementById(
                "openCart"
            );


        const toast =
            document.getElementById(
                "toast"
            );


        let toastTimer;


        /* =================================================
           MELDUNG
        ================================================= */

        function message(text) {

            clearTimeout(
                toastTimer
            );


            if (!toast) {

                return;

            }


            toast.textContent =
                text;


            toast.classList.add(
                "show"
            );


            toastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    3500
                );

        }


        /* =================================================
           WUNSCHBOX ZUSAMMENFASSUNG
        ================================================= */

        function wishSummary() {

            const selected =
                B.readWishSelection();


            if (!selected.length) {

                return "";

            }


            const grouped =
                new Map();


            selected.forEach(
                id => {

                    grouped.set(

                        id,

                        (grouped.get(id) || 0) +
                        1

                    );

                }
            );


            return [...grouped.entries()]

                .map(
                    ([id, qty]) => {

                        const p =
                            B.product(id);


                        return (
                            `${qty}× ${p.name}`
                        );

                    }
                )

                .join(" · ");

        }


        /* =================================================
           WARENKORB ANZEIGEN
        ================================================= */

        function render() {

            const cart =
                B.getCart();


            const sum =
                B.totals();


            items.innerHTML =
                cart.length

                    ? cart.map(
                        row => {

                            const p =
                                B.product(
                                    row.id
                                );


                            const unitPriceCents =
                                Math.round(
                                    p.price *
                                    100
                                );


                            const itemTotalCents =
                                unitPriceCents *
                                row.quantity;


                            const isWish =
                                p.id ===
                                B.config
                                    .wishBoxProductId;


                            const maximumReached =
                                isWish ||
                                row.quantity >=
                                B.config
                                    .maxQuantity;


                            const customSelection =
                                isWish

                                    ? `
                                        <p class="cart-wish-selection">

                                            <strong>
                                                Deine 10 Snacks:
                                            </strong>

                                            <br>

                                            ${B.escape(
                                                wishSummary()
                                            )}

                                        </p>
                                    `

                                    : "";


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

                                            ${B.escape(p.size)}
                                            ·
                                            ${B.money(unitPriceCents)}

                                        </p>


                                        ${customSelection}


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
                                        >
                                            Entfernen
                                        </button>

                                    </div>


                                    <strong>
                                        ${B.money(itemTotalCents)}
                                    </strong>

                                </div>
                            `;

                        }
                    ).join("")

                    : `
                        <div class="empty-cart">

                            <h3>
                                Dein Warenkorb ist leer
                            </h3>

                            <p>
                                Wähle eine der drei BODA Boxen aus.
                            </p>

                        </div>
                    `;


            /* ARTIKELANZAHL */

            document.getElementById(
                "cartCount"
            ).textContent =
                sum.count;


            opener.setAttribute(

                "aria-label",

                `Warenkorb öffnen, ${sum.count} Boxen`

            );


            /* PREISE */

            document.getElementById(
                "cartSubtotal"
            ).textContent =
                B.money(
                    sum.subtotal
                );


            document.getElementById(
                "shippingCost"
            ).textContent =
                B.money(
                    sum.shipping
                );


            document.getElementById(
                "cartTotal"
            ).textContent =
                B.money(
                    sum.total
                );


            /* MINDESTBESTELLWERT */

            document.getElementById(
                "minimumText"
            ).textContent =

                sum.missing

                    ? `Noch ${B.money(sum.missing)}`

                    : "Erreicht";


            const progress =
                Math.min(

                    100,

                    sum.subtotal /
                    B.config.minimumCents *
                    100

                );


            document.getElementById(
                "minimumProgress"
            ).style.width =
                `${progress}%`;


            /* WUNSCHBOX PRÜFEN */

            const hasWishBox =
                cart.some(
                    row => {

                        return (
                            row.id ===
                            B.config
                                .wishBoxProductId
                        );

                    }
                );


            const invalidWish =
                hasWishBox &&
                !B.wishSelectionIsComplete();


            const disabled =

                Boolean(
                    sum.missing
                ) ||

                !sum.count ||

                invalidWish ||

                !B.canPersist();


            checkout.classList.toggle(
                "disabled",
                disabled
            );


            checkout.setAttribute(
                "aria-disabled",
                String(disabled)
            );


            /* HINWEIS */

            const hint =
                panel.querySelector(
                    ".cart-hint"
                );


            if (
                !B.canPersist()
            ) {

                hint.textContent =

                    "Dein Browser konnte die Auswahl nicht speichern. " +

                    "Die Testübersicht ist deshalb gesperrt.";

            }

            else if (
                invalidWish
            ) {

                hint.textContent =

                    `Die Wunschbox braucht genau ` +

                    `${B.config.wishBoxSize} Snacks.`;

            }

            else {

                hint.textContent =

                    `${B.conditions()} ` +

                    "Noch keine echte Bestellung oder Zahlung.";

            }

        }


        /* =================================================
           BOX IN WARENKORB
        ================================================= */

        window.bodaAddToCart =
            id => {

                const p =
                    B.product(id);


                if (
                    !p ||
                    p.builder
                ) {

                    return;

                }


                if (
                    p.id ===
                        B.config.wishBoxProductId &&

                    !B.wishSelectionIsComplete()
                ) {

                    message(

                        `Bitte zuerst ` +

                        `${B.config.wishBoxSize} ` +

                        `Snacks für die Wunschbox auswählen.`

                    );


                    return;

                }


                const cart =
                    B.getCart();


                const row =
                    cart.find(
                        item => {

                            return (
                                item.id === p.id
                            );

                        }
                    );


                if (
                    p.id ===
                        B.config.wishBoxProductId &&
                    row
                ) {

                    message(
                        "Die Wunschbox ist bereits im Warenkorb."
                    );


                    return;

                }


                if (
                    row &&
                    row.quantity >=
                    B.config.maxQuantity
                ) {

                    message(
                        "Maximale Menge für diese Testversion erreicht."
                    );


                    return;

                }


                if (row) {

                    row.quantity +=
                        1;

                }

                else {

                    cart.push({

                        id:
                            p.id,

                        quantity:
                            1

                    });

                }


                const saved =
                    B.save(
                        cart
                    );


                message(

                    saved

                        ? `${p.name} im Warenkorb.`

                        : "Warenkorb konnte nicht gespeichert werden."

                );

            };


        /* =================================================
           WARENKORB ÖFFNEN
        ================================================= */

        opener.addEventListener(
            "click",
            () => {

                panel.removeAttribute(
                    "inert"
                );


                panel.removeAttribute(
                    "aria-hidden"
                );


                panel.classList.add(
                    "show"
                );


                panel.showModal();


                document.body
                    .classList.add(
                        "cart-open"
                    );


                opener.setAttribute(
                    "aria-expanded",
                    "true"
                );


                document.getElementById(
                    "closeCart"
                ).focus();

            }
        );


        /* =================================================
           WARENKORB SCHLIESSEN
        ================================================= */

        document
            .getElementById(
                "closeCart"
            )
            .addEventListener(
                "click",
                () => {

                    panel.close();

                }
            );


        panel.addEventListener(
            "close",
            () => {

                panel.classList.remove(
                    "show"
                );


                document.body
                    .classList.remove(
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


                panel.setAttribute(
                    "inert",
                    ""
                );


                opener.focus();

            }
        );


        /* =================================================
           AUF HINTERGRUND KLICKEN
        ================================================= */

        panel.addEventListener(
            "click",
            event => {

                const leftEdge =
                    panel
                        .getBoundingClientRect()
                        .left;


                if (
                    event.target === panel &&
                    event.clientX < leftEdge
                ) {

                    panel.close();

                }

            }
        );


        /* =================================================
           MENGE ÄNDERN
        ================================================= */

        items.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (
                    !button ||
                    button.disabled
                ) {

                    return;

                }


                const id =
                    Number(
                        button.dataset.id
                    );


                const cart =
                    B.getCart();


                const row =
                    cart.find(
                        item => {

                            return (
                                item.id === id
                            );

                        }
                    );


                if (!row) {

                    return;

                }


                if (
                    button.dataset.action ===
                    "remove"
                ) {

                    row.quantity =
                        0;

                }


                if (
                    button.dataset.action ===
                    "minus"
                ) {

                    row.quantity -=
                        1;

                }


                if (
                    button.dataset.action ===
                        "plus" &&

                    id !==
                        B.config
                            .wishBoxProductId
                ) {

                    row.quantity +=
                        1;

                }


                B.save(
                    cart
                );

            }
        );


        /* =================================================
           CHECKOUT PRÜFEN
        ================================================= */

        checkout.addEventListener(
            "click",
            event => {

                const sum =
                    B.totals();


                const hasInvalidWish =

                    B.getCart().some(
                        row => {

                            return (
                                row.id ===
                                B.config
                                    .wishBoxProductId
                            );

                        }
                    ) &&

                    !B.wishSelectionIsComplete();


                if (
                    sum.missing ||
                    !sum.count ||
                    hasInvalidWish ||
                    !B.canPersist()
                ) {

                    event.preventDefault();


                    const hint =
                        panel.querySelector(
                            ".cart-hint"
                        );


                    if (
                        hasInvalidWish
                    ) {

                        hint.textContent =

                            `Bitte vervollständige deine Wunschbox mit ` +

                            `${B.config.wishBoxSize} Snacks.`;

                    }

                    else if (
                        sum.missing
                    ) {

                        hint.textContent =

                            `Für die Testübersicht fehlen noch ` +

                            `${B.money(sum.missing)} Warenwert.`;

                    }

                }

            }
        );


        /* =================================================
           ÄNDERUNGEN
        ================================================= */

        window.addEventListener(
            "boda:cartchange",
            render
        );


        window.addEventListener(
            "boda:wishchange",
            render
        );


        /* =================================================
           START
        ================================================= */

        render();

    }
);
