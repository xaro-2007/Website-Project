
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const productCards = document.querySelectorAll(".product-card");

    function searchProducts() {
        const keyword = searchInput.value.trim().toLowerCase();
        let found = 0;

        productCards.forEach(function (card) {
            const productName =
                card.querySelector("h3").textContent.toLowerCase();

            const productCategory =
                card.querySelector(".product-category").textContent.toLowerCase();

            const isMatch =
                productName.includes(keyword) ||
                productCategory.includes(keyword);

            card.style.display = isMatch ? "" : "none";

            if (isMatch) {
                found++;
            }
        });

        let message = document.getElementById("searchMessage");

        if (!message) {
            message = document.createElement("p");
            message.id = "searchMessage";

            document.querySelector(".products .section-title")
                .appendChild(message);
        }

        if (keyword === "") {
            message.textContent = "";
        } else if (found === 0) {
            message.textContent = "Không tìm thấy sản phẩm phù hợp.";
        } else {
            message.textContent = "Tìm thấy " + found + " sản phẩm.";
        }

        document.querySelector(".products").scrollIntoView({
            behavior: "smooth"
        });
    }

    searchButton.addEventListener("click", searchProducts);

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchProducts();
        }
    });

    searchInput.addEventListener("input", function () {
        if (searchInput.value.trim() === "") {
            productCards.forEach(function (card) {
                card.style.display = "";
            });

            const message = document.getElementById("searchMessage");

            if (message) {
                message.textContent = "";
            }
        }
    });
});
