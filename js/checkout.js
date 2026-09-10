/* =========================================================
   BODA SNACKS SHOP
   Demo Checkout
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       EINSTELLUNGEN
    ===================================================== */

    const STORAGE_KEY = "bodaShopCart";

    const MINIMUM_ORDER = 25.00;
    const FREE_SHIPPING_FROM = 49.00;
    const SHIPPING_COST = 4.99;


    /* =====================================================
       ELEMENTE
    ===================================================== */

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutShipping =
        document.getElementById("checkoutShipping");

    const checkoutShippingLabel =
        document.getElementById("checkoutShippingLabel");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const checkoutWarning =
        document.getElementById("checkoutWarning");

    const placeOrderButton =
        document.getElementById("placeOrderButton");


    /* =====================================================
       WARENKORB LADEN
    ===================================================== */

    let cart = loadCart();


    function loadCart() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return [];
            }


            const parsed =
                JSON.parse(saved);


            if (!Array.isArray(parsed)) {
                return [];
            }


            return parsed.filter(item => {

                return (
                    Number.isInteger(item.id)
                    &&
                    Number.isInteger(item.quantity)
                    &&
                    item.quantity > 0
                );

            });

        }

        catch (error) {

            console.warn(
                "Warenkorb konnte nicht geladen werden.",
                error
            );

            return [];

        }

    }


    /* =====================================================
       PREIS FORMATIEREN
    ===================================================== */

    function formatPrice(price) {

        return new Intl.NumberFormat(
            "de-DE",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(price);

    }


    /* =====================================================
       PRODUKT FINDEN
    ===================================================== */

    function getProduct(productId) {

        return BODA_PRODUCTS.find(
            product =>
                product.id === Number(productId)
        );

    }


    /* =====================================================
       WARENWERT
    ===================================================== */

    function calculateSubtotal() {

        return cart.reduce(
            (sum, item) => {

                const product =
                    getProduct(item.id);


                if (!product) {
                    return sum;
                }


                return (
                    sum
                    +
                    (
                        product.price
                        *
                        item.quantity
                    )
                );

            },
            0
        );

    }


    /* =====================================================
       VERSAND
    ===================================================== */

    function calculateShipping(subtotal) {

        if (subtotal <= 0) {
            return 0;
        }


        if (
            subtotal >= FREE_SHIPPING_FROM
        ) {

            return 0;

        }


        return SHIPPING_COST;

    }


    /* =====================================================
       EIN PRODUKT IN DER BESTELLÜBERSICHT
    ===================================================== */

    function createCheckoutItem(item) {

        const product =
            getProduct(item.id);


        if (!product) {
            return "";
        }


        const total =
            product.price
            *
            item.quantity;


        return `
            <div class="checkout-item">

                <div class="checkout-item-image">

                    ${
                        product.image

                        ? `
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >
                        `

                        : `
                            <div
                                class="checkout-mini-pack"
                                style="
                                    background: ${product.color};
                                    color: ${product.textColor};
                                "
                            >
                                ${product.packText}
                            </div>
                        `
                    }

                </div>


                <div class="checkout-item-info">

                    <strong>
                        ${product.name}
                    </strong>

                    <small>
                        ${product.size}
                    </small>

                    <span>
                        ${item.quantity}
                        ×
                        ${formatPrice(product.price)}
                    </span>

                </div>


                <strong class="checkout-item-total">

                    ${formatPrice(total)}

                </strong>

            </div>
        `;

    }


    /* =====================================================
       CHECKOUT ANZEIGEN
    ===================================================== */

    function renderCheckout() {

        /*
         * Produkte entfernen,
         * die es nicht mehr gibt.
         */

        cart =
            cart.filter(
                item =>
                    getProduct(item.id)
            );


        const subtotal =
            calculateSubtotal();


        const shipping =
            calculateShipping(subtotal);


        const total =
            subtotal + shipping;


        /* =================================================
           LEERER WARENKORB
        ================================================= */

        if (cart.length === 0) {

            checkoutItems.innerHTML = `
                <div class="checkout-empty">

                    <strong>
                        Dein Warenkorb ist leer.
                    </strong>

                    <p>
                        Geh zurück zum Shop und such dir
                        ein paar Snacks aus.
                    </p>

                    <a
                        href="index.html"
                        class="btn btn-primary"
                    >
                        Zum Shop
                    </a>

                </div>
            `;


            checkoutSubtotal.textContent =
                formatPrice(0);


            checkoutShipping.textContent =
                formatPrice(0);


            checkoutTotal.textContent =
                formatPrice(0);


            checkoutShippingLabel.textContent =
                formatPrice(0);


            placeOrderButton.disabled = true;


            checkoutWarning.innerHTML = `
                Dein Warenkorb ist leer.
            `;


            return;

        }


        /* =================================================
           PRODUKTE
        ================================================= */

        checkoutItems.innerHTML =
            cart
                .map(createCheckoutItem)
                .join("");


        /* =================================================
           SUMMEN
        ================================================= */

        checkoutSubtotal.textContent =
            formatPrice(subtotal);


        if (
            shipping === 0
            &&
            subtotal > 0
        ) {

            checkoutShipping.textContent =
                "Kostenlos";


            checkoutShippingLabel.textContent =
                "Kostenlos";

        } else {

            checkoutShipping.textContent =
                formatPrice(shipping);


            checkoutShippingLabel.textContent =
                formatPrice(shipping);

        }


        checkoutTotal.textContent =
            formatPrice(total);


        /* =================================================
           MINDESTBESTELLWERT
        ================================================= */

        if (
            subtotal < MINIMUM_ORDER
        ) {

            const missing =
                MINIMUM_ORDER - subtotal;


            checkoutWarning.innerHTML = `
                Mindestbestellwert noch nicht erreicht.
                Es fehlen noch
                <strong>
                    ${formatPrice(missing)}
                </strong>.
            `;


            placeOrderButton.disabled =
                true;

        } else {

            checkoutWarning.innerHTML = "";


            placeOrderButton.disabled =
                false;

        }

    }


    /* =====================================================
       AUSWAHLKARTEN
    ===================================================== */

    document
        .querySelectorAll(".selection-card")
        .forEach(card => {

            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            if (!radio) {
                return;
            }


            radio.addEventListener(
                "change",
                () => {

                    const name =
                        radio.name;


                    document
                        .querySelectorAll(
                            `input[name="${name}"]`
                        )
                        .forEach(otherRadio => {

                            const otherCard =
                                otherRadio.closest(
                                    ".selection-card"
                                );


                            if (otherCard) {

                                otherCard.classList.toggle(
                                    "active",
                                    otherRadio.checked
                                );

                            }

                        });

                }
            );

        });


    /* =====================================================
       E-MAIL PRÜFEN
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =====================================================
       FORMULAR PRÜFEN
    ===================================================== */

    function validateCheckout() {

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const firstname =
            document
                .getElementById("firstname")
                .value
                .trim();


        const lastname =
            document
                .getElementById("lastname")
                .value
                .trim();


        const street =
            document
                .getElementById("street")
                .value
                .trim();


        const houseNumber =
            document
                .getElementById("houseNumber")
                .value
                .trim();


        const zip =
            document
                .getElementById("zip")
                .value
                .trim();


        const city =
            document
                .getElementById("city")
                .value
                .trim();


        const terms =
            document
                .getElementById("terms")
                .checked;


        const privacy =
            document
                .getElementById("privacy")
                .checked;


        if (!email) {

            return {
                valid: false,
                message:
                    "Bitte gib deine E-Mail-Adresse ein.",
                field: "email"
            };

        }


        if (!isValidEmail(email)) {

            return {
                valid: false,
                message:
                    "Bitte gib eine gültige E-Mail-Adresse ein.",
                field: "email"
            };

        }


        if (!firstname) {

            return {
                valid: false,
                message:
                    "Bitte gib deinen Vornamen ein.",
                field: "firstname"
            };

        }


        if (!lastname) {

            return {
                valid: false,
                message:
                    "Bitte gib deinen Nachnamen ein.",
                field: "lastname"
            };

        }


        if (!street) {

            return {
                valid: false,
                message:
                    "Bitte gib deine Straße ein.",
                field: "street"
            };

        }


        if (!houseNumber) {

            return {
                valid: false,
                message:
                    "Bitte gib deine Hausnummer ein.",
                field: "houseNumber"
            };

        }


        if (!/^\d{5}$/.test(zip)) {

            return {
                valid: false,
                message:
                    "Bitte gib eine gültige fünfstellige PLZ ein.",
                field: "zip"
            };

        }


        if (!city) {

            return {
                valid: false,
                message:
                    "Bitte gib deinen Ort ein.",
                field: "city"
            };

        }


        if (!terms) {

            return {
                valid: false,
                message:
                    "Bitte bestätige den Hinweis zur Testversion.",
                field: "terms"
            };

        }


        if (!privacy) {

            return {
                valid: false,
                message:
                    "Bitte bestätige den Datenschutzhinweis.",
                field: "privacy"
            };

        }


        return {
            valid: true
        };

    }


    /* =====================================================
       TESTBESTELLUNG
    ===================================================== */

    placeOrderButton.addEventListener(
        "click",
        () => {

            const subtotal =
                calculateSubtotal();


            /*
             * Noch einmal prüfen,
             * damit die Kasse nicht umgangen wird.
             */

            if (
                subtotal < MINIMUM_ORDER
            ) {

                checkoutWarning.innerHTML = `
                    Der Mindestbestellwert beträgt
                    <strong>
                        ${formatPrice(MINIMUM_ORDER)}
                    </strong>.
                `;

                return;

            }


            const validation =
                validateCheckout();


            if (!validation.valid) {

                checkoutWarning.textContent =
                    validation.message;


                const field =
                    document.getElementById(
                        validation.field
                    );


                if (field) {

                    field.focus();

                    field.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }


                return;

            }


            /* =================================================
               DEMO BESTELLNUMMER
            ================================================= */

            const orderNumber =
                "BODA-TEST-"
                +
                Date.now()
                    .toString()
                    .slice(-6);


            sessionStorage.setItem(
                "bodaDemoOrderNumber",
                orderNumber
            );


            /*
             * Warenkorb nach Testbestellung leeren.
             */

            localStorage.removeItem(
                STORAGE_KEY
            );


            localStorage.removeItem(
                "bodaCartSubtotal"
            );


            localStorage.removeItem(
                "bodaShipping"
            );


            localStorage.removeItem(
                "bodaCartTotal"
            );


            /*
             * Weiter zur Bestätigungsseite.
             */

            window.location.href =
                "danke.html";

        }
    );


    /* =====================================================
       START
    ===================================================== */

    renderCheckout();

});
