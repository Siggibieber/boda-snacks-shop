/* =========================================================
   BODA SNACKS SHOP
   Drei Boxen + Wunschbox-Konfigurator
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        "use strict";


        const B =
            window.Boda;


        if (!B) {

            return;

        }


        const grid =
            document.getElementById(
                "builderGrid"
            );

        const count =
            document.getElementById(
                "builderCount"
            );

        const status =
            document.getElementById(
                "builderStatus"
            );

        const progress =
            document.getElementById(
                "builderProgress"
            );

        const summary =
            document.getElementById(
                "builderSummary"
            );

        const addWishBox =
            document.getElementById(
                "addWishBox"
            );

        const clearWishBox =
            document.getElementById(
                "clearWishBox"
            );

        const toast =
            document.getElementById(
                "toast"
            );


        let category =
            "alle";

        let toastTimer;


        /* =================================================
           KURZE MELDUNG
        ================================================= */

        function message(text) {

            if (!toast) {

                return;

            }


            clearTimeout(
                toastTimer
            );


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
                    3200
                );

        }


        /* =================================================
           AKTUELLE AUSWAHL
        ================================================= */

        function selection() {

            return B.readWishSelection();

        }


        /* =================================================
           AUSWAHL GRUPPIEREN
        ================================================= */

        function groupedSelection(ids) {

            const map =
                new Map();


            ids.forEach(id => {

                map.set(
                    id,
                    (map.get(id) || 0) + 1
                );

            });


            return map;

        }


        /* =================================================
           BUILDER ANZEIGEN
        ================================================= */

        function renderBuilder() {

            if (!grid) {

                return;

            }


            const selected =
                selection();


            const grouped =
                groupedSelection(
                    selected
                );


            const products =
                BODA_PRODUCTS.filter(
                    p => {

                        return (

                            p.builder &&

                            (
                                category === "alle" ||
                                p.category === category
                            )

                        );

                    }
                );


            grid.innerHTML =
                products
                    .map(p => {

                        const selectedCount =
                            grouped.get(p.id) || 0;


                        const full =
                            selected.length >=
                            B.config.wishBoxSize;


                        let categoryLabel =
                            "SÜSS";


                        if (
                            p.category ===
                            "salzig"
                        ) {

                            categoryLabel =
                                "SALZIG";

                        }


                        if (
                            p.category ===
                            "schokolade"
                        ) {

                            categoryLabel =
                                "SCHOKOLADE";

                        }


                        return `
                            <article class="builder-product">

                                <div class="builder-product-art">

                                    ${B.artwork(
                                        p,
                                        "builder-mini-pack"
                                    )}

                                </div>


                                <div class="builder-product-copy">

                                    <p class="builder-product-category">
                                        ${categoryLabel}
                                    </p>

                                    <h3>
                                        ${B.escape(p.name)}
                                    </h3>

                                    <p>
                                        ${B.escape(p.size)}
                                    </p>

                                </div>


                                <div class="builder-qty">

                                    <button
                                        type="button"
                                        data-builder-minus="${p.id}"
                                        aria-label="${B.escape(p.name)} einmal entfernen"
                                        ${selectedCount ? "" : "disabled"}
                                    >
                                        −
                                    </button>


                                    <strong>
                                        ${selectedCount}
                                    </strong>


                                    <button
                                        type="button"
                                        data-builder-plus="${p.id}"
                                        aria-label="${B.escape(p.name)} einmal auswählen"
                                        ${full ? "disabled" : ""}
                                    >
                                        +
                                    </button>

                                </div>

                            </article>
                        `;

                    })
                    .join("");


            const current =
                selected.length;


            const missing =
                B.config.wishBoxSize -
                current;


            count.textContent =
                `${current} von ${B.config.wishBoxSize} ausgewählt`;


            progress.style.width =
                `${Math.min(
                    100,
                    current /
                    B.config.wishBoxSize *
                    100
                )}%`;


            if (current === 0) {

                status.textContent =
                    "Wähle deine ersten Snacks aus.";

            }

            else if (missing > 0) {

                status.textContent =

                    `Noch ${missing} ` +

                    `${
                        missing === 1
                            ? "Snack"
                            : "Snacks"
                    } ` +

                    `bis deine Wunschbox voll ist.`;

            }

            else {

                status.textContent =
                    "Deine Wunschbox ist komplett. 😎";

            }


            if (!current) {

                summary.textContent =
                    "Noch keine Snacks ausgewählt.";

            }

            else {

                summary.textContent =

                    [...grouped.entries()]

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


            const complete =
                current ===
                B.config.wishBoxSize;


            addWishBox.disabled =
                !complete;


            addWishBox.textContent =
                complete

                    ? "Wunschbox in den Warenkorb"

                    : (
                        `Erst ${missing} ` +

                        `${
                            missing === 1
                                ? "Snack"
                                : "Snacks"
                        } auswählen`
                    );


            document
                .querySelectorAll(
                    "[data-builder-category]"
                )
                .forEach(
                    button => {

                        button.classList.toggle(

                            "active",

                            button.dataset
                                .builderCategory ===
                                category

                        );

                    }
                );

        }


        /* =================================================
           SNACK HINZUFÜGEN
        ================================================= */

        function addSelection(id) {

            const p =
                B.product(id);


            if (
                !p ||
                !p.builder
            ) {

                return;

            }


            const selected =
                selection();


            if (
                selected.length >=
                B.config.wishBoxSize
            ) {

                message(
                    "Deine Wunschbox ist bereits voll."
                );

                return;

            }


            selected.push(
                p.id
            );


            B.saveWishSelection(
                selected
            );

        }


        /* =================================================
           SNACK ENTFERNEN
        ================================================= */

        function removeSelection(id) {

            const selected =
                selection();


            const index =
                selected.lastIndexOf(
                    Number(id)
                );


            if (index === -1) {

                return;

            }


            selected.splice(
                index,
                1
            );


            B.saveWishSelection(
                selected
            );

        }


        /* =================================================
           KLICKS
        ================================================= */

        document.addEventListener(
            "click",
            event => {

                const fixedBox =
                    event.target.closest(
                        ".add-fixed-box"
                    );


                const plus =
                    event.target.closest(
                        "[data-builder-plus]"
                    );


                const minus =
                    event.target.closest(
                        "[data-builder-minus]"
                    );


                const filter =
                    event.target.closest(
                        "[data-builder-category]"
                    );


                if (fixedBox) {

                    const id =
                        Number(
                            fixedBox.dataset.addId
                        );


                    if (
                        window.bodaAddToCart
                    ) {

                        window.bodaAddToCart(
                            id
                        );

                    }


                    return;

                }


                if (plus) {

                    addSelection(

                        Number(
                            plus.dataset.builderPlus
                        )

                    );


                    return;

                }


                if (minus) {

                    removeSelection(

                        Number(
                            minus.dataset.builderMinus
                        )

                    );


                    return;

                }


                if (filter) {

                    category =
                        filter.dataset
                            .builderCategory;


                    renderBuilder();

                }

            }
        );


        /* =================================================
           AUSWAHL LEEREN
        ================================================= */

        clearWishBox
            ?.addEventListener(
                "click",
                () => {

                    B.saveWishSelection(
                        []
                    );


                    const cart =
                        B.getCart()
                            .filter(
                                row => {

                                    return (
                                        row.id !==
                                        B.config
                                            .wishBoxProductId
                                    );

                                }
                            );


                    B.save(
                        cart
                    );


                    message(
                        "Wunschbox-Auswahl wurde geleert."
                    );

                }
            );


        /* =================================================
           WUNSCHBOX IN WARENKORB
        ================================================= */

        addWishBox
            ?.addEventListener(
                "click",
                () => {

                    if (
                        !B.wishSelectionIsComplete()
                    ) {

                        return;

                    }


                    const cart =
                        B.getCart()
                            .filter(
                                row => {

                                    return (
                                        row.id !==
                                        B.config
                                            .wishBoxProductId
                                    );

                                }
                            );


                    cart.push({

                        id:
                            B.config
                                .wishBoxProductId,

                        quantity:
                            1

                    });


                    B.save(
                        cart
                    );


                    message(
                        "Deine Wunschbox ist im Warenkorb. 😎"
                    );

                }
            );


        /* =================================================
           ÄNDERUNGEN
        ================================================= */

        window.addEventListener(
            "boda:wishchange",
            renderBuilder
        );


        /* =================================================
           START
        ================================================= */

        renderBuilder();

    }
);
