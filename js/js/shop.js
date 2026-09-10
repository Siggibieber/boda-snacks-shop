/* =========================================================
   BODA SNACKS SHOP
   Shop-Logik
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const productGrid =
        document.getElementById("productGrid");

    const emptyProducts =
        document.getElementById("emptyProducts");

    const productResultCount =
        document.getElementById("productResultCount");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");

    const filterButtons =
        document.querySelectorAll(".filter");

    const navButtons =
        document.querySelectorAll(".nav-chip");

    const categoryCards =
        document.querySelectorAll(".category-card");

    const bundleButtons =
        document.querySelectorAll(
            ".bundle-body button[data-category]"
        );


    let currentCategory = "alle";
    let currentSearch = "";


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
       PRODUKTBILD
    ===================================================== */

    function createProductImage(product) {

        if (product.image) {

            return `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            `;

        }


        return `
            <div
                class="mini-pack"
                style="
                    --c: ${product.color};
                    --t: ${product.textColor};
                "
            >

                <span>
                    BODA SNACKS
                </span>

                <strong>
                    ${product.packText}
                </strong>

                <span>
                    ${product.size}
                </span>

            </div>
        `;

    }


    /* =====================================================
       PRODUKTKARTE
    ===================================================== */

    function createProductCard(product) {

        const badge =
            product.badge
                ? `
                    <div class="badge">
                        ${product.badge}
                    </div>
                `
                : "";


        const oldPrice =
            product.oldPrice
                ? `
                    <span style="
                        text-decoration: line-through;
                        color: #899997;
                        font-size: 12px;
                        margin-right: 5px;
                    ">
                        ${formatPrice(product.oldPrice)}
                    </span>
                `
                : "";


        return `
            <article
                class="product"
                data-product-id="${product.id}"
            >

                ${badge}

                <div class="product-art">

                    ${createProductImage(product)}

                </div>


                <div class="product-meta">

                    ${product.brand}

                </div>


                <h3>
                    ${product.name}
                </h3>


                <div class="sub">
                    ${product.size}
                </div>


                <div class="price-row">

                    <div>

                        ${oldPrice}

                        <span class="price">
                            ${formatPrice(product.price)}
                        </span>

                    </div>

                </div>


                <button
                    class="add-btn"
                    type="button"
                    data-add-product="${product.id}"
                >
                    In den Warenkorb
                </button>

            </article>
        `;

    }


    /* =====================================================
       PRODUKTE FILTERN
    ===================================================== */

    function getFilteredProducts() {

        return BODA_PRODUCTS.filter(product => {

            const categoryMatches =
                currentCategory === "alle"
                ||
                product.category === currentCategory;


            const searchableText = `
                ${product.name}
                ${product.brand}
                ${product.category}
                ${product.size}
                ${product.packText}
            `
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");


            const searchTerm =
                currentSearch
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");


            return (
                categoryMatches
                &&
                searchableText.includes(searchTerm)
            );

        });

    }


    /* =====================================================
       PRODUKTE ANZEIGEN
    ===================================================== */

    function renderProducts() {

        const products =
            getFilteredProducts();


        if (products.length === 1) {

            productResultCount.textContent =
                "1 Produkt gefunden";

        } else {

            productResultCount.textContent =
                `${products.length} Produkte gefunden`;

        }


        if (products.length === 0) {

            productGrid.innerHTML = "";

            emptyProducts.style.display =
                "block";

            return;

        }


        emptyProducts.style.display =
            "none";


        productGrid.innerHTML =
            products
                .map(createProductCard)
                .join("");


        /* Warenkorb Buttons */

        const addButtons =
            productGrid.querySelectorAll(
                "[data-add-product]"
            );


        addButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        Number(
                            button.dataset.addProduct
                        );


                    if (
                        typeof window.bodaAddToCart
                        === "function"
                    ) {

                        window.bodaAddToCart(
                            productId
                        );

                    }

                }
            );

        });

    }


    /* =====================================================
       AKTIVE BUTTONS
    ===================================================== */

    function updateActiveButtons() {

        filterButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category
                === currentCategory
            );

        });


        navButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category
                === currentCategory
            );

        });

    }


    /* =====================================================
       KATEGORIE AUSWÄHLEN
    ===================================================== */

    function selectCategory(category) {

        currentCategory =
            category;

        currentSearch =
            "";


        if (searchInput) {

            searchInput.value =
                "";

        }


        updateActiveButtons();

        renderProducts();

    }


    /* =====================================================
       ZUM SORTIMENT SCROLLEN
    ===================================================== */

    function scrollToProducts() {

        const assortment =
            document.getElementById(
                "sortiment"
            );


        if (assortment) {

            assortment.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =====================================================
       FILTER UNTEN
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectCategory(
                    button.dataset.category
                );

            }
        );

    });


    /* =====================================================
       FILTER OBEN
    ===================================================== */

    navButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectCategory(
                    button.dataset.category
                );

                scrollToProducts();

            }
        );

    });


    /* =====================================================
       KATEGORIEKARTEN
    ===================================================== */

    categoryCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                selectCategory(
                    card.dataset.category
                );

                scrollToProducts();

            }
        );

    });


    /* =====================================================
       SNACKBOXEN
    ===================================================== */

    bundleButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectCategory(
                    button.dataset.category
                );

                scrollToProducts();

            }
        );

    });


    /* =====================================================
       SUCHE
    ===================================================== */

    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                currentSearch =
                    searchInput.value.trim();

                currentCategory =
                    "alle";

                updateActiveButtons();

                renderProducts();

                scrollToProducts();

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    searchInput.value.trim();

                if (currentSearch.length > 0) {

                    currentCategory =
                        "alle";

                }

                updateActiveButtons();

                renderProducts();

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    updateActiveButtons();

    renderProducts();

});
