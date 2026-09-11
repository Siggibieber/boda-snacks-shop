/* =========================================================
   BODA SNACKS SHOP
   Zentrale Produktdaten – Testversion

   price: Preis in Euro
   netQuantity: Nettomenge in Gramm oder Millilitern
   quantityUnit: "g" oder "ml"
   depositCents: Pfand in Cent; null = noch unbekannt

   Fehlende Lebensmittelangaben bleiben ausdrücklich offen.
========================================================= */

const BODA_PRODUCTS = [

    /* =====================================================
       CHIPS & SALZIGES
    ===================================================== */

    {
        id: 1,
        name: "Chips Paprika",
        brand: "BODA Auswahl",
        category: "salzig",
        price: 2.49,
        size: "150 g",
        image: "",
        color: "#df5b63",
        textColor: "#ffffff",
        packText: "PAPRIKA",
        badge: "",
        demo: true,
        netQuantity: 150,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 2,
        name: "Chips Gesalzen",
        brand: "BODA Auswahl",
        category: "salzig",
        price: 2.39,
        size: "150 g",
        image: "",
        color: "#e5bd4b",
        textColor: "#20383b",
        packText: "SALTED",
        badge: "",
        demo: true,
        netQuantity: 150,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 3,
        name: "Salzstangen",
        brand: "BODA Auswahl",
        category: "salzig",
        price: 1.79,
        size: "250 g",
        image: "",
        color: "#168b87",
        textColor: "#ffffff",
        packText: "STICKS",
        badge: "",
        demo: true,
        netQuantity: 250,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 4,
        name: "Erdnüsse geröstet",
        brand: "BODA Auswahl",
        category: "salzig",
        price: 2.29,
        size: "200 g",
        image: "",
        color: "#c98752",
        textColor: "#ffffff",
        packText: "NUTS",
        badge: "",
        demo: true,
        netQuantity: 200,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       SÜSSIGKEITEN
    ===================================================== */

    {
        id: 5,
        name: "Fruchtgummi Mix",
        brand: "BODA Auswahl",
        category: "suess",
        price: 1.99,
        size: "175 g",
        image: "",
        color: "#e95e76",
        textColor: "#ffffff",
        packText: "SWEET",
        badge: "",
        demo: true,
        netQuantity: 175,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 6,
        name: "Saure Fruchtgummis",
        brand: "BODA Auswahl",
        category: "suess",
        price: 2.19,
        size: "175 g",
        image: "",
        color: "#70b96a",
        textColor: "#20383b",
        packText: "SOUR",
        badge: "",
        demo: true,
        netQuantity: 175,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       SCHOKOLADE
    ===================================================== */

    {
        id: 7,
        name: "Schoko Riegel",
        brand: "BODA Auswahl",
        category: "schokolade",
        price: 1.49,
        size: "50 g",
        image: "",
        color: "#714737",
        textColor: "#ffffff",
        packText: "CHOCO",
        badge: "",
        demo: true,
        netQuantity: 50,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 8,
        name: "Vollmilch Schokolade",
        brand: "BODA Auswahl",
        category: "schokolade",
        price: 2.29,
        size: "100 g",
        image: "",
        color: "#8a5a47",
        textColor: "#ffffff",
        packText: "MILK",
        badge: "",
        demo: true,
        netQuantity: 100,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       GETRÄNKE
    ===================================================== */

    {
        id: 9,
        name: "Cola",
        brand: "BODA Auswahl",
        category: "getraenke",
        price: 1.99,
        size: "0,5 l",
        image: "",
        color: "#292929",
        textColor: "#ffffff",
        packText: "COLA",
        badge: "",
        demo: true,
        netQuantity: 500,
        quantityUnit: "ml",
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 10,
        name: "Orangenlimonade",
        brand: "BODA Auswahl",
        category: "getraenke",
        price: 1.89,
        size: "0,5 l",
        image: "",
        color: "#ee973d",
        textColor: "#20383b",
        packText: "ORANGE",
        badge: "",
        demo: true,
        netQuantity: 500,
        quantityUnit: "ml",
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       ENERGY
    ===================================================== */

    {
        id: 11,
        name: "Energy Drink Classic",
        brand: "BODA Auswahl",
        category: "energy",
        price: 2.49,
        size: "250 ml",
        image: "",
        color: "#1c393c",
        textColor: "#ffffff",
        packText: "ENERGY",
        badge: "",
        demo: true,
        netQuantity: 250,
        quantityUnit: "ml",
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 12,
        name: "Energy Drink Zero",
        brand: "BODA Auswahl",
        category: "energy",
        price: 2.49,
        size: "250 ml",
        image: "",
        color: "#8fd5ce",
        textColor: "#20383b",
        packText: "ZERO",
        badge: "",
        demo: true,
        netQuantity: 250,
        quantityUnit: "ml",
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       SNACKBOXEN
    ===================================================== */

    {
        id: 13,
        name: "Movie Night Box",
        brand: "BODA Snacks",
        category: "boxen",
        price: 19.90,
        size: "1 Box",
        image: "",
        color: "#168b87",
        textColor: "#ffffff",
        packText: "MOVIE",
        badge: "",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 14,
        name: "Party Snack Box",
        brand: "BODA Snacks",
        category: "boxen",
        price: 29.90,
        size: "1 Box",
        image: "",
        color: "#df5b63",
        textColor: "#ffffff",
        packText: "PARTY",
        badge: "",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },

    {
        id: 15,
        name: "Büro Vorratsbox",
        brand: "BODA Snacks",
        category: "boxen",
        price: 34.90,
        size: "1 Box",
        image: "",
        color: "#d6ad3d",
        textColor: "#20383b",
        packText: "OFFICE",
        badge: "",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    },


    /* =====================================================
       SNACK-MIX
       Interner Kategoriename bleibt "angebote".
    ===================================================== */

    {
        id: 16,
        name: "Snack Mix",
        brand: "BODA Snacks",
        category: "angebote",
        price: 9.90,
        size: "5 Artikel",
        image: "",
        color: "#dc5e65",
        textColor: "#ffffff",
        packText: "MIX",
        badge: "",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: null,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null,
        contents: null
    }

];
