const fetchProducts = () => {
    const searchInput = document.getElementById("search-bar").value.trim().toLowerCase();

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayProducts(data.meals); 
            } else {
                displayNoResults(); 
            }
        })
        .catch(error => console.error("Error fetching products:", error));
};

const displayProducts = (products) => {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ""; 

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-4", "col-lg-3", "mb-4");

        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.strMealThumb}" class="card-img-top" alt="${product.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${product.strMeal}</h5>
                    <button class="btn btn-warning w-100" onclick="showProductDetails(${product.idMeal})">Details</button>
                </div>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
};

const showProductDetails = (id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            const product = data.meals[0];
            document.getElementById("modal-title").innerText = product.strMeal;
            document.getElementById("modal-image").src = product.strMealThumb;
            document.getElementById("modal-price").innerText = `Category: ${product.strCategory}`;
            document.getElementById("modal-description").innerText = product.strInstructions;

            const productModal = new bootstrap.Modal(document.getElementById('productModal'));
            productModal.show();
        })
        .catch(error => console.error("Error fetching product details:", error));
};

const displayNoResults = () => {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <div class="text-center">
            <h3 class="text-danger">No products found!</h3>
        </div>
    `;
};

document.getElementById("search-btn").addEventListener("click", fetchProducts);
fetchProducts();
