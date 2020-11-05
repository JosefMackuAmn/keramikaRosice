import { RegexMap, otherArgsMap }  from './data';
import state from './state';
import * as ajax from './ajax';

///////////////////////////////////
///// DEFINING FUNCTIONS

/////
// ready function to execute when DOM is loaded
/////
export const ready = callbackFunc => {
    if (document.readyState !== 'loading') {
        // Document is already ready, call the callback directly
        callbackFunc();
    } else if (document.addEventListener) {
        // All modern browsers to register DOMContentLoaded
        document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
        // Old IE browsers
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
                callbackFunc();
            }
        });
    }
}
  
/////
// Utilities functions
/////
export const outerWidth = (el) => {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
}

// Rendering the element or removing it from the screen smoothly - with animations
// The element must have 3 CSS Classes available - hidden class, visible class, hiding class
// Hidden class - display: none, no animation
// Visible class - display: block (or whatever except none) and an animation of the element appearing on the page (sliding -in or so)
// Hiding class - animation of the element disappearing
// Element has only one of these classes at a time.
// The hiding class is changed to hidden class after 'animationend' event on the element
export const showOrHideEl = (element, hiddenClass, visibleClass, hidingClass) => {
    if([...element.classList].includes(hiddenClass)) {
        element.classList.remove(hiddenClass);
        element.classList.add(visibleClass);
    } else {
        element.classList.remove(visibleClass);
        element.classList.add(hidingClass);

        const animationEndHandler =  function(event) {
        if(event.pseudoElement) {
            element.addEventListener('animationend', animationEndHandler,  {
            capture: false,
            once: true,
            passive: false
            });
            return;
        }
        element.classList.remove(hidingClass);
        element.classList.add(hiddenClass);
        }

        element.addEventListener('animationend', animationEndHandler, {
        capture: false,
        once: true,
        passive: false
        });
    }
}

// Switching between two classes, if an element has a class A, the class A is replaced for class B, if an element has a class B, the class B is replaced for the class A
export const switchClass = (el, classA, classB) => {
    if ([...el.classList].includes(classA)) {
        el.classList.remove(classA);
        el.classList.add(classB);
    } else {
        el.classList.remove(classB);
        el.classList.add(classA);
    }
}

/////
// Categories slider
/////
export const moveCategoriesSlider = () => {
    // Find #categoires-scrollable-container
    const scrollableContainer = document.getElementById("categories-scrollable-container");

    // Find .categories-category
    const categoryEl = document.querySelector('.categories-category');
    // Find categoryEl width with margin
    const moveInPixels = outerWidth(categoryEl);

    // Conditionally scroll to left or to right
    if (state.categoriesSlider.selectedArr === 'left') {
        scrollableContainer.scrollBy({
        top: 0,
        left: -moveInPixels,
        behavior: "smooth"
        });
    } else if (state.categoriesSlider.selectedArr === 'right') {
        scrollableContainer.scrollBy({
        top: 0,
        left: moveInPixels,
        behavior: "smooth"
        });
    }
}

/////
// SUBMIT
/////

//// Managing the disabled state
export const refreshSubmitBtn = (agreeGDPR, agreeConditions, submitToCartBtn)  => {
    
    // If both inputs are checked, disabled class on the submit button is removed
   if (agreeGDPR.checked && agreeConditions.checked) {
       
       submitToCartBtn.classList.remove('disabled');
       submitToCartBtn.removeAttribute('disabled');
       
    } else {
        
        submitToCartBtn.classList.add('disabled');
        submitToCartBtn.setAttribute('disabled', '');
   }
}
export function validateInput(input) {

    // Getting regex for the current input
   const inputRegExp = RegexMap.get(input);
    if(!inputRegExp) {
        return;
    }

    // Getting other arguments, if otherArgsMap contains them for current input
    let markedElId;
    let removeWhiteSpace;
    if (otherArgsMap.get(input)) {
        [markedElId, removeWhiteSpace] = otherArgsMap.get(input);
    }
    
    // Getting input value, if specified, removing all single space characters (f.e in the case of zipcode)
    let inputValue;
    if (removeWhiteSpace) {
        inputValue = input.value.trim().replace(/\s/g, "");
    } else {
        inputValue = input.value.trim();
    }

    
    // Getting element, on which the 'invalid' class is added in validation fail cases
    let markedEl;
    if (markedElId) {
        markedEl = document.getElementById(markedElId);
    } else {
        markedEl = input;
    }

    // If input value doesn´t match the regular expression, validation 'fails' - the invalid class is added on markedEl, new Error is thrown
    if(!inputRegExp.test(inputValue)) {
        markedEl.classList.add('invalid');
    } else {
        markedEl.classList.remove('invalid');
    }

    return inputValue;
}
/////
// MODAL
/////
export const createModal = (text, subText, buttonText) => {
    const modal = document.createElement('div');
    const body = document.body;

    modal.classList.add('modal');
    modal.innerHTML = `<div class="modal__backdrop"></div>
    <div class="modal__window">
        <div class="modal__text">${text}</div>
        <div class="modal__subtext">${subText}</div>
        <button class="modal__button">${buttonText}</button>
        <div class="close-button"></div>
    </div>`;
   
    body.appendChild(modal);

    const modalButton = modal.querySelector('.modal__button');
    const modalCloseButton = modal.querySelector('.close-button');

    modalButton.addEventListener('click', removeModal.bind(this, modal));
    modalCloseButton.addEventListener('click', removeModal.bind(this, modal))
}

