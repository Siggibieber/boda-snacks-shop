/* =========================================================
   BODA SNACKS SHOP
   Warenkorb
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       EINSTELLUNGEN
    ===================================================== */

    const MINIMUM_ORDER = 25.00;
    const FREE_SHIPPING_FROM = 49.00;
    const SHIPPING_COST = 4.99;

    const STORAGE_KEY = "bodaShopCart";


    /* =====================================================
       ELEMENTE
    ===================================================== */

    const openCartButton =
        document.getElementById("openCart");

    const closeCartButton =
        document.getElementById("closeCart");

    const cartPanel =
        document.getElementById("cartPanel");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    const shippingCost =
        document.getElementById("shippingCost");

    const cartTotal =
        document.getElementById("cartTotal");

    const minimumText =
        document.getElementById("minimumText");

    const minimumProgress =
        document.getElementById("minimumProgress");

    const checkoutButton =
        document.getElementById("checkoutButton");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       WARENKORB LADEN
    ===================================================== */

    let cart = loadCart();


    function loadCart() {

        try {

            const savedCart =
                localStorage.getItem(STORAGE_KEY);

            if (!savedCart) {
                return [];
            }

            const parsed =
                JSON.parse(savedCart);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed;

        } catch (error) {

            console.warn(
                "Warenkorb konnte nicht geladen werden.",
                error
            );

            return [];

        }

    }


    /* =====================================================
       WARENKORB SPEICHERN
    ===================================================== */

    function saveCart() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
        );

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
       WARENKORB ÖFFNEN
    ===================================================== */

    function openCart() {

        cartPanel.classList.add("show");
        cartOverlay.classList.add("show");

        document.body.classList.add(
            "cart-open"
        );

    }


    /* =====================================================
       WARENKORB SCHLIESSEN
    ===================================================== */

    function closeCart() {

        cartPanel.classList.remove("show");
        cartOverlay.classList.remove("show");

        document.body.classList.remove(
            "cart-open"
        );

    }


    /* =====================================================
       PRODUKT HINZUFÜGEN
    ===================================================== */

    function addToCart(productId) {

        const product =
            getProduct(productId);

        if (!product) {
            return;
        }


        const existingItem =
            cart.find(
                item =>
                    item.id === product.id
            );


        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({
                id: product.id,
                quantity: 1
            });

        }


        saveCart();

        renderCart();

        showToast(
            `${product.name} wurde hinzugefügt.`
        );

    }


    /* =====================================================
       MENGE ÄNDERN
    ===================================================== */

    function changeQuantity(
        productId,
        change
    ) {

        const item =
            cart.find(
                cartItem =>
                    cartItem.id
                    ===
                    Number(productId)
            );


        if (!item) {
            return;
        }


        item.quantity += change;


        /*
         * Wenn Menge 0 erreicht,
         * Produkt entfernen.
         */

        if (item.quantity <= 0) {

            cart =
                cart.filter(
                    cartItem =>
                        cartItem.id
                        !==
                        Number(productId)
                );

        }


        saveCart();

        renderCart();

    }


    /* =====================================================
       PRODUKT ENTFERNEN
    ===================================================== */

    function removeFromCart(productId) {

        cart =
            cart.filter(
                item =>
                    item.id
                    !==
                    Number(productId)
            );


        saveCart();

        renderCart();

    }


    /* =====================================================
       WARENWERT BERECHNEN
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
                    product.price
                    *
                    item.quantity
                );

            },
            0
        );

    }


    /* =====================================================
       VERSAND BERECHNEN
    ===================================================== */

    function calculateShipping(
        subtotal
    ) {

        /*
         * Leerer Warenkorb
         */

        if (subtotal <= 0) {
            return 0;
        }


        /*
         * Kostenloser Versand
         */

        if (
            subtotal
            >=
            FREE_SHIPPING_FROM
        ) {

            return 0;

        }


        return SHIPPING_COST;

    }


    /* =====================================================
       ARTIKELANZAHL
    ===================================================== */

    function calculateItemCount() {

        return cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    }


    /* =====================================================
       WARENKORB PRODUKTBILD
    ===================================================== */

    function createCartImage(product) {

        if (product.image) {

            return `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            `;

        }


        return `
            <div
                style="
                    --c: ${product.color};
                "
            ></div>
        `;

    }


    /* =====================================================
       WARENKORB PRODUKT
    ===================================================== */

    function createCartItem(item) {

        const product =
            getProduct(item.id);


        if (!product) {
            return "";
        }


        const itemTotal =
            product.price
            *
            item.quantity;


        return `
            <div
                class="cart-item"
                data-cart-id="${product.id}"
            >

                <div class="cart-thumb">

                    ${createCartImage(product)}

                </div>


                <div>

                    <h4>
                        ${product.name}
                    </h4>


                    <div class="item-price">

                        ${formatPrice(product.price)}

                        ·

                        ${product.size}

                    </div>


                    <div class="qty">

                        <button
                            type="button"
                            data-action="minus"
                            data-id="${product.id}"
                            aria-label="Menge reduzieren"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            data-action="plus"
                            data-id="${product.id}"
                            aria-label="Menge erhöhen"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>


                    <button
                        class="remove"
                        type="button"
                        data-action="remove"
                        data-id="${product.id}"
                    >
                        Entfernen
                    </button>

                </div>

            </div>
        `;

    }


    /* =====================================================
       MINDESTBESTELLWERT
    ===================================================== */

    function updateMinimumOrder(
        subtotal
    ) {

        const missing =
            Math.max(
                0,
                MINIMUM_ORDER - subtotal
            );


        const percentage =
            Math.min(
                100,
                (
                    subtotal
                    /
                    MINIMUM_ORDER
                )
                *
                100
            );


        minimumProgress.style.width =
            `${percentage}%`;


        if (subtotal <= 0) {

            minimumText.textContent =
                `noch ${formatPrice(MINIMUM_ORDER)}`;

        }

        else if (missing > 0) {

            minimumText.textContent =
                `noch ${formatPrice(missing)}`;

        }

        else {

            minimumText.textContent =
                "erreicht ✓";

        }

    }


    /* =====================================================
       CHECKOUT BUTTON
    ===================================================== */

    function updateCheckoutButton(
        subtotal
    ) {

        if (
            subtotal
            >=
            MINIMUM_ORDER
        ) {

            checkoutButton.classList.remove(
                "disabled"
            );

            checkoutButton.textContent =
                "Zur Kasse";

            checkoutButton.setAttribute(
                "aria-disabled",
                "false"
            );

        } else {

            checkoutButton.classList.add(
                "disabled"
            );

            checkoutButton.textContent =
                "Mindestbestellwert noch nicht erreicht";

            checkoutButton.setAttribute(
                "aria-disabled",
                "true"
            );

        }

    }


    /* =====================================================
       WARENKORB RENDERN
    ===================================================== */

    function renderCart() {

        /*
         * Nicht mehr vorhandene Produkte
         * aus Warenkorb entfernen.
         */

        cart =
            cart.filter(
                item =>
                    getProduct(item.id)
                    &&
                    item.quantity > 0
            );


        saveCart();


        /* =================================================
           ARTIKELZAHL
        ================================================= */

        const itemCount =
            calculateItemCount();


        cartCount.textContent =
            itemCount;


        /* =================================================
           LEERER WARENKORB
        ================================================= */

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    <h3>
                        Dein Warenkorb ist leer
                    </h3>

                    <p>
                        Such dir ein paar Snacks aus.
                    </p>

                </div>
            `;

        } else {

            cartItems.innerHTML =
                cart
                    .map(createCartItem)
                    .join("");

        }


        /* =================================================
           SUMMEN
        ================================================= */

        const subtotal =
            calculateSubtotal();


        const shipping =
            calculateShipping(
                subtotal
            );


        const total =
            subtotal + shipping;


        cartSubtotal.textContent =
            formatPrice(subtotal);


        shippingCost.textContent =
            shipping === 0
            && subtotal > 0

                ? "Kostenlos"

                : formatPrice(shipping);


        cartTotal.textContent =
            formatPrice(total);


        /* =================================================
           MINDESTBESTELLWERT
        ================================================= */

        updateMinimumOrder(
            subtotal
        );


        /* =================================================
           CHECKOUT
        ================================================= */

        updateCheckoutButton(
            subtotal
        );


        /*
         * Warenkorbdaten für Checkout
         * zusätzlich speichern.
         */

        localStorage.setItem(
            "bodaCartSubtotal",
            subtotal.toFixed(2)
        );

        localStorage.setItem(
            "bodaShipping",
            shipping.toFixed(2)
        );

        localStorage.setItem(
            "bodaCartTotal",
            total.toFixed(2)
        );

    }


    /* =====================================================
       TOAST MELDUNG
    ===================================================== */

    let toastTimer;


    function showToast(message) {

        if (!toast) {
            return;
        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                1800
            );

    }


    /* =====================================================
       WARENKORB BUTTONS
    ===================================================== */

    openCartButton.addEventListener(
        "click",
        openCart
    );


    closeCartButton.addEventListener(
        "click",
        closeCart
    );


    cartOverlay.addEventListener(
        "click",
        closeCart
    );


    /* =====================================================
       ESC TASTE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCart();

            }

        }
    );


    /* =====================================================
       PLUS / MINUS / ENTFERNEN
    ===================================================== */

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const productId =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            if (action === "plus") {

                changeQuantity(
                    productId,
                    1
                );

            }


            if (action === "minus") {

                changeQuantity(
                    productId,
                    -1
                );

            }


            if (action === "remove") {

                removeFromCart(
                    productId
                );

            }

        }
    );


    /* =====================================================
       CHECKOUT SCHUTZ
    ===================================================== */

    checkoutButton.addEventListener(
        "click",
        event => {

            const subtotal =
                calculateSubtotal();


            if (
                subtotal
                <
                MINIMUM_ORDER
            ) {

                event.preventDefault();

                showToast(
                    `Mindestbestellwert: ${formatPrice(MINIMUM_ORDER)}`
                );

            }

        }
    );


    /* =====================================================
       FUNKTION FÜR shop.js FREIGEBEN
    ===================================================== */

    window.bodaAddToCart =
        addToCart;


    /* =====================================================
       ERSTER START
    ===================================================== */

    renderCart();

});
