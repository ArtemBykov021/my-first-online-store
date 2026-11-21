
export function getOrderTimestamp(order) {
    if (!order.createdAt) {
        return null;
    }

    const timestamp = new Date(order.createdAt).getTime();

    if (Number.isNaN(timestamp)) {
        return null;
    }

    return timestamp;
}

export function getOrdersByPeriod(orders, days) {
    const now = Date.now();

    const periodStart = now - days * 24 * 60 * 60 * 1000;

    return orders.filter(function(order) {
        const orderTime = getOrderTimestamp(order);

        return orderTime !== null && orderTime >= periodStart;
    });
}

export function updateOrderStats(orders, selectedStatsPeriod) {
    let periodOrders;

    if (selectedStatsPeriod === "all") {
        periodOrders = orders;
    } else {
        periodOrders = getOrdersByPeriod(
            orders,
            Number(selectedStatsPeriod)
        );
    }

    document.querySelector("#newOrdersCount").textContent =
        periodOrders.filter(function(order) {
            return (order.status || "Новый") === "Новый";
        }).length;

    document.querySelector("#processingOrdersCount").textContent =
        periodOrders.filter(function(order) {
            return order.status === "В обработке";
        }).length;

    document.querySelector("#shippedOrdersCount").textContent =
        periodOrders.filter(function(order) {
            return order.status === "Отправлен";
        }).length;

    document.querySelector("#completedOrdersCount").textContent =
        periodOrders.filter(function(order) {
            return order.status === "Завершён";
        }).length;

    document.querySelector("#cancelledOrdersCount").textContent =
        periodOrders.filter(function(order) {
            return order.status === "Отменён";
        }).length;

    document.querySelector("#totalOrdersCount").textContent =
        periodOrders.length;

    const totalRevenue = periodOrders.reduce(function(sum, order) {
        return sum + (Number(order.total) || 0);
    }, 0);

    document.querySelector("#ordersTotalSum").textContent =
        totalRevenue + " ₽";

    const averageOrderValue = periodOrders.length > 0
        ? totalRevenue / periodOrders.length
        : 0;

    document.querySelector("#averageOrderValue").textContent =
        Math.round(averageOrderValue) + " ₽";
}

export function renderOrderHistory(
    orders,
    selectedOrderStatus,
    orderHistory,
    selectedStatsPeriod,
    onStatusChange,
    onDelete
) {
    updateOrderStats(orders, selectedStatsPeriod);
    orderHistory.innerHTML = "";

    const filter = document.createElement("select");

    const filterStatuses = [
        "Все",
        "Новый",
        "В обработке",
        "Отправлен",
        "Завершён",
        "Отменён"
    ];

    filterStatuses.forEach(function(statusName) {
        const option = document.createElement("option");
        option.value = statusName;
        option.textContent = statusName;

        if (selectedOrderStatus === statusName) {
            option.selected = true;
        }

        filter.append(option);
    });

    filter.addEventListener("change", function() {
        onStatusChange(filter.value);
    });

    orderHistory.append(filter);

    if (orders.length === 0) {
        orderHistory.innerHTML = "<p>Здесь пока нет заказов.</p>";
        return;
    }

    const filteredOrders = selectedOrderStatus === "Все"
        ? orders
        : orders.filter(function(order) {
            return (order.status || "Новый") === selectedOrderStatus;
        });

    filteredOrders.forEach(function(order) {
        const orderBlock = document.createElement("div");
        orderBlock.classList.add("order-item");

        const title = document.createElement("h3");
        title.textContent = "Заказ №" + order.id;

        const status = document.createElement("label");
        status.textContent = "Статус: ";

        const statusSelect = document.createElement("select");

        const statuses = [
            "Новый",
            "В обработке",
            "Отправлен",
            "Завершён",
            "Отменён"
        ];

        statuses.forEach(function(statusName) {
            const option = document.createElement("option");
            option.value = statusName;
            option.textContent = statusName;

            if ((order.status || "Новый") === statusName) {
                option.selected = true;
            }

            statusSelect.append(option);
        });

        statusSelect.addEventListener("change", function() {
            order.status = statusSelect.value;
            onStatusChange();
        });

        status.append(statusSelect);

        const date = document.createElement("p");
        date.textContent = "Дата :" + order.date;

        const customer = document.createElement("p");
        customer.textContent = "Покупатель: " + order.name;

        const phone = document.createElement("p");
        phone.textContent = "Телефон: " + (order.phone || "Не указан");

        const address = document.createElement("p");
        address.textContent = "Адрес доставки: " + (order.address || "Не указан");

        const products = document.createElement("p");
        products.textContent = "Товары: " + order.products
            .map(function(product) {
                return product.name + " - " + product.price + " ₽";
            })
            .join(", ");

        const total = document.createElement("p");
        total.textContent = "Итого: " + order.total + " ₽";

        const detailsBlock = document.createElement("div");
        detailsBlock.hidden = true;

        detailsBlock.append(
            phone,
            address,
            products,
            total
        );

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить заказ";

        const detailsButton = document.createElement("button");
        detailsButton.textContent = "Показать подробности";

        detailsButton.addEventListener("click", function() {
            detailsBlock.hidden = !detailsBlock.hidden;

            if (detailsBlock.hidden) {
                detailsButton.textContent = "Показать подробности";
            } else {
                detailsButton.textContent = "Скрыть подробности";
            }
        });

        deleteButton.addEventListener("click", function() {
            const confirmed = confirm(
                "Удалить заказ №" + order.id + "?"
            );

            if (confirmed) {
                onDelete(order.id);
            }
        });

        orderBlock.append(
            title,
            status,
            date,
            customer,
            detailsButton,
            detailsBlock,
            deleteButton
        );

        orderHistory.append(orderBlock);
    });
}
