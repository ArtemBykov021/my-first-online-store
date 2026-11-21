import { createCard } from "./modules/cards.js";
import { renderCart, updateCartCount } from "./modules/cart.js";
import {
    updateOrderStats,
    renderOrderHistory as renderOrdersHistoryModule
} from "./modules/orders.js";
// ==================================
// 1. Элементы HTML
// ==================================
    const button = document.querySelector("#moreButton");
const message = document.getElementById("message");
const photo = document.getElementById("photo");
const imageUrlInput = document.querySelector("#imageUrlInput");
const toggleButton = document.getElementById("toggleButton");

button.addEventListener("click", function(event) {
    event.preventDefault();
    message.textContent = "Спасибо! Ты нажал кнопку.";
    message.classList.remove("hidden");
    photo.setAttribute("src", "photo2.jpg");
});

toggleButton.addEventListener("click", function(){
    message.classList.toggle("hidden");
});

let cards = document.querySelectorAll(".card");

const cardsContainer = document.querySelector(".cards");


let selectedCardId = null;

const nameInput = document.querySelector("#nameInput");
const priceInput = document.querySelector("#priceInput");
const saveButton = document.querySelector("#saveButton");
const editMessage = document.querySelector("#editMessage");
const addNameInput = document.querySelector("#addNameInput");
const addPriceInput = document.querySelector("#addPriceInput");
const addColorInput = document.querySelector("#addColorInput");
const addButton = document.querySelector("#addButton");
const addMessage = document.querySelector("#addMessage");

addButton.addEventListener("click", function(){
    const addedName = addNameInput.value.trim();
    const newPrice = Number(addPriceInput.value);
    const newColor = addColorInput.value;

    addMessage.textContent = "";
addMessage.style.color = "";

    if(addedName ==="") {
        addMessage.textContent = "Введи название карточки";
        addMessage.style.color = "red";
        return;
    }
    if (newPrice <= 0 || newPrice > 1000000 || addPriceInput.value === ""){
        addMessage.textContent = "Введи корректную цену";
        addMessage.style.color = "red";
        return;
    }
    const newCard = {
        name: addedName,
        price: newPrice,
        color: newColor,
        description: "Новая карточка",
        imageUrl: imageUrlInput.value.trim()
    };

    addCard(newCard);
    addMessage.textContent = "Карточка успешно добавлена!";
addMessage.style.color = "green";

    addNameInput.value = "";
    addPriceInput.value = "";
    imageUrlInput.value = "";
});

saveButton.addEventListener("click", function() {
    editMessage.textContent = "";
    editMessage.style.color = "";

    const newName = nameInput.value.trim();
    const newPrice = Number(priceInput.value);

    if (selectedCardId === null) {
        editMessage.textContent = "Сначала выбери карточку для редактирования";
        editMessage.style.color = "red";
        return;
    }

    if (newName === "") {
        editMessage.textContent = "Введи название карточки";
        editMessage.style.color = "red";
        return;
    }

    if (priceInput.value === "" || Number.isNaN(newPrice) || newPrice <= 0) {
        editMessage.textContent = "Введи корректную цену";
        editMessage.style.color = "red";
        return;
    }

    if (newPrice > 1000000) {
        editMessage.textContent = "Цена не должна превышать 1 000 000 ₽";
        editMessage.style.color = "red";
        return;
    }

    const cardData = cardsData.find(function(item) {
        return item.id === selectedCardId;
    });

    if (!cardData) {
        editMessage.textContent = "Карточка не найдена";
        editMessage.style.color = "red";
        return;
    }

    cardData.name = newName;
    cardData.price = newPrice;

    saveCards();
    renderCards();
    searchCards();

    nameInput.value = "";
    priceInput.value = "";
    selectedCardId = null;

    editMessage.textContent = "Карточка успешно изменена!";
    editMessage.style.color = "green";
});


const defaultCards = [
    {
        id: 1,
        name: "Первая карточка",
        price: 100,
        color: "yellow",
        description: "Это описание первой карточки."
    },
    {
        id: 2,
        name: "Вторая карточка",
        price: 200,
        color: "green",
        description: "Это описание второй карточки."
    },
    {
        id: 3,
        name: "Третья карточка",
        price: 300,
        color: "red",
        description: "Это описание третьей карточки."
    }
];


let cardsData = JSON.parse(localStorage.getItem("cards")) || defaultCards;
let maxId = cardsData.reduce(function(max, item) {
    return Math.max(max, Number(item.id) || 0);
}, 0);

