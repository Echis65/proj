const cartBtn = document.querySelector(".cart-btn");
const closecartBtn = document.querySelector(".close-cart");
const clearcartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");
let cart = [];
let buttonsDOM = [];
class Products {
  async getProduct() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((items) => {
        const { title, price } = items.fields;
        const { id } = items.sys;
        const image = items.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
     <article class="product">
     <div class="img-container">
       <img
         src=${product.image}
         alt="product"
         class="product-img"
       />
       <button class="bag-btn" data-id=${product.id}>
         <i class="fas fa-shopping-cart"></i>
         add to cart
       </button>
     </div>
     <h3>${product.title}</h3>
     <h4>Ghs${product.price}</h4>
   </article>
     `;
    });
    productDOM.innerHTML = result;
  }
  getCartButtons() {
    const btns = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = btns;
    btns.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", (e) => {
          e.target.innerText = "In Cart";
          e.target.disabled = true;
        });
      }
    });
  }
}
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  products
    .getProduct()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getCartButtons();
    });
});
