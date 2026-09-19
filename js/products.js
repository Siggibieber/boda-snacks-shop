/* =========================================================
   BODA SNACKS SHOP
   Zentrale Produktdaten – Boxen-Testversion

   WICHTIG:
   - Preise sind Testpreise.
   - Einzelne Snacks sind nur für die Wunschbox.
   - Pflichtangaben kommen vor dem echten Verkaufsstart.
========================================================= */

const BODA_PRODUCTS = [

    /* =====================================================
       SNACKS FÜR DIE WUNSCHBOX
    ===================================================== */

    {
        id: 1,
        name: "Chips Paprika",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 2.49,
        size: "150 g",
        image: "",
        color: "#df5b63",
        textColor: "#ffffff",
        packText: "PAPRIKA",
        demo: true,
        netQuantity: 150,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 2,
        name: "Chips Gesalzen",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 2.39,
        size: "150 g",
        image: "",
        color: "#e5bd4b",
        textColor: "#20383b",
        packText: "SALTED",
        demo: true,
        netQuantity: 150,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 3,
        name: "Salzstangen",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 1.79,
        size: "250 g",
        image: "",
        color: "#168b87",
        textColor: "#ffffff",
        packText: "STICKS",
        demo: true,
        netQuantity: 250,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 4,
        name: "Erdnüsse geröstet",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 2.29,
        size: "200 g",
        image: "",
        color: "#c98752",
        textColor: "#ffffff",
        packText: "NUTS",
        demo: true,
        netQuantity: 200,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 5,
        name: "Fruchtgummi Mix",
        brand: "BODA Auswahl",
        category: "suess",
        builder: true,
        price: 1.99,
        size: "175 g",
        image: "",
        color: "#e95e76",
        textColor: "#ffffff",
        packText: "SWEET",
        demo: true,
        netQuantity: 175,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 6,
        name: "Saure Fruchtgummis",
        brand: "BODA Auswahl",
        category: "suess",
        builder: true,
        price: 2.19,
        size: "175 g",
        image: "",
        color: "#70b96a",
        textColor: "#20383b",
        packText: "SOUR",
        demo: true,
        netQuantity: 175,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 7,
        name: "Schoko Riegel",
        brand: "BODA Auswahl",
        category: "schokolade",
        builder: true,
        price: 1.49,
        size: "50 g",
        image: "",
        color: "#714737",
        textColor: "#ffffff",
        packText: "CHOCO",
        demo: true,
        netQuantity: 50,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 8,
        name: "Vollmilch Schokolade",
        brand: "BODA Auswahl",
        category: "schokolade",
        builder: true,
        price: 2.29,
        size: "100 g",
        image: "",
        color: "#8a5a47",
        textColor: "#ffffff",
        packText: "MILK",
        demo: true,
        netQuantity: 100,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 9,
        name: "Butterkekse",
        brand: "BODA Auswahl",
        category: "suess",
        builder: true,
        price: 1.99,
        size: "200 g",
        image: "",
        color: "#d7ae66",
        textColor: "#20383b",
        packText: "COOKIES",
        demo: true,
        netQuantity: 200,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 10,
        name: "Waffel Snack",
        brand: "BODA Auswahl",
        category: "suess",
        builder: true,
        price: 1.79,
        size: "100 g",
        image: "",
        color: "#e6c6a0",
        textColor: "#20383b",
        packText: "WAFER",
        demo: true,
        netQuantity: 100,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 11,
        name: "Popcorn",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 1.99,
        size: "100 g",
        image: "",
        color: "#f0cf64",
        textColor: "#20383b",
        packText: "POPCORN",
        demo: true,
        netQuantity: 100,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },

    {
        id: 12,
        name: "Cracker",
        brand: "BODA Auswahl",
        category: "salzig",
        builder: true,
        price: 1.89,
        size: "150 g",
        image: "",
        color: "#dcae72",
        textColor: "#20383b",
        packText: "CRACKER",
        demo: true,
        netQuantity: 150,
        quantityUnit: "g",
        depositCents: 0,
        ingredients: null,
        allergens: null,
        nutrition: null,
        foodOperator: null
    },


    /* =====================================================
       DIE DREI BODA BOXEN
    ===================================================== */

    {
        id: 13,
        name: "BODA Mix Box",
        brand: "BODA Snacks",
        category: "boxen",
        builder: false,
        price: 24.90,
        size: "1 Box",
        image: "",
        color: "#168b87",
        textColor: "#ffffff",
        packText: "MIX",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: 0,
        description:
            "Gemischte Snackbox aus süßen und salzigen Artikeln. Zusammenstellung kann variieren."
    },

    {
        id: 14,
        name: "BODA Wunschbox",
        brand: "BODA Snacks",
        category: "boxen",
        builder: false,
        price: 29.90,
        size: "10 Snacks",
        image: "",
        color: "#d6ad3d",
        textColor: "#20383b",
        packText: "WUNSCH",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: 0,
        description:
            "10 Snacks aus der verfügbaren Wunschbox-Auswahl selbst zusammenstellen."
    },

    {
        id: 15,
        name: "BODA Büro Box",
        brand: "BODA Snacks",
        category: "boxen",
        builder: false,
        price: 39.90,
        size: "1 große Box",
        image: "",
        color: "#20383b",
        textColor: "#ffffff",
        packText: "OFFICE",
        demo: true,
        netQuantity: null,
        quantityUnit: null,
        depositCents: 0,
        description:
            "Größere gemischte Box für Büro, Aufenthaltsraum oder Team."
    }

];
