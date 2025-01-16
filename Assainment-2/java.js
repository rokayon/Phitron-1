window.onload = () => {
  fetchProducts("a");
};

const fetchProducts = (query) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.drinks) {
        displayProducts(data.drinks);
      } else {
        document.getElementById("product-container").innerHTML =
          "<p class='text-center'>No results found! Sorry!!</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      document.getElementById("product-container").innerHTML =
        "<p class='text-center text-danger'>Error loading products. Try again later.</p>";
    });
};

let cart = []; 
const cartSize = 7; 

const searchProducts = () => {
  const searchInput = document.getElementById("search-input").value.trim();
  if (!searchInput) {
    document.getElementById("product-container").innerHTML =
      "<p class='text-center text-success'>Please enter a search term.</p>";
    return;
  }
  fetchProducts(searchInput);
};

const displayProducts = (products) => {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-md-6", "mb-4");
    productCard.innerHTML = `
      <div class="card">
        <img src="${product.strDrinkThumb}" class="card-img-top" alt="${product.strDrink}" />
        <div class="card-body">
          <h5 class="card-title">Name: ${product.strDrink}</h5>
          <p class="card-text">Category: ${product.strCategory}</p>
          <p class="card-text">${product.strInstructions.slice(0, 15)}...</p>
          <button class="btn btn-info w-100 mb-2" onclick="addToCart('${product.idDrink}', '${product.strDrink}', '${product.strDrinkThumb}')">Add to Cart</button>
          <button class="btn btn-success w-100" onclick="viewDetails('${product.idDrink}')">Details</button>
        </div>
      </div>
    `;
    productContainer.appendChild(productCard);
  });
};

const addToCart = (id, name, img) => {
  if (cart.length >= cartSize) {
    alert("You cannot add more than 7 items to the cart.");
    return;
  }
  cart.push({ id, name, img });
  updateCart();
};

const updateCart = () => {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  cartItems.innerHTML = ""; 
  cartCount.textContent = cart.length; 

  cart.forEach((item, index) => {
    const div = document.createElement("tr");
    div.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${item.img}" class="img-thumbnail" style="width: 50px; height: 50px;" alt="${item.name}" /></td>
      <td>${item.name}</td>
    `;
    cartItems.appendChild(div);
  });
};

const viewDetails = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.drinks && data.drinks.length > 0) {
        const product = data.drinks[0];
        document.getElementById("modal-image").src = product.strDrinkThumb;
        document.getElementById("modal-name").textContent = product.strDrink;
        document.getElementById("modal-category").textContent =
          "Category: " + product.strCategory;
        document.getElementById("modal-alcoholic").textContent = // Corrected here
          "Alcoholic: " + product.strAlcoholic;
        document.getElementById("modal-instructions").textContent =
          "Instructions: " + product.strInstructions;

        const detailsModal = new bootstrap.Modal(
          document.getElementById("detailsModal")
        );
        detailsModal.show();
      }
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      alert("Unable to fetch product details. Please try again.");
    });
};

document.getElementById("search-button").addEventListener("click", searchProducts);
