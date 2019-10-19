if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

var globalItemCounter = 0;

function ready() {
  injectCSS();

  renderCart();

  $("#cart-button").click(function() {
    $("#shopping-cart").slideToggle("slow", function() {});
  });

  $("#buttonUnicorn").on('click', {prodName: 'Unicorn', prodDesc: 'Great donut', prodPrice: '11.50', prodQty: '1'}, addItemToCart);
  $("#buttonCronut").on('click', {prodName: 'Cronutlatious', prodDesc: 'Great donut', prodPrice: '25.00', prodQty: '3'}, addItemToCart);

  $("#clearCart").on('click', clearCart);

  addItemsToDOM();

  updateGlobalItemCounter();
}

function updateTotalAmount() {
  const HST = 0.13;
  let subTotal = getTotalAmount();
  let taxTotal = subTotal * HST;

  if (subTotal > 0) {
    $("#button-checkout").removeClass('disabled');

    $("#cart-total-subtotal").html(subTotal.toFixed(2));
    $("#cart-total-hst").html(taxTotal.toFixed(2));
    $("#cart-total-amount").html((subTotal + taxTotal).toFixed(2));
    if (!$("#cart-total").is(':visible')) {
      $("#cart-total").show();
    }
  } else {
    $("#button-checkout").addClass('disabled');
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
      // return Math.round(total * 100) / 100;
    }
  }
}

function globalItemCounterChanged() {
  $("#global-item-counter").html((globalItemCounter > 0) ? globalItemCounter : '');
}

function updateGlobalItemCounter() {
  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);

    if (cart.length > 0) {
      let quantity = 0;
      for (var i in cart) {
        quantity += parseInt(cart[i].prodQty);
      }

      globalItemCounter = quantity;
      globalItemCounterChanged();
    }
  }
}

function clearCart() {
  $("#global-item-counter").html('');
  $("#cart-items").empty();
  $("#cart-total").hide();
  $("#button-checkout").addClass('disabled');
  globalItemCounter = 0;
  window.localStorage.clear();
}

function toggleCart() {
  $("#shopping-cart").slideToggle("slow", function() {});
}

function updateItemQuantity(prodName, quantity) {
  $("#item-quantity-" + getCleanProdName(prodName)).html(quantity);
}


function clientAddItemToCart(data) {
  if (!$("#shopping-cart").is(':visible')) {
    toggleCart();
  }

  // values = [prodName, quantity]
  let values = addItemToLocalCart(data);


  if (values) {
    // Update quantity only
    updateItemQuantity(values[0], values[1])
  } else {
    // Add new item to DOM
    addItemToDOM(data);
  }

  updateTotalAmount();

  updateGlobalItemCounter();

  // setTimeout(toggleCart, 3000);
}

function addItemToCart(event) {
  clientAddItemToCart(event.data);
}

function getCleanProdName(str) {
  return str.replace(/\s/g, '');
}

function addItemToDOM(data) {
  var cleanProdName = getCleanProdName(data.prodName);
  var itemHTML = `
    <div class="card-body item" id="cart-item-${cleanProdName}">
      <div class="row">
        <div class="col-8">
          <p class="proza-libre-content-header" id="item-name">${data.prodName}</p>
          <p class="proza-libre-content" id="itme-description">${data.prodDesc}</p>
        </div>
        <div class="col-4">
          <p class="text-right proza-libre-content" id="item-price">$ ${data.prodPrice}</p>
          <p class="text-right proza-libre-content">( <span id="item-quantity-${cleanProdName}">${data.prodQty}</span> )&nbsp;&nbsp;<a href="#" id="cart-button-${cleanProdName}"><i class="fa fa-trash-o" aria-hidden="true"></i></a></p>
        </div>
      </div>
    </div>
  `;

  $("#cart-items").append(itemHTML);

  $("#cart-button-" + cleanProdName).on('click', {prodName: data.prodName}, removeItem);
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

      globalItemCounter = itemCounter;

      globalItemCounterChanged();

      updateTotalAmount();
    }
  }
}

