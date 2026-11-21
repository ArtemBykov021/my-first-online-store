
export function updateCartCount(cart, cartCount) {
    cartCount.textContent = cart.length;
}

export function renderCart(cart, cartItems, cartTotal) {
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function(product) {
        const item = document.createElement("p");

        item.textContent = product.name + " — " + product.price + " ₽ ";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Удалить";
        removeButton.classList.add("remove-cart-button");

        item.append(removeButton);
        cartItems.append(item);

        total += Number(product.price);
    });

    cartTotal.textContent = total;
}
