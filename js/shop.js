/* =========================================================
   BODA SNACKS SHOP
   Produktanzeige, Suche, Kategorien und Produktdetails
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =====================================================
       GEMEINSAME FUNKTIONEN UND ELEMENTE
    ===================================================== */

    const B = window.Boda;

    const grid =
        document.getElementById("productGrid");

    if (!grid || !B) {
        return;
    }

    const search =
        document.getElementById("searchInput");

    const empty =
        document.getElementById("emptyProducts");

    const dialog =
        document.getElementById("productDialog");

    const detail =
        document.getElementById("productDetails");

    const categories = {
        alle: "Alle",
        salzig: "Chips & Salziges",
        suess: "Süßigkeiten",
        schokolade: "Schokolade",
        getraenke: "Getränke",
        energy: "Energy",
        boxen: "Snackboxen",
        angebote: "Snack-Mix"
    };

    let category = "alle";


    /* =====================================================
       SUCHTEXT VEREINHEITLICHEN
    ===================================================== */

    const normalizeText = value => {
        return value
            .toLocaleLowerCase("de")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ß/g, "ss");
    };


    /* =====================================================
       PRODUKTE ANZEIGEN
    ===================================================== */

    function render() {
        const query = normalizeText(
            search.value.trim()
        );

        const matches = BODA_PRODUCTS.filter(p => {
            const matchesCategory =
                category === "alle" ||
                p.category === category;

            const searchableText = normalizeText(
                `${p.name} ${p.size} ${categories[p.category]}`
            );

            return (
                matchesCategory &&
                searchableText.includes(query)
            );
        });

        grid.innerHTML = matches.map(p => {
            const price = B.money(
                Math.round(p.price * 100)
            );

            const basePrice =
                B.basePrice(p) ||
                "Zusammenstellung noch offen";

            const depositNotice =
                p.depositCents == null
                    ? `
                        <p class="product-note">
                            Pfandangabe noch offen
                        </p>
                    `
                    : "";

            return `
                <article class="product">

                    <div class="product-art">
                        ${B.artwork(p)}
                    </div>

                    <p class="product-meta">
                        Musterprodukt
                    </p>

                    <h3>
                        ${B.escape(p.name)}
                    </h3>

                    <p class="sub">
                        ${B.escape(p.size)}
                    </p>

                    <div class="price-row">

                        <strong class="price">
                            ${price}
                        </strong>

                        <span>
                            Testpreis
                        </span>

                    </div>

                    <p class="base-price">
                        ${basePrice}
                    </p>

                    ${depositNotice}

                    <button
                        class="product-detail-button"
                        type="button"
                        data-product-id="${p.id}"
                        aria-label="Details zu ${B.escape(p.name)}"
                    >
                        Produktdetails
                    </button>

                    <button
                        class="btn btn-primary add-product"
                        type="button"
                        data-add-id="${p.id}"
                        aria-label="${B.escape(p.name)} in den Testwarenkorb"
                    >
                        In den Testwarenkorb
                    </button>

                </article>
            `;
        }).join("");


        /* LEERZUSTAND */

        empty.hidden = matches.length !== 0;

        empty.style.display =
            matches.length ? "none" : "block";


        /* ANZAHL DER TREFFER */

        const resultLabel =
            matches.length === 1
                ? "Produkt"
                : "Produkte";

        document.getElementById(
            "productResultCount"
        ).textContent =
            `${matches.length} ${resultLabel} · ` +
            categories[category];


        /* AKTIVE KATEGORIE MARKIEREN */

        document
            .querySelectorAll("[data-category]")
            .forEach(element => {
                const active =
                    element.dataset.category === category;

                element.classList.toggle(
                    "active",
                    active
                );

                if (element.tagName === "BUTTON") {
                    element.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                }
            });
    }


    /* =====================================================
       PRODUKTDETAILS ÖFFNEN
    ===================================================== */

    function showProduct(id) {
        const p = B.product(id);

        if (!p) {
            return;
        }

        const price = Math.round(
            p.price * 100
        );

        const box = [
            "boxen",
            "angebote"
        ].includes(p.category);

        const basePrice = B.basePrice(p);

        const informationTitle =
            box
                ? "Was ist enthalten?"
                : "Lebensmittelinformationen";

        const informationText =
            box
                ? (
                    "Die einzelnen Artikel und Mengen sind " +
                    "noch nicht festgelegt. Es wird keine " +
                    "bestimmte Zusammenstellung zugesagt."
                )
                : (
                    "Die genaue Marke, Zutatenliste, " +
                    "hervorgehobenen Allergene, Nährwerte " +
                    "und Angaben zum verantwortlichen " +
                    "Lebensmittelunternehmen liegen noch " +
                    "nicht vor."
                );

        const energyNotice =
            p.category === "energy"
                ? `
                    <p>
                        Koffeingehalt und erforderliche
                        Warnhinweise müssen anhand des
                        tatsächlichen Produkts ergänzt werden.
                    </p>
                `
                : "";

        const depositNotice =
            p.depositCents == null
                ? `
                    <p>
                        Pfand: noch zu klären.
                        In der Demo-Summe ist kein
                        unbekanntes Pfand enthalten.
                    </p>
                `
                : "";

        const minimumNotice =
            price < B.config.minimumCents && box
                ? `
                    <p>
                        Für die Testübersicht fehlen mit
                        dieser Box allein noch
                        ${
                            B.money(
                                B.config.minimumCents - price
                            )
                        }
                        Warenwert.
                    </p>
                `
                : "";

        detail.innerHTML = `
            <p class="eyebrow">
                Musterprodukt · Nicht bestellbar
            </p>

            <h2 id="detailTitle">
                ${B.escape(p.name)}
            </h2>

            <p>
                ${B.escape(p.size)} ·

                <strong>
                    ${B.money(price)}
                </strong>

                Testpreis
            </p>

            ${
                basePrice
                    ? `<p>${basePrice}</p>`
                    : ""
            }

            <p>
                Die Abbildung ist ein Platzhalter.
                Dieses Produkt dient zum Ausprobieren
                des Shops.
            </p>

            <h3>
                ${informationTitle}
            </h3>

            <p>
                ${informationText}
            </p>

            <p>
                Diese Vorschau eignet sich nicht zur
                Beurteilung von Allergien oder
                Ernährungsanforderungen.
            </p>

            ${energyNotice}

            ${depositNotice}

            <p data-shop-conditions>
                ${B.escape(B.conditions())}
            </p>

            ${minimumNotice}

            <button
                class="btn btn-primary"
                type="button"
                data-add-id="${p.id}"
            >
                In den Testwarenkorb
            </button>
        `;

        dialog.showModal();
    }


    /* =====================================================
       KLICKS AUF KATEGORIEN UND PRODUKTE
    ===================================================== */

    document.addEventListener("click", event => {
        const filter = event.target.closest(
            "[data-category]"
        );

        const productButton = event.target.closest(
            "[data-product-id]"
        );

        const addButton = event.target.closest(
            "[data-add-id]"
        );


        /* KATEGORIE AUSWÄHLEN */

        if (
            filter &&
            Object.hasOwn(
                categories,
                filter.dataset.category
            )
        ) {
            event.preventDefault();

            category = filter.dataset.category;

            search.value = "";

            render();

            document
                .getElementById("sortiment")
                .scrollIntoView({
                    block: "start"
                });
        }


        /* PRODUKTDETAILS ANZEIGEN */

        else if (productButton) {
            showProduct(
                productButton.dataset.productId
            );
        }


        /* PRODUKT IN DEN TESTWARENKORB LEGEN */

        else if (
            addButton &&
            window.bodaAddToCart
        ) {
            if (dialog.open) {
                dialog.close();
            }

            window.bodaAddToCart(
                Number(addButton.dataset.addId)
            );
        }
    });


    /* =====================================================
       PRODUKTDETAILS SCHLIESSEN
    ===================================================== */

    document
        .getElementById("closeProduct")
        .addEventListener("click", () => {
            dialog.close();
        });


    /* =====================================================
       SUCHFORMULAR
    ===================================================== */

    document
        .getElementById("searchForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            category = "alle";

            render();

            document
                .getElementById("sortiment")
                .scrollIntoView({
                    block: "start"
                });
        });


    /* SUCHE BEREITS WÄHREND DER EINGABE */

    search.addEventListener("input", () => {
        category = "alle";

        render();
    });


    /* =====================================================
       START
    ===================================================== */

    render();

});
