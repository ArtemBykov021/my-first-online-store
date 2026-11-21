
export function createCard(cardData) {

    const card = document.createElement("div");

    card.classList.add("card");
    card.dataset.id = cardData.id;
    card.style.backgroundColor = cardData.color;

    const title = document.createElement("h2");
    title.textContent = cardData.name;
    card.append(title);

    const image = document.createElement("img");
    image.src = cardData.imageUrl || "photo.jpg";
    image.alt = cardData.name;
    card.append(image);

    const price = document.createElement("div");
    price.classList.add("price");
    price.textContent = cardData.price + " ₽";
    card.append(price);

    const description = document.createElement("p");
    description.textContent = cardData.description;
    card.append(description);

    const link = document.createElement("a");
    link.href = "https://www.google.com";
    link.textContent = "Открыть Google";
    link.target = "_blank";
    card.append(link);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "удалить";
    card.append(deleteButton);

    const cartButton = document.createElement("button");
    cartButton.classList.add("cart-button");
    cartButton.textContent = "В корзину";
    card.append(cartButton);

    return card;
}
