/* =========================================
   BODA Snacks Shop
========================================= */

const cartButton = document.querySelector(".cart-btn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

let cart = JSON.parse(localStorage.getItem("boda-cart")) || [];

const cartCounter = document.querySelector(".cart-btn span");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

/* -------------------------------
   Warenkorb öffnen
-------------------------------- */

cartButton.addEventListener("click", () => {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

});

/* -------------------------------
   Warenkorb schließen
-------------------------------- */

closeCart.addEventListener("click", closeSidebar);

cartOverlay.addEventListener("click", closeSidebar);

function closeSidebar(){

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

}

/* -------------------------------
   Produkt hinzufügen
-------------------------------- */

document.querySelectorAll(".product-btn").forEach(button=>{

    button.addEventListener("click",(e)=>{

        e.preventDefault();

        const card = button.closest(".product-card");

        const product = {

            name:card.querySelector("h3").innerText,

            price:parseFloat(

                card.querySelector(".price")
                .innerText
                .replace("€","")
                .replace(",",".")
                .trim()

            ),

            image:card.querySelector("img").src

        };

        cart.push(product);

        saveCart();

        renderCart();

    });

});

/* -------------------------------
   Warenkorb anzeigen
-------------------------------- */

function renderCart(){

    cartCounter.innerText = cart.length;

    if(cart.length===0){

        cartItems.innerHTML=`

            <div class="empty-cart">

                <h3>Dein Warenkorb ist leer</h3>

                <p>Lege deine Lieblingssnacks hinein.</p>

            </div>

        `;

        cartTotal.innerText="0,00 €";

        return;

    }

    let html="";

    let total=0;

    cart.forEach((item,index)=>{

        total += item.price;

        html +=`

        <div class="cart-item">

            <img src="${item.image}">

            <div class="cart-info">

                <h4>${item.name}</h4>

                <div class="cart-price">

                    ${item.price.toFixed(2).replace(".",",")} €

                </div>

                <span class="remove-item"

                    onclick="removeItem(${index})">

                    Entfernen

                </span>

            </div>

        </div>

        `;

    });

    cartItems.innerHTML = html;

    cartTotal.innerText =

    total.toFixed(2).replace(".",",")+" €";

}
<div class="cart-item">

    <img src="${item.image}">

    <div class="cart-info">

        <h4>${item.name}</h4>

        <div class="cart-price">

            ${item.price.toFixed(2).replace(".",",")} €

        </div>

        <div class="quantity">

            <button onclick="decrease(${index})">

                −

            </button>

            <span>

                ${item.quantity || 1}

            </span>

            <button onclick="increase(${index})">

                +

            </button>

        </div>

        <span class="remove-item"

            onclick="removeItem(${index})">

            Entfernen

        </span>

    </div>

</div>

/* -------------------------------
   Produkt löschen
-------------------------------- */

function removeItem(index){

    cart.splice(index,1);

    saveCart();

    renderCart();

}

/* -------------------------------
   Local Storage
-------------------------------- */

function saveCart(){

    localStorage.setItem(

        "boda-cart",

        JSON.stringify(cart)

    );

}

/* -------------------------------
   Start
-------------------------------- */

renderCart();
/* ===========================
Produktfilter
=========================== */

document.querySelectorAll(".filter-btn").forEach(button=>{

button.addEventListener("click",()=>{

document.querySelectorAll(".filter-btn").forEach(btn=>{

btn.classList.remove("active");

});

button.classList.add("active");

const category=button.dataset.category;

document.querySelectorAll(".product-card").forEach(card=>{

if(category==="Alle"){

card.style.display="block";

return;

}

if(card.dataset.category===category){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

});
