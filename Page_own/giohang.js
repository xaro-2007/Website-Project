
// ==========================================
// 1. KHỞI TẠO GIỎ HÀNG
// ==========================================

const CART_KEY = "julieCart";
const ORDER_KEY = "julieOrders";

// Đọc dữ liệu giỏ hàng từ trình duyệt
function loadCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

        if (!Array.isArray(data)) {
            return [];
        }

        // Kiểm tra dữ liệu sản phẩm
        return data.filter(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.image === "string" &&
            Number.isSafeInteger(item.price) &&
            item.price >= 0 &&
            Number.isSafeInteger(item.quantity) &&
            item.quantity >= 1 &&
            item.quantity <= 99
        );

    } catch (error) {
        console.error("Không thể đọc giỏ hàng:", error);
        return [];
    }
}

let cart = loadCart();


// ==========================================
// 2. ĐỊNH DẠNG TIỀN VIỆT NAM
// ==========================================

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + " ₫";
}


// ==========================================
// 3. LƯU GIỎ HÀNG
// ==========================================

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        return true;

    } catch (error) {
        console.error("Không thể lưu giỏ hàng:", error);
        alert("Không thể lưu giỏ hàng. Vui lòng kiểm tra trình duyệt.");
        return false;
    }
}


// ==========================================
// 4. TÍNH TỔNG SỐ LƯỢNG SẢN PHẨM
// ==========================================

function getTotalQuantity() {
    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}


// ==========================================
// 5. TÍNH TẠM TÍNH
// ==========================================

function getSubtotal() {
    return cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}


// ==========================================
// 6. TÍNH PHÍ VẬN CHUYỂN
// ==========================================

function getShipping() {
    return cart.length > 0 ? 30000 : 0;
}


// ==========================================
// 7. TÍNH TỔNG THANH TOÁN
// ==========================================

function getTotalPrice() {
    return getSubtotal() + getShipping();
}


// ==========================================
// 8. THÊM SẢN PHẨM VÀO GIỎ HÀNG
// ==========================================

// Có thể gọi hàm này từ trang sanpham.html.
//
// Ví dụ:
// addToCart(
//     "SP01",
//     "Sữa rửa mặt",
//     150000,
//     "../images/suaruamat.jpg"
// );