cardsData.forEach(function(item) {
    if (item.id === undefined || item.id === null) {
        maxId++;
        item.id = maxId;
    }
});
saveCards();


if (cardsData.length === 0) {
    cardsData = [...defaultCards];
    saveCards();
}

function saveCards(){
    localStorage.setItem("cards", JSON.stringify(cardsData));
};

const searchInput = document.querySelector("#searchInput");
const maxPriceInput = document.querySelector("#maxPriceInput");
const minPriceInput = document.querySelector("#minPriceInput");
const filterPriceButton = document.querySelector("#filterPriceButton");
const cardsCount = document.querySelector("#cardsCount");
const resetFiltersButton = document.querySelector("#resetFiltersButton");

function searchCards() {
    cardsCount.textContent = "";
    const searchText = searchInput.value.toLowerCase().trim();
    const maxPrice = Number(maxPriceInput.value);
    const minPrice = Number(minPriceInput.value);

    if (
        minPriceInput.value !== "" &&
        maxPriceInput.value !== "" &&
        minPrice > maxPrice
    ) {
        cardsCount.textContent = "Минимальная цена не может быть больше максимальной";
        return;
    }

    let visibleCount = 0;

    cardsData.forEach(function(item, index){
        const card = cards[index];
        const matchesName = item.name.toLowerCase().trim().includes(searchText);
        const matchesDescription = (item.description || "").toLowerCase().trim().includes(searchText);
        const matchesMinPrice = minPriceInput.value === "" || item.price >= minPrice;
        const matchesMaxPrice = maxPriceInput.value === "" || item.price <= maxPrice;
        if ((matchesName || matchesDescription) && matchesMinPrice && matchesMaxPrice) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    cardsCount.textContent = "Найдено карточек: " + visibleCount;
}


searchInput.addEventListener("input", searchCards);
filterPriceButton.addEventListener("click", searchCards);
resetFiltersButton.addEventListener("click", function() {
    searchInput.value = "";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    searchCards();
});
// ==================================
// 2. Данные магазина
// ==================================
const container = cardsContainer;

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
const orderHistory = document.querySelector("#orderHistory");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");

let selectedOrderStatus = "Все";

const statsPeriodSelect = document.querySelector("#statsPeriod");

let selectedStatsPeriod = "all";

statsPeriodSelect.addEventListener("change", function() {
    selectedStatsPeriod = statsPeriodSelect.value;

    updateOrderStats(orders, selectedStatsPeriod);
});


function renderOrderHistory() {
    renderOrdersHistoryModule(
        orders,
        selectedOrderStatus,
        orderHistory,
        selectedStatsPeriod,

        function(newStatus) {
            if (newStatus !== undefined) {
                selectedOrderStatus = newStatus;
                renderOrderHistory();
                return;
            }

            localStorage.setItem("orders", JSON.stringify(orders));

            updateOrderStats(orders, selectedStatsPeriod);
        },

        function(orderId) {
            orders = orders.filter(function(item) {
                return item.id !== orderId;
            });

            localStorage.setItem("orders", JSON.stringify(orders));

            renderOrderHistory();
        }
    );
}


const sortButton = document.querySelector("#sortButton");
let sortAscending = true;
const sortNameButton = document.querySelector("#sortNameButton");
let sortNameAscending = true;

sortNameButton.addEventListener("click", function() {
    cardsData.sort(function(a, b) {
        if (sortNameAscending) {
            return a.name.localeCompare(b.name, "ru");
        } else {
            return b.name.localeCompare(a.name, "ru");
        }
    });

    sortNameAscending = !sortNameAscending;

    saveCards();
    renderCards();
    searchCards();
});

sortButton.addEventListener("click", function(){
    cardsData.sort(function(a,b){
       if (sortAscending) {
        return a.price - b.price;
       } else {
        return b.price - a.price
       }
    });
    sortAscending = !sortAscending;
   if (sortAscending) {
    sortButton.textContent = "Сортировать: по возрастанию";
} else {
    sortButton.textContent = "Сортировать: по убыванию";
}

     saveCards();
renderCards();
searchCards();
});

function addCard(cardData) {
    const maxId = cardsData.reduce(function(max, item) {
        return Math.max(max, Number(item.id) || 0);
    }, 0);

    cardData.id = maxId + 1;

    cardsData.push(cardData);

    saveCards();
    renderCards();
    searchCards();
}



function renderCards() {
    container.innerHTML = "";

    cardsData.forEach(function(item) {
        const card = createCard(item);
        container.append(card);
    });

    cards = document.querySelectorAll(".card");
}



renderCards();
renderCart(cart, cartItems, cartTotal);
updateCartCount(cart, cartCount);
renderOrderHistory();

cardsContainer.addEventListener("click", function(event) {

    // 1. Удаление товара
    const deleteButton = event.target.closest(".delete-button");

    if (deleteButton) {
        const card = deleteButton.closest(".card");
        const cardId = Number(card.dataset.id);

        const cardIndex = cardsData.findIndex(function(item) {
            return item.id === cardId;
        });

        if (cardIndex === -1) {
            return;
        }

        cardsData.splice(cardIndex, 1);

        saveCards();
        renderCards();
        searchCards();

        return;
    }

    // 2. Добавление товара в корзину
    const cartButton = event.target.closest(".cart-button");

    if (cartButton) {
        const card = cartButton.closest(".card");
        const cardId = Number(card.dataset.id);

        const product = cardsData.find(function(item) {
            return Number(item.id) === cardId;
        });

        if (!product) {
            return;
        }

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount(cart, cartCount);
        renderCart(cart, cartItems, cartTotal);

        return;
    }

    // 3. Выбор карточки для редактирования
    const clickedCard = event.target.closest(".card");

    if (clickedCard) {
        selectedCardId = Number(clickedCard.dataset.id);
    }

});

cartItems.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-cart-button")) {
        const item = event.target.closest("p");
        const index = Array.from(cartItems.children).indexOf(item);

        cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount(cart, cartCount);
        renderCart(cart, cartItems, cartTotal);
    }
});

const checkoutForm = document.querySelector("#checkoutForm");

const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerAddress = document.querySelector("#customerAddress");

const orderMessage = document.querySelector("#orderMessage");

checkoutForm.addEventListener("submit", function(event){
    event.preventDefault();

    orderMessage.textContent = "";
    orderMessage.style.color = "";

    if(cart.length ===0) {
        orderMessage.textContent = "Сначала добавьте товар в корзину.";
        return;
    }

    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();
    const address = customerAddress.value.trim();

    if (!name || !phone || !address) {
        orderMessage.textContent = "Заполните все поля.";
        return;
    }

    const order = {
       id: Math.max(
    Number(localStorage.getItem("lastOrderId")) || 0,
    ...orders.map(function(order) {
        return Number(order.id) || 0;
    }),
    0
) + 1,
        name: name,
        phone: phone,
        address: address,
        products: cart.map(function(product){
            return{
                name: product.name,
                price: Number(product.price)
            };
        }),
        total: cart.reduce(function(sum, product){
            return sum + Number(product.price);
        }, 0),
        date: new Date().toLocaleString(),
        createdAt: new Date().toISOString(),
        status: "Новый"
    };
    orders.push(order);

    localStorage.setItem("lastOrderId", String(order.id));
    localStorage.setItem("orders", JSON.stringify(orders));

    renderOrderHistory();

    orderMessage.textContent =
    "Спасибо, " + order.name +
    "! Ваш заказ №" + order.id +
    " на сумму " + order.total + " ₽ оформлен.";

    orderMessage.style.color = "green";

   const submitButton = checkoutForm.querySelector('button[type="submit"]');
   
   submitButton.disabled = true;
   submitButton.textContent = "Заказ оформлен";

   setTimeout(function(){
    submitButton.disabled = false;
    submitButton.textContent = "Оформить заказ";
   }, 2000);

    cart = [];

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount(cart, cartCount);
renderCart(cart, cartItems, cartTotal);

checkoutForm.reset();
});


const menuLinks = document.querySelectorAll(".menu a");
const pageSections = document.querySelectorAll("#home, #catalog, #cart, #orders");

const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            menuLinks.forEach(function(link) {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                '.menu a[href="#' + entry.target.id + '"]'
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}, {
    rootMargin: "-100px 0px -55% 0px"
});

pageSections.forEach(function(section) {
    sectionObserver.observe(section);
});

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

menuToggle.addEventListener("click", function() {
    const isOpen = menu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню"
    );
});

menu.addEventListener("click", function(event) {
    const clickedLink = event.target.closest("a");

    if (!clickedLink) {
        return;
    }

    menu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute("aria-label", "Открыть меню");
});

document.addEventListener("keydown", function(event) {
    if (event.key !== "Escape") {
        return;
    }

    if (!menu.classList.contains("open")) {
        return;
    }

    menu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
});