export const removeModal = modal => {
    modal.parentElement.removeChild(modal);
}
/////
// CART-HINT
/////
export const removeCartHint = cartHint => {
    cartHint.parentElement.removeChild(cartHint);
}
export const createCartHint = (state, text) => {

    // Removing current cart hint if any
    const currentCartHint = document.querySelector('.cart-hint');

    if(currentCartHint) {
        currentCartHint.parentElement.removeChild(currentCartHint);
    }

    // State = 'success' | 'failed'
    if(state !== 'success' && state !== 'failed') {
        return;
    }

    let cartHint = document.createElement('div');
    const body = document.body;

    cartHint.classList.add('cart-hint');
    cartHint.classList.add('cart-hint--visible');
    cartHint.classList.add(`cart-hint--${state}`);
    cartHint.innerHTML = `<div class="cart-hint__text">
    ${text}
    </div>
    <div class="cart-hint__symbol cart-hint__symbol--${state}">

    </div>
    <button class="close-button">

    </button>`;

    body.appendChild(cartHint);

    const cartHintCloseButton = cartHint.querySelector('button');
    cartHintCloseButton.addEventListener('click', removeCartHint.bind(this, cartHint));

    // Cart hint gradually dissapears after 5 seconds
    setTimeout(() => {
        if(cartHint) {
            cartHint.addEventListener('animationend', () => {
                removeCartHint(cartHint);
            })
            switchClass(cartHint, 'cart-hint--visible', 'cart-hint--hiding');
        }
    }, 5000)
}
/////
//CART
/////
export const addToCart = (postCartData) => {

    return ajax.postCartHandler(postCartData)
    .then((updatedCart) => {
        createCartHint('success', `Produkt byl úspěšně přidán do košíku`);         
        return updatedCart;           
    }).catch(err => {
        console.log(err);
        createCartHint('failed', `Nastala chyba, produkt nebyl přidán do košíku`);
    });

};
export const removeFromCart = (postCartData) => {

    return ajax.postCartHandler(postCartData)
    .then((updatedCart) => {
        createCartHint('success', `Produkt byl úspěšně odebrán z košíku`);         
        return updatedCart;           
    }).catch(err => {
        createCartHint('failed', `Nastala chyba, produkt nebyl odebrán z košíku`);
    });

}
export const updateCartItem = (cartItem, updatedCart) => {

    const cartItemObj = updatedCart.items.find(item => {
        return item.product._id = cartItem.dataset.productid;
    })

    const amountEl = cartItem.querySelector('.cart-item__amount-box__amount');
    const priceEl = cartItem.querySelector('.cart-item__price');

    if(!cartItemObj) {

        cartItem.parentElement.removeChild(cartItem);

    } else {

        amountEl.textContent = `${cartItemObj.amount}ks`;
        priceEl.textContent = +cartItemObj.product.price * cartItemObj.amount + 'Kč';

    }

    updateTotalPrice(updatedCart);
    updateCartPage();
    updateCartIcon(updatedCart);
}

export const updateCartPage = () => {
    
    const cartItem = document.querySelector('.cart-item');

    const cartOrder = document.getElementById('cart-order');
    const emptyCartContent = document.querySelector('.cart__cart-content__empty');
    const summary = document.querySelector('.cart__cart-content__summary');
    const dph = document.querySelector('.cart__cart-content__dph');
    const button = document.getElementById('to-order');

    if(!cartItem) {

        cartOrder.style.display = 'none';
        summary.style.display  = 'none';
        emptyCartContent.style.display = 'block';
        dph.style.display = 'none';
        button.classList.remove('hidden');
        button.classList.add('hidden');

    } else {

        cartOrder.style.display = 'flex';
        summary.style.display  = 'flex';
        emptyCartContent.style.display = 'none';
        dph.style.display = 'block';
        button.classList.remove('hidden');
    }
}

export const updateTotalPrice  = (updatedCart) => {
    
    const priceEl = document.querySelector(".cart__cart-content__summary__price");

    priceEl.textContent = `${updatedCart.total}Kč`;

}
/////
//HEADER
/////
export const updateCartIcon = (updatedCart) => {
    const cartAmountEl = document.querySelector('.header__cart-amount');
    const cartAmount = updatedCart.items.reduce((prevValue, curValue, id) => {
        return prevValue + updatedCart.items[id].amount;
    }, 0)
    if(cartAmount <= 0) {
        cartAmountEl.style.display = 'none';
    } else {
        cartAmountEl.style.display = 'flex';
    }
    cartAmountEl.textContent = cartAmount;
}

export const easterTime = (frogAudio, e) => {
    const string = e.target.value;
    const showEaster = () => {
        const frog = document.createElement('img');
        frog.style.width = '50px';
        frog.style.height = '50px';
        frog.style.position = 'absolute';
        frog.style.top = '50%';
        frog.style.left = '50%';
        frog.style.objectFit = 'cover';
        frog.setAttribute('src', '/img/frog.png');
        frog.style.animation = 'easterAnimation 2.8s linear';
        document.querySelector('body').prepend(frog);
        setTimeout(() => {
            const audio = frogAudio.cloneNode();
            audio.play();                
        }, 100);
        setTimeout(() => {
            frog.parentElement.removeChild(frog);
        }, 2800);
    }
    if (string === 'boomer' || string === 'Boomer') {
        showEaster();
    }
    if (string === 'BOOMER') {
        const easterInterval = setInterval(() => {
            showEaster();
        }, 400);
        setTimeout(() => {
            clearInterval(easterInterval);
        }, 2000);
    }
}