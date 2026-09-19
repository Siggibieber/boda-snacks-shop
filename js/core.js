/* =========================================================
   BODA SNACKS SHOP
   Warenkorb-, Wunschbox- und Preislogik
========================================================= */

(() => {

    "use strict";


    const config = Object.freeze({

        storageKey:
            "bodaShopCart",

        wishStorageKey:
            "bodaWishBoxSelection",

        minimumCents:
            2500,

        freeShippingCents:
            4900,

        shippingCents:
            499,

        maxQuantity:
            20,

        wishBoxProductId:
            14,

        wishBoxSize:
            10

    });


    /* =====================================================
       GELD FORMATIEREN
    ===================================================== */

    const money = cents => {

        return new Intl.NumberFormat(
            "de-DE",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(
            cents / 100
        );

    };


    /* =====================================================
       PRODUKT FINDEN
    ===================================================== */

    const product = id => {

        return BODA_PRODUCTS.find(
            item =>
                item.id === Number(id)
        );

    };


    /* =====================================================
       HTML SICHER AUSGEBEN
    ===================================================== */

    const escape = value => {

        const replacements = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        };


        return String(
            value ?? ""
        ).replace(

            /[&<>"']/g,

            character =>
                replacements[character]

        );

    };


    /* =====================================================
       WARENKORB NORMALISIEREN
    ===================================================== */

    function normalize(value) {

        if (!Array.isArray(value)) {

            return [];

        }


        const merged =
            new Map();


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


            const maxForProduct =
                row.id ===
                config.wishBoxProductId

                    ? 1
                    : config.maxQuantity;


            const quantity =
                Math.min(

                    maxForProduct,

                    previousQuantity +
                    row.quantity

                );


            merged.set(
                row.id,
                quantity
            );

        }


        return [...merged]
            .map(
                ([id, quantity]) => ({
                    id,
                    quantity
                })
            );

    }


    /* =====================================================
       WARENKORB LADEN
    ===================================================== */

    let persistenceOK = true;


    function read() {

        try {

            const saved =
                localStorage.getItem(
                    config.storageKey
                );


            return normalize(

                JSON.parse(
                    saved || "[]"
                )

            );

        }

        catch {

            return [];

        }

    }


    let cart =
        read();


    /* =====================================================
       WARENKORB SPEICHERN
    ===================================================== */

    function save(value) {

        cart =
            normalize(value);


        try {

            localStorage.setItem(

                config.storageKey,

                JSON.stringify(
                    cart
                )

            );


            persistenceOK = true;

        }

        catch {

            persistenceOK = false;

        }


        window.dispatchEvent(

            new CustomEvent(
                "boda:cartchange"
            )

        );


        return persistenceOK;

    }


    /* =====================================================
       WUNSCHBOX AUSWAHL NORMALISIEREN
    ===================================================== */

    function normalizeWishSelection(value) {

        if (!Array.isArray(value)) {

            return [];

        }


        return value

            .map(Number)

            .filter(id => {

                const p =
                    product(id);


                return Boolean(
                    p &&
                    p.builder
                );

            })

            .slice(
                0,
                config.wishBoxSize
            );

    }


    /* =====================================================
       WUNSCHBOX LADEN
    ===================================================== */

    function readWishSelection() {

        try {

            return normalizeWishSelection(

                JSON.parse(

                    localStorage.getItem(
                        config.wishStorageKey
                    ) || "[]"

                )

            );

        }

        catch {

            return [];

        }

    }


    /* =====================================================
       WUNSCHBOX SPEICHERN
    ===================================================== */

    function saveWishSelection(value) {

        const normalized =
            normalizeWishSelection(
                value
            );


        try {

            localStorage.setItem(

                config.wishStorageKey,

                JSON.stringify(
                    normalized
                )

            );


            persistenceOK = true;

        }

        catch {

            persistenceOK = false;

        }


        window.dispatchEvent(

            new CustomEvent(
                "boda:wishchange"
            )

        );


        return normalized;

    }


    /* =====================================================
       IST WUNSCHBOX KOMPLETT?
    ===================================================== */

    function wishSelectionIsComplete() {

        return (
            readWishSelection().length ===
            config.wishBoxSize
        );

    }


    /* =====================================================
       SUMMEN BERECHNEN
    ===================================================== */

    function totals(value = cart) {

        const rows =
            normalize(value);


        const subtotal =
            rows.reduce(
                (sum, row) => {

                    const currentProduct =
                        product(row.id);


                    const unitPriceCents =
                        Math.round(
                            currentProduct.price *
                            100
                        );


                    return (
                        sum +
                        unitPriceCents *
                        row.quantity
                    );

                },
                0
            );


        const shipping =

            subtotal > 0 &&
            subtotal <
                config.freeShippingCents

                ? config.shippingCents
                : 0;


        const deposit =
            rows.reduce(
                (sum, row) => {

                    const depositCents =
                        product(row.id)
                            .depositCents || 0;


                    return (
                        sum +
                        depositCents *
                        row.quantity
                    );

                },
                0
            );


        const count =
            rows.reduce(
                (sum, row) =>
                    sum + row.quantity,
                0
            );


        return {

            subtotal,

            shipping,

            deposit,

            total:
                subtotal +
                shipping +
                deposit,

            count,

            missing:
                Math.max(
                    0,
                    config.minimumCents -
                    subtotal
                )

        };

    }


    /* =====================================================
       PRODUKTBILD / PLATZHALTER
    ===================================================== */

    function artwork(
        currentProduct,
        className = "mini-pack"
    ) {

        const allowedImagePath =
            /^(https?:\/\/|\.?\.?\/|[a-zA-Z0-9_-]+\/)/;


        if (
            currentProduct.image &&
            allowedImagePath.test(
                currentProduct.image
            )
        ) {

            return `
                <img
                    src="${escape(currentProduct.image)}"
                    alt="${escape(currentProduct.name)}"
                    loading="lazy"
                >
            `;

        }


        const validColor =
            /^#[0-9a-f]{6}$/i;


        const color =
            validColor.test(
                currentProduct.color
            )

                ? currentProduct.color
                : "#20383b";


        const ink =
            validColor.test(
                currentProduct.textColor
            )

                ? currentProduct.textColor
                : "#ffffff";


        return `
            <div
                class="${escape(className)}"
                style="--c:${color};--t:${ink}"
                aria-hidden="true"
            >
                <span>BODA</span>

                <strong>
                    ${escape(currentProduct.packText)}
                </strong>
            </div>
        `;

    }


    /* =====================================================
       TEST-KONDITIONEN
    ===================================================== */

    const conditions = () => {

        return (

            `Test-Konditionen: ` +

            `${money(config.minimumCents)} Mindestwarenwert · ` +

            `${money(config.shippingCents)} Versand · ` +

            `ab ${money(config.freeShippingCents)} Warenwert versandfrei.`

        );

    };


    /* =====================================================
       GLOBAL BEREITSTELLEN
    ===================================================== */

    window.Boda =
        Object.freeze({

            config,

            money,

            product,

            escape,

            normalize,

            totals,

            artwork,

            conditions,

            read,

            save,


            getCart: () => {

                return cart.map(
                    row => ({
                        ...row
                    })
                );

            },


            readWishSelection,

            saveWishSelection,

            wishSelectionIsComplete,


            canPersist:
                () =>
                    persistenceOK

        });


    /* =====================================================
       ANDERE BROWSER-TABS
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                    config.storageKey ||
                event.key === null
            ) {

                cart =
                    read();


                window.dispatchEvent(

                    new CustomEvent(
                        "boda:cartchange"
                    )

                );

            }


            if (
                event.key ===
                    config.wishStorageKey ||
                event.key === null
            ) {

                window.dispatchEvent(

                    new CustomEvent(
                        "boda:wishchange"
                    )

                );

            }

        }
    );

})();
