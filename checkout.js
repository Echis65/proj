const cartContent = document.querySelector(".cart-content");
/* let itemTotal = document.querySelector(".item-total");
let itemName = document.querySelector(".item-name"); */
class Cart {
  getCart() {
    for (let i = 0; i < localStorage.length; i++) {
      let result = localStorage.getItem("cart");
      console.log(result);
      const title = result[i].title;
      const price = result[i].price;
      const amount = result[i].amount;
      console.log(title);
    }
    /*  for (let i = 0; i < result.length; i++) {
     
    } */
  }
  cartItems(item) {
    let div = document.createElement("div");
    div.classList.add("item-name");
    div.innerHTML = `
    <div class="cart-item">
    <p><span>${item["title"]}</span><span class="item-total"></span></p>
  </div>  
    `;
    cartContent.appendChild(div);
  }
}
let cart = new Cart();
cart.cartItems();