function addToCart(id, name, price, image) {

    id = String(id);

    price = Number(price);

    if (
        !id ||
        typeof name !== "string" ||
        !name.trim() ||
        !Number.isSafeInteger(price) ||
        price < 0 ||
        typeof image !== "string" ||
        !image.trim()
    ) {
        alert("Thông tin sản phẩm không hợp lệ!");
        return;
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const product = cart.find(item => item.id === id);

    if (product) {

        if (product.quantity >= 99) {
            alert("Số lượng tối đa của sản phẩm là 99.");
            return;
        }

        // Sản phẩm đã có: tăng số lượng
        product.quantity++;

    } else {

        // Sản phẩm chưa có: thêm sản phẩm mới
        cart.push({
            id: id,
            name: name.trim(),
            price: price,
            image: image,
            quantity: 1
        });

    }

    // Chỉ thông báo thành công khi lưu được
    if (!saveCart()) {
        return;
    }

    renderCart();

    alert("Đã thêm sản phẩm vào giỏ hàng!");
}


// ==========================================
// 9. TĂNG SỐ LƯỢNG
// ==========================================

function increaseQuantity(id) {

    const product = cart.find(item => item.id === id);

    if (!product) {
        return;
    }

    if (product.quantity >= 99) {
        alert("Số lượng tối đa của sản phẩm là 99.");
        return;
    }

    product.quantity++;

    if (!saveCart()) {
        product.quantity--;
        return;
    }

    renderCart();
}


// ==========================================
// 10. GIẢM SỐ LƯỢNG
// ==========================================

function decreaseQuantity(id) {

    const product = cart.find(item => item.id === id);

    if (!product) {
        return;
    }

    const oldQuantity = product.quantity;

    if (oldQuantity > 1) {

        product.quantity--;

    } else {

        // Nếu còn 1 sản phẩm, hỏi trước khi xóa
        const confirmed = confirm(
            "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
        );

        if (!confirmed) {
            return;
        }

        cart = cart.filter(item => item.id !== id);

    }

    if (!saveCart()) {
        cart = loadCart();
        renderCart();
        return;
    }

    renderCart();
}


// ==========================================
// 11. XÓA SẢN PHẨM
// ==========================================

function removeFromCart(id) {

    const product = cart.find(item => item.id === id);

    if (!product) {
        return;
    }

    const confirmed = confirm(
        'Bạn có chắc chắn muốn xóa "' +
        product.name +
        '" khỏi giỏ hàng không?'
    );

    if (!confirmed) {
        return;
    }

    const oldCart = [...cart];

    cart = cart.filter(item => item.id !== id);

    if (!saveCart()) {
        cart = oldCart;
        renderCart();
        return;
    }

    renderCart();
}


// ==========================================
// 12. TẠO PHẦN TỬ HIỂN THỊ SẢN PHẨM
// ==========================================

function createCartItem(item) {

    const productElement = document.createElement("div");

    productElement.className = "cart-item";


    // THÔNG TIN SẢN PHẨM

    const productInfo = document.createElement("div");

    productInfo.className = "product-info";


    const image = document.createElement("img");

    image.className = "product-image";

    image.src = item.image;

    image.alt = item.name;

    image.loading = "lazy";


    const nameContainer = document.createElement("div");


    const productName = document.createElement("div");

    productName.className = "product-name";

    productName.textContent = item.name;


    // NÚT XÓA

    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "remove-btn";

    removeButton.textContent = "Xóa sản phẩm";

    removeButton.addEventListener("click", function () {
        removeFromCart(item.id);
    });


    nameContainer.appendChild(productName);

    nameContainer.appendChild(removeButton);


    productInfo.appendChild(image);

    productInfo.appendChild(nameContainer);


    // ĐƠN GIÁ

    const productPrice = document.createElement("div");

    productPrice.className = "product-price";

    productPrice.textContent = formatMoney(item.price);


    // ĐIỀU KHIỂN SỐ LƯỢNG

    const quantityControl = document.createElement("div");

    quantityControl.className = "quantity-control";


    const decreaseButton = document.createElement("button");

    decreaseButton.type = "button";

    decreaseButton.textContent = "−";

    decreaseButton.setAttribute("aria-label", "Giảm số lượng");

    decreaseButton.addEventListener("click", function () {
        decreaseQuantity(item.id);
    });


    const quantityNumber = document.createElement("span");

    quantityNumber.className = "quantity-number";

    quantityNumber.textContent = item.quantity;


    const increaseButton = document.createElement("button");

    increaseButton.type = "button";

    increaseButton.textContent = "+";

    increaseButton.setAttribute("aria-label", "Tăng số lượng");

    increaseButton.disabled = item.quantity >= 99;

    increaseButton.addEventListener("click", function () {
        increaseQuantity(item.id);
    });


    quantityControl.appendChild(decreaseButton);

    quantityControl.appendChild(quantityNumber);

    quantityControl.appendChild(increaseButton);


    // THÀNH TIỀN

    const productTotal = document.createElement("div");

    productTotal.className = "product-total";

    productTotal.textContent = formatMoney(
        item.price * item.quantity
    );


    // GHÉP CÁC PHẦN TỬ

    productElement.appendChild(productInfo);

    productElement.appendChild(productPrice);

    productElement.appendChild(quantityControl);

    productElement.appendChild(productTotal);


    return productElement;
}


// ==========================================
// 13. CẬP NHẬT SỐ LƯỢNG TRÊN THANH MENU
// ==========================================

function updateCartCount() {

    const count = getTotalQuantity();

    // Hỗ trợ cả trường hợp trang có nhiều vị trí hiển thị
    document.querySelectorAll("#cart-count").forEach(element => {
        element.textContent = count;
    });

    document.querySelectorAll("#cart-item-count").forEach(element => {
        element.textContent = count;
    });

    document.querySelectorAll("#summary-count").forEach(element => {
        element.textContent = count;
    });
}


// ==========================================
// 14. HIỂN THỊ GIỎ HÀNG
// ==========================================

function renderCart() {

    // Cập nhật số lượng trên menu
    updateCartCount();

    const cartItems = document.getElementById("cart-items");

    // Nếu đang ở trang sản phẩm hoặc trang chủ
    // thì chỉ cần cập nhật số lượng trên menu
    if (!cartItems) {
        return;
    }


    const emptyCart = document.getElementById("empty-cart");

    const checkoutButton = document.getElementById("checkout-btn");


    // Xóa danh sách cũ
    cartItems.replaceChildren();


    // Hiển thị từng sản phẩm
    cart.forEach(item => {

        const productElement = createCartItem(item);

        cartItems.appendChild(productElement);

    });


    // Hiện thông báo nếu giỏ hàng trống
    emptyCart.hidden = cart.length !== 0;


    // Cập nhật tạm tính
    document.getElementById("subtotal").textContent =
        formatMoney(getSubtotal());


    // Cập nhật phí vận chuyển
    document.getElementById("shipping").textContent =
        formatMoney(getShipping());


    // Cập nhật tổng tiền
    document.getElementById("total-price").textContent =
        formatMoney(getTotalPrice());


    // Khóa nút thanh toán nếu không có sản phẩm
    checkoutButton.disabled = cart.length === 0;


    // Cập nhật tổng tiền trong form thanh toán
    updateCheckoutTotal();
}


// ==========================================
// 15. CẬP NHẬT TỔNG TIỀN THANH TOÁN
// ==========================================

function updateCheckoutTotal() {

    const totalElement = document.getElementById(
        "checkout-total-price"
    );

    if (!totalElement) {
        return;
    }

    totalElement.textContent = formatMoney(getTotalPrice());
}


// ==========================================
// 16. MỞ FORM THANH TOÁN
// ==========================================

function openCheckout() {

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    document.getElementById("cart-section").hidden = true;

    document.getElementById("cart-intro").hidden = true;

    document.getElementById("checkout-section").hidden = false;

    document.getElementById("order-success").hidden = true;

    updateCheckoutTotal();

    document.getElementById("checkout-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 17. QUAY LẠI GIỎ HÀNG
// ==========================================

function backToCart() {

    document.getElementById("checkout-section").hidden = true;

    document.getElementById("order-success").hidden = true;

    document.getElementById("cart-section").hidden = false;

    document.getElementById("cart-intro").hidden = false;

    renderCart();

    document.getElementById("cart-intro").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 18. LẤY DANH SÁCH ĐƠN HÀNG ĐÃ LƯU
// ==========================================

function loadOrders() {

    try {

        const orders = JSON.parse(
            localStorage.getItem(ORDER_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];

    } catch (error) {

        console.error("Không thể đọc danh sách đơn hàng:", error);

        return [];

    }
}


// ==========================================
// 19. HIỂN THỊ ĐẶT HÀNG THÀNH CÔNG
// ==========================================

function showOrderSuccess(order) {

    document.getElementById("cart-intro").hidden = true;

    document.getElementById("cart-section").hidden = true;

    document.getElementById("checkout-section").hidden = true;

    document.getElementById("order-success").hidden = false;


    document.getElementById("order-code").textContent =
        order.orderCode;

    document.getElementById("order-customer").textContent =
        order.customerName;

    document.getElementById("order-total").textContent =
        formatMoney(order.totalPrice);

    document.getElementById("order-payment").textContent =
        order.paymentMethod === "COD"
            ? "Thanh toán khi nhận hàng (COD)"
            : "Chuyển khoản ngân hàng";

    document.getElementById("order-status").textContent =
        order.status;


    document.getElementById("order-success").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 20. XỬ LÝ ĐẶT HÀNG
// ==========================================

function handlePlaceOrder(event) {

    event.preventDefault();

    const form = document.getElementById("checkout-form");

    const errorElement = document.getElementById("checkout-error");

    const placeOrderButton = document.getElementById("place-order-btn");


    errorElement.hidden = true;

    errorElement.textContent = "";


    // KIỂM TRA GIỎ HÀNG

    if (cart.length === 0) {

        errorElement.textContent =
            "Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.";

        errorElement.hidden = false;

        return;
    }


    // KIỂM TRA FORM

    if (!form.reportValidity()) {
        return;
    }


    // LẤY THÔNG TIN KHÁCH HÀNG

    const customerName = document
        .getElementById("customer-name")
        .value
        .trim();

    const customerPhone = document
        .getElementById("customer-phone")
        .value
        .trim();

    const customerAddress = document
        .getElementById("customer-address")
        .value
        .trim();

    const paymentMethod = document
        .getElementById("payment-method")
        .value;

    const orderNote = document
        .getElementById("order-note")
        .value
        .trim();


    // KIỂM TRA LẠI THÔNG TIN

    if (!customerName || !customerPhone || !customerAddress) {

        errorElement.textContent =
            "Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ.";

        errorElement.hidden = false;

        return;
    }


    if (!/^[0-9]{10,11}$/.test(customerPhone)) {

        errorElement.textContent =
            "Số điện thoại phải gồm 10 hoặc 11 chữ số.";

        errorElement.hidden = false;

        return;
    }


    if (!["COD", "BANK"].includes(paymentMethod)) {

        errorElement.textContent =
            "Vui lòng chọn phương thức thanh toán hợp lệ.";

        errorElement.hidden = false;

        return;
    }


    // CHỤP LẠI THÔNG TIN SẢN PHẨM TẠI THỜI ĐIỂM ĐẶT HÀNG

    const products = cart.map(item => ({

        id: item.id,

        name: item.name,

        price: item.price,

        quantity: item.quantity,

        image: item.image,

        lineTotal: item.price * item.quantity

    }));


    // TÍNH TIỀN

    const subtotal = getSubtotal();

    const shipping = getShipping();

    const totalPrice = subtotal + shipping;


    // TẠO MÃ ĐƠN HÀNG

    const orderCode =
        "JULIE-" +
        Date.now().toString() +
        "-" +
        Math.floor(Math.random() * 900 + 100);


    // TẠO ĐƠN HÀNG

    const order = {

        orderCode: orderCode,

        customerName: customerName,

        customerPhone: customerPhone,

        customerAddress: customerAddress,

        paymentMethod: paymentMethod,

        orderNote: orderNote,

        products: products,

        totalQuantity: getTotalQuantity(),

        subtotal: subtotal,

        shipping: shipping,

        totalPrice: totalPrice,

        orderDate: new Date().toISOString(),

        status: "Chờ xác nhận"

    };


    // ĐỌC CÁC ĐƠN HÀNG CŨ

    const orders = loadOrders();


    // VÔ HIỆU HÓA NÚT TRONG LÚC LƯU

    placeOrderButton.disabled = true;

    placeOrderButton.textContent = "Đang lưu đơn hàng...";


    try {

        // LƯU ĐƠN HÀNG TRƯỚC KHI XÓA GIỎ HÀNG

        orders.push(order);

        localStorage.setItem(
            ORDER_KEY,
            JSON.stringify(orders)
        );


        // KIỂM TRA ĐƠN HÀNG ĐÃ LƯU

        const savedOrders = JSON.parse(
            localStorage.getItem(ORDER_KEY) || "[]"
        );

        const savedOrder = savedOrders.find(
            item => item.orderCode === orderCode
        );

        if (!savedOrder) {
            throw new Error("Không tìm thấy đơn hàng vừa lưu.");
        }


        // CHỈ XÓA GIỎ HÀNG SAU KHI LƯU ĐƠN HÀNG THÀNH CÔNG

        const previousCart = [...cart];

        cart = [];

        if (!saveCart()) {

            cart = previousCart;

            renderCart();

            throw new Error("Không thể cập nhật giỏ hàng.");

        }


        // CẬP NHẬT GIAO DIỆN

        renderCart();

        showOrderSuccess(order);


        // THÔNG BÁO CHO KHÁCH HÀNG

        alert(
            "Đặt hàng thành công!\n" +
            "Mã đơn hàng: " + orderCode +
            "\nTổng tiền: " + formatMoney(totalPrice)
        );


        // XÓA FORM SAU KHI ĐẶT HÀNG

        form.reset();

    } catch (error) {

        console.error("Lỗi khi đặt hàng:", error);

        errorElement.textContent =
            "Không thể lưu đơn hàng. Vui lòng thử lại.";

        errorElement.hidden = false;

    } finally {

        placeOrderButton.disabled = false;

        placeOrderButton.textContent = "Xác nhận đặt hàng";

    }

}


// ==========================================
// 21. KHỞI CHẠY WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // HIỂN THỊ GIỎ HÀNG
    renderCart();


    // NÚT THANH TOÁN
    const checkoutButton = document.getElementById("checkout-btn");

    if (checkoutButton) {

        checkoutButton.addEventListener("click", openCheckout);

    }


    // NÚT QUAY LẠI GIỎ HÀNG
    const backButton = document.getElementById("back-to-cart-btn");

    if (backButton) {

        backButton.addEventListener("click", backToCart);

    }


    // FORM ĐẶT HÀNG
    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) {

        checkoutForm.addEventListener("submit", handlePlaceOrder);

    }

});


// ==========================================
// 22. ĐỒNG BỘ KHI CÓ THAY ĐỔI Ở TAB KHÁC
// ==========================================

window.addEventListener("storage", function (event) {

    if (event.key === CART_KEY) {

        cart = loadCart();

        renderCart();

    }

});