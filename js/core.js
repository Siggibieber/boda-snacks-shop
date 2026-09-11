/* =========================================================
   BODA SNACKS SHOP
   Gemeinsame Warenkorb- und Preislogik

   Alle Berechnungen erfolgen in ganzen Cent.
   Diese Datei gehört zur Testversion.
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       GEMEINSAME EINSTELLUNGEN
    ===================================================== */

    const config = Object.freeze({
        storageKey: "bodaShopCart",

        minimumCents: 2500,
        freeShippingCents: 4900,
        shippingCents: 499,

        maxQuantity: 99
    });


    /* =====================================================
       PREISE FORMATIEREN
    ===================================================== */

    const money = cents => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(cents / 100);
    };


    /* =====================================================
       PRODUKT FINDEN
    ===================================================== */

    const product = id => {
        return BODA_PRODUCTS.find(
            item => item.id === Number(id)
        );
    };


    /* =====================================================
       TEXTE FÜR HTML MASKIEREN
    ===================================================== */

    const escape = value => {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return String(value ?? "").replace(
            /[&<>"']/g,
            character => replacements[character]
        );
    };


    /* =====================================================
       WARENKORB PRÜFEN UND BEREINIGEN
    ===================================================== */

    function normalize(value) {
        if (!Array.isArray(value)) {
            return [];
        }

        const merged = new Map();

        for (const row of value) {
            if (
                !row ||
                !Number.isInteger(row.id) ||
                !product(row.id) ||
                !Number.isSafeInteger(row.quantity) ||
                row.quantity <= 0
            ) {
                continue;
            }

            const previousQuantity =
                merged.get(row.id) || 0;

            const quantity = Math.min(
                config.maxQuantity,
                previousQuantity + row.quantity
            );

            merged.set(row.id, quantity);
        }

        return [...merged].map(([id, quantity]) => ({
            id,
            quantity
        }));
    }


    /* =====================================================
       WARENKORB LADEN
    ===================================================== */

    let persistenceOK = true;

    function read() {
        try {
            const saved =
                localStorage.getItem(config.storageKey);

            return normalize(
                JSON.parse(saved || "[]")
            );
        } catch {
            return [];
        }
    }

    let cart = read();


    /* =====================================================
       WARENKORB SPEICHERN
    ===================================================== */

    function save(value) {
        cart = normalize(value);

        try {
            localStorage.setItem(
                config.storageKey,
                JSON.stringify(cart)
            );

            persistenceOK = true;
        } catch {
            persistenceOK = false;
        }

        window.dispatchEvent(
            new CustomEvent("boda:cartchange")
        );

        return persistenceOK;
    }


    /* =====================================================
       SUMMEN BERECHNEN
    ===================================================== */

    function totals(value = cart) {
        const rows = normalize(value);

        const subtotal = rows.reduce((sum, row) => {
            const currentProduct = product(row.id);

            const unitPriceCents = Math.round(
                currentProduct.price * 100
            );

            return sum + unitPriceCents * row.quantity;
        }, 0);

        const shipping =
            subtotal > 0 &&
            subtotal < config.freeShippingCents
                ? config.shippingCents
                : 0;

        /*
         * Unbekanntes Pfand ist nicht gleich pfandfrei.
         * Deshalb wird zusätzlich ein Hinweis ausgegeben.
         */

        const unknownDeposit = rows.some(row => {
            return product(row.id).depositCents == null;
        });

        const deposit = rows.reduce((sum, row) => {
            const depositCents =
                product(row.id).depositCents || 0;

            return sum + depositCents * row.quantity;
        }, 0);

        const count = rows.reduce((sum, row) => {
            return sum + row.quantity;
        }, 0);

        return {
            subtotal,
            shipping,
            deposit,
            unknownDeposit,

            total: subtotal + shipping + deposit,

            count,

            missing: Math.max(
                0,
                config.minimumCents - subtotal
            )
        };
    }


    /* =====================================================
       GRUNDPREIS BERECHNEN
    ===================================================== */

    function basePrice(currentProduct) {
        if (
            !(currentProduct.netQuantity > 0) ||
            !["g", "ml"].includes(
                currentProduct.quantityUnit
            )
        ) {
            return "";
        }

        const basePriceCents = Math.round(
            currentProduct.price *
            100 *
            1000 /
            currentProduct.netQuantity
        );

        const unit =
            currentProduct.quantityUnit === "g"
                ? "kg"
                : "l";

        return `${money(basePriceCents)} / ${unit}`;
    }


    /* =====================================================
       PRODUKTBILD ODER MUSTERABBILDUNG
    ===================================================== */

    function artwork(
        currentProduct,
        className = "mini-pack"
    ) {
        const allowedImagePath =
            /^(https?:\/\/|\.?\.?\/|[a-zA-Z0-9_-]+\/)/;

        if (
            currentProduct.image &&
            allowedImagePath.test(currentProduct.image)
        ) {
            return `
                <img
                    src="${escape(currentProduct.image)}"
                    alt="${escape(currentProduct.name)}"
                    loading="lazy"
                >
            `;
        }

        const validColor = /^#[0-9a-f]{6}$/i;

        const color = validColor.test(currentProduct.color)
            ? currentProduct.color
            : "#20383b";

        const ink = validColor.test(currentProduct.textColor)
            ? currentProduct.textColor
            : "#ffffff";

        return `
            <div
                class="${escape(className)}"
                style="--c:${color};--t:${ink}"
                aria-hidden="true"
            >
                <span>MUSTER</span>
                <strong>
                    ${escape(currentProduct.packText)}
                </strong>
            </div>
        `;
    }


    /* =====================================================
       EINHEITLICHER KONDITIONENHINWEIS
    ===================================================== */

    const conditions = () => {
        return (
            `Demo-Konditionen: ` +
            `${money(config.minimumCents)} Mindestwarenwert · ` +
            `${money(config.shippingCents)} Versand · ` +
            `ab ${money(config.freeShippingCents)} ` +
            `Warenwert versandfrei.`
        );
    };


    /* =====================================================
       FUNKTIONEN FÜR SHOP UND KASSE BEREITSTELLEN
    ===================================================== */

    window.Boda = Object.freeze({
        config,

        money,
        product,
        escape,

        normalize,
        totals,
        basePrice,
        artwork,

        conditions,
        read,
        save,

        getCart: () => {
            return cart.map(row => ({
                ...row
            }));
        },

        canPersist: () => persistenceOK
    });


    /* =====================================================
       ÄNDERUNGEN AUS ANDEREN BROWSER-TABS ÜBERNEHMEN
    ===================================================== */

    window.addEventListener("storage", event => {
        if (
            event.key === config.storageKey ||
            event.key === null
        ) {
            cart = read();

            window.dispatchEvent(
                new CustomEvent("boda:cartchange")
            );
        }
    });


    /* =====================================================
       KONDITIONEN AUF DER SEITE ANZEIGEN
    ===================================================== */

    document.addEventListener("DOMContentLoaded", () => {
        document
            .querySelectorAll("[data-shop-conditions]")
            .forEach(element => {
                element.textContent = conditions();
            });
    });

})();