function removeItem(event) {
  var cart = [];

  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);
  }

  console.log('removeItem', cart);

  var index = cart.findIndex(cart => cart.prodName === event.data.prodName);
  console.log('removeItem index', index);

  if (index > -1) {
    var quantity = parseInt(cart[index].prodQty);
    console.log('quantity', quantity);

    if (quantity > 0) {
      quantity--;

      if (quantity < 1) {
        $("#cart-item-" + getCleanProdName(event.data.prodName)).remove();
        removeItemFromLocalCart(event.data.prodName);

        updateGlobalsAfterRemove();

        return;
      }

      cart[index].prodQty = quantity;

      console.log('before', cart)

      localStorage.cart = JSON.stringify(cart);

      console.log('after', localStorage.cart);

      updateItemQuantity(cart[index].prodName, quantity);
    }

    updateGlobalsAfterRemove();
  }
}

function updateGlobalsAfterRemove() {
  updateGlobalItemCounter();

  updateTotalAmount();
}

function removeItemFromLocalCart(prodName) {
  var cart = JSON.parse(localStorage.cart);

  var index = cart.findIndex(cart => cart.prodName === prodName);

  if (index > -1) {
    cart.splice(index, 1);

    localStorage.cart = JSON.stringify(cart);
    console.log('removeItemFromLocalCart', localStorage.cart);


    if (cart.length == 0) {
      clearCart();
    }
  }
}

function addItemToLocalCart(data) {
  var cart = [];

  if (localStorage.cart) {
    cart = JSON.parse(localStorage.cart);
  }

  var item = cart.find(cart => cart.prodName === data.prodName);
  console.log('item', item);

  var index = cart.findIndex(cart => cart.prodName === data.prodName);
  console.log('index', index);

  if (index > -1) {
    let quantity = parseInt(cart[index].prodQty) + parseInt(data.prodQty);
    cart[index].prodQty = quantity;

    localStorage.cart = JSON.stringify(cart);

    console.log("update");
    console.log(localStorage.cart);

    return [data.prodName, quantity];
  }

  // Add new item if not found
  cart.push(data);

  localStorage.cart = JSON.stringify(cart);

  console.log("new");
  console.log(localStorage.cart);
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

function renderCart() {
  var cartHTML = `
    <div id="cp202-cart"></div>
    <div style="position:absolute;right:8px;z-index:99">
      <div class="card-body text-right">
        <input type="hidden" value="" id="hidden-global-item-counter"/>
        <a href="#" id="cart-button"><i class="fa fa-shopping-cart fa-lg" aria-hidden="true"></i></a>&nbsp;&nbsp;<span class="badge badge-pill badge-primary" id="global-item-counter"></span>
      </div>

      <div id="shopping-cart" style="width:20rem; display:none">
        <div class="card shadow-right" style="width: 18rem;">
          <img src="donut-header-800px.jpg" class="card-img-top" alt="Header">

          <div id="cart-items">
          </div>

          <div id="cart-total" style="display:none">
            <hr>
            <div class="card-body">
              <p class="text-right proza-libre-content proza-libre-content-footer">Sub Total&nbsp;&nbsp;&nbsp;$<span id="cart-total-subtotal"></span></p>
              <p class="text-right proza-libre-content proza-libre-content-footer">HST&nbsp;&nbsp;&nbsp;$<span id="cart-total-hst"></span></p>
              <p class="text-right proza-libre-content proza-libre-content-header">Total&nbsp;&nbsp;&nbsp;$<span id="cart-total-amount"></span></p>
            </div>
          </div>

          <div class="card-body">
            <a href="#" class="btn btn-primary btn-block proza-libre-button disabled" id="button-checkout">CHECKOUT</a>
            <!--<a href="cart.html" class="btn btn-info btn-block proza-libre-button">VIEW CART</a>-->
            <a href="#" class="btn btn-danger btn-block proza-libre-button" id="clearCart">CLEAR CART</a>
          </div>
        </div>
      </div>
    </div>
  `;

  $("body").prepend(cartHTML);
}
