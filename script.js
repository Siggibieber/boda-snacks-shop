/* =======================================
   BODA Snacks Shop
   Version 1.0
======================================= */

let cart = JSON.parse(localStorage.getItem("boda-cart")) || [];

const cartCounter = document.querySelector(".cart-btn span");

updateCart();

document.querySelectorAll(".product-btn").forEach((button) => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        const card = this.closest(".product-card");

        const product = {

            name: card.querySelector("h3").innerText,

            price: card.querySelector(".price").innerText,

            image: card.querySelector("img").src

        };

        cart.push(product);

        localStorage.setItem("boda-cart", JSON.stringify(cart));

        updateCart();

        animateButton(this);

    });

});

function updateCart() {

    if (cartCounter) {

        cartCounter.innerText = cart.length;

    }

}

function animateButton(button) {

    button.innerHTML = "✓ Hinzugefügt";

    button.style.background = "#32b768";
    button.style.color = "#fff";

    setTimeout(() => {

        button.innerHTML = "In den Warenkorb";

        button.style.background = "";
        button.style.color = "";

    }, 1400);

}

/* =======================================
   Header beim Scrollen
======================================= */

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 60) {

        header.style.background = "rgba(9,9,9,.88)";

        header.style.padding = "15px 0";

    }

    else {

        header.style.background = "rgba(9,9,9,.45)";

        header.style.padding = "20px 0";

    }

});

/* =======================================
   Smooth Fade
======================================= */

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".category-card,.product-card").forEach((el)=>{

    observer.observe(el);

});
