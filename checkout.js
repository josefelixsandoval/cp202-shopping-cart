if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

function ready() {
  injectCSS();

  renderCart();

  addItemsToDOM();

  updateGlobalItemCounter();

  updateHiddenField();
}

function injectCSS() {
  var cartCSS = `
    @import url(http://fonts.googleapis.com/css?family=Merriweather);
    @import url(http://fonts.googleapis.com/css?family=Proza+Libre);

    .merriweather-header {
      font-family: "Proza Libre";
      font-size: 18px;
      font-weight: bold;
      color: #241c15;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    .proza-libre-content-header {
      font-family: "Proza Libre";
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.3em;
      color: #241c15;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    .proza-libre-content {
      font-family: "Proza Libre";
      font-size: 12px;
      color: #241c15;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    .proza-libre-button {
      font-family: "Proza Libre";
      letter-spacing: 0.4em;
    }

    .card-body {
    }

    .card-body p {
      margin: 0;
      padding: 0;
    }

    #cart-total p {
      margin: 4px;
    }

    hr {
      margin: 0;
      padding: 0;
    }

    .item:hover {
      background: rgb(232, 244, 248);
    }

    .proza-libre-password-validation {
      font-family: "Proza Libre";
      font-size: 12px;
      color: #241c15;
    }

    .proza-libre-content-footer {
      font-family: "Proza Libre";
      font-size: 11px;
      color: rgba(36,28,21,0.65);
    }


    .shadow-right {
      box-shadow: 8px 0 10px -6px black;
    }
  `;

  let css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet) css.styleSheet.cssText = cartCSS; // Support for IE
  else css.appendChild(document.createTextNode(cartCSS)); // Support for the rest
  document.getElementsByTagName("head")[0].appendChild(css);
}

function updateHiddenField() {
  console.log(localStorage.cart);
  $("#order_json").val(localStorage.cart);
}

function updateTotalAmount() {
  const HST = 0.13;
  let subTotal = getTotalAmount();
  let taxTotal = subTotal * HST;

  if (subTotal > 0) {
    $("#cart-total-subtotal").html(subTotal.toFixed(2));
    $("#cart-total-hst").html(taxTotal.toFixed(2));
    $("#cart-total-amount").html((subTotal + taxTotal).toFixed(2));
  }
}

function getTotalAmount() {
  var cart = [];

  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);

    if (cart.length > 0) {
      var total = 0;
      for (var i in cart) {
        total += (parseFloat(cart[i].prodQty) * parseFloat(cart[i].prodPrice));
      }

      return total;
    }
  }
}

function updateGlobalItemCounter() {
  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);

    if (cart.length > 0) {
      let quantity = 0;
      for (var i in cart) {
        quantity += parseInt(cart[i].prodQty);
      }
    }
  }
}

function addItemToDOM(data) {
  var cleanProdName = data.prodName;
  var itemHTML = `
    <div class="card-body item" id="cart-item-${cleanProdName}">
      <div class="row">
        <div class="col-8">
          <p class="proza-libre-content-header" id="item-name">${data.prodName}</p>
          <p class="proza-libre-content" id="itme-description">${data.prodDesc}</p>
        </div>
        <div class="col-4">
          <p class="text-right proza-libre-content" id="item-price">$ ${data.prodPrice}</p>
          <p class="text-right proza-libre-content">( <span id="item-quantity-${cleanProdName}">${data.prodQty}</span> )</p>
        </div>
      </div>
    </div>
  `;

  $("#cart-items").append(itemHTML);
}

function addItemsToDOM() {
  var cart = [];

  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);

    if (cart.length > 0) {
      $("#cart-items").empty();

      let itemCounter = 0;
      for (var i in cart) {
        itemCounter += cart[i].prodQty;
        addItemToDOM(cart[i]);
      }

      updateTotalAmount();
    }
  }
}

function renderCart() {
  var cartHTML = `
    <div id="cart-items">
    </div>

    <div id="cart-total">
      <hr>
      <div class="card-body">
        <p class="text-right proza-libre-content proza-libre-content-footer">Sub Total&nbsp;&nbsp;&nbsp;$<span id="cart-total-subtotal"></span></p>
        <p class="text-right proza-libre-content proza-libre-content-footer">HST&nbsp;&nbsp;&nbsp;$<span id="cart-total-hst"></span></p>
        <p class="text-right proza-libre-content proza-libre-content-header">Total&nbsp;&nbsp;&nbsp;$<span id="cart-total-amount"></span></p>
      </div>
    </div>
  `;

  $("#cp202-cart").empty();
  $("#cp202-cart").html(cartHTML);
}
