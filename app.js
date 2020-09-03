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
class Storage {
  async saveProducts() {
    let result = await fetch("http://13.73.143.200:8080/shop/api-product/");
    localStorage.setItem("products", JSON.stringify(result));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id == id);
    /* let tempItem =cart.find((item) => {
      item.id == id;
    }) */
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

class Products {
  async getProduct() {
    try {
      let result = await fetch("http://13.73.143.200:8080/shop/api-product/");
      let data = await result.json();
      let products = data;
      products = products.map((items) => {
        const title = items.name;
        const price = items.price;
        const id = items.id;
        const image = items.image;
        // console.log(items.price)
        return { title, price, id, image };
      });
      console.log(products);
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
class UI {
  displayProducts() {
    let products = JSON.parse(localStorage.getItem("products"));
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
      // console.log(id)
      let inCart = cart.find((item) => item.id == id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", (e) => {
          e.target.innerText = "In Cart";
          e.target.disabled = true;
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          console.log(cartItem);
          cart = [...cart, cartItem];
          Storage.saveCart(cart);
          this.setCartValues(cart);
          this.addCartItem(cartItem);
          /* this.showCart(); */
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `  <img src=${item.image} alt="procut" />
    <div>
      <h4>${item.title}</h4>
      <h5>${item.price}</h5>
      <span class="remove-item" data-id= ${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id= ${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id= ${item.id}></i>
    </div>
  </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closecartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    clearcartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id == id);
        tempItem.amount = tempItem.amount + 1;

        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let reduceAmount = event.target;
        let id = reduceAmount.dataset.id;
        let tempItem = cart.find((item) => item.id == id);
        tempItem.amount = tempItem.amount - 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        reduceAmount.previousElementSibling.innerText = tempItem.amount;
        if (tempItem.amount === 0) {
          let removeItem = event.target;
          let id = removeItem.dataset.id;
          cartContent.removeChild(removeItem.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id != id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    console.error();
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id == id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupApp();
  products
    .getProduct()
    .then((products) => {
      ui.displayProducts(products);
      /*  Storage.saveProducts(products); */
    })
    .then(() => {
      ui.getCartButtons();
      ui.cartLogic();
    });
});
