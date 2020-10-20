/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/state */ "./src/js/utils/state.js");
/* harmony import */ var _utils_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/functions */ "./src/js/utils/functions.js");
/* harmony import */ var _utils_ajax__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/ajax */ "./src/js/utils/ajax.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/data */ "./src/js/utils/data.js");




  
///////////////////////////////////
///// CALLING READY FUNCTION
_utils_functions__WEBPACK_IMPORTED_MODULE_1__.ready(() => {

    /////
    // MENU
    /////

    // Select hamburger button and attach click listener
    const hamburgerBtn = _utils_state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn = document.querySelector("#hamburger-btn");
    const headerList = hamburgerBtn.nextElementSibling;
    const headerBackDrop = document.querySelector('.header__backdrop');

    const toggleHeader = (e) => {
        e.stopPropagation();

        if(![hamburgerBtn.classList].includes('header__nav-button--hiding')) {

            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(hamburgerBtn, 'header__nav-button--show', 'header__nav-button--hide', 'header__nav-button--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(headerBackDrop, 'header__backdrop--hidden', 'header__backdrop--visible', 'header__backdrop--hiding');

            for (const listItem of headerList.children) {
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
            }
        }
    }
    headerBackDrop.addEventListener('click', toggleHeader);
    hamburgerBtn.addEventListener("click", toggleHeader);

    /////
    // CATEGORIES SLIDER
    /////

    // Try to find #categories-slider
    const categoriesSlider = document.getElementById("categories-slider");
    // If #categories-slider found
    if (categoriesSlider) {
        // Find arrows
        const arrowLeft = document.getElementById("arrow-left");
        const arrowRight = document.getElementById("arrow-right");
        
        // Attach click listener to arrows
        arrowLeft.addEventListener("click", () => {
            _utils_state__WEBPACK_IMPORTED_MODULE_0__.default.categoriesSlider.selectedArr = 'left';
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.moveCategoriesSlider();
        });
        arrowRight.addEventListener("click", () => {
            _utils_state__WEBPACK_IMPORTED_MODULE_0__.default.categoriesSlider.selectedArr = 'right';
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.moveCategoriesSlider();
        });        
    }

    /////
    // CART
    /////

    ///// TO ORDER BUTTON

    const toOrderBtn = document.getElementById('to-order');
    if(toOrderBtn) {
        const orderSection = document.getElementById('cart-order');

        toOrderBtn.addEventListener('click', () => {
            orderSection.scrollIntoView({behavior: 'smooth'});
        })
    }
    
    /////
    // CART & ORDER
    /////

    ///// Submit button event listener
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', _utils_ajax__WEBPACK_IMPORTED_MODULE_2__.orderSubmitHandler);
    }


    // Agreement checkbox event listeners 
    
    const agreeGDPR = document.getElementById('agree-gdpr');
    const agreeConditions = document.getElementById('agree-conditions');
    const submitToCartBtn = document.getElementById('submit-order');
    if(orderForm) {
        agreeGDPR.addEventListener('input', () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        })
        agreeConditions.addEventListener('input', () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        });
    }

    ///// Input Validation
    if(orderForm) {
        for (const input of _utils_data__WEBPACK_IMPORTED_MODULE_3__.formELs) {
            input.addEventListener('input', _utils_functions__WEBPACK_IMPORTED_MODULE_1__.validateInput.bind(undefined, input));
        }
    }

    /////
    // E-SHOP
    /////

    ///// SUBMIT TO CART BUTTON
    const eshopProducts = document.querySelector('.eshop__products');

    if (eshopProducts) {
        const submitBtns = eshopProducts.querySelectorAll('.post-order-btn');
        for (const btn of submitBtns) {
            btn.addEventListener('click', () => {
                // Create object with action ('ADD' || 'REMOVE'), productId, csrf, amount
                const postCartData = {
                    action: 'ADD',
                    productId: btn.dataset.productid,
                    csrf: btn.dataset.csrf,
                    amount: btn.parentElement.querySelector('input').value
                }
                
                _utils_ajax__WEBPACK_IMPORTED_MODULE_2__.postCartHandler(postCartData).catch(err => {
                    // ADD ERROR MODAL OPENING -----------------------------------------------------------------------
                });
            })
        }

    }

    ///// CATEGORY SELECT
    const categorySelect = document.querySelector('.category-select');

    if (categorySelect) {
        
       
        const categorySelectButtons = categorySelect.querySelectorAll('.category-select__button');

        for (const btn of categorySelectButtons) {
            const list = btn.parentElement.querySelector('.category-select__subcategory-list');
        
            btn.addEventListener('click', () => {
                // changes the button style
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.switchClass(btn, 'category-select__button--show', 'category-select__button--hide');
                // shows or removes the subcategory list
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(list, 'category-select__subcategory-list--hidden', 'category-select__subcategory-list--visible', 'category-select__subcategory-list--hiding');
            });
        }

        ///// PRODUCT MODAL
        const products = document.querySelectorAll('.product');

        for (const prod of products) {
            const btnShowProdModal = prod.querySelector('.product__info .to-cart-button');
            const btnCloseProdModal = prod.querySelector('.product__modal__close-button');
            const modal = prod.querySelector('.product__modal');
            
            btnShowProdModal.addEventListener('click', () => {
                // Shows product modal
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            });
            btnCloseProdModal.addEventListener('click', () => {
                // Hides product modal
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            });            
        }

        ///// MOBILE CATEGORY SELECT
        const categorySelectMobileBtn = categorySelect.querySelector('button');

        const categorySelectList = categorySelectMobileBtn.parentElement.querySelector('.category-select__category-list');
        const categorySelectHeading = categorySelectMobileBtn.parentElement.querySelector('.heading-2');
        const categorySelectBackdrop = document.querySelector('.category-select__backdrop');
        
        const footer = document.querySelector('footer');
    
        window.addEventListener('scroll', () => {
            const footerY = footer.getBoundingClientRect().y;
            const btnY = categorySelectMobileBtn.getBoundingClientRect().y;
    
            if (footerY >= btnY) {
                categorySelectList.classList.remove('scrollLocked');
                categorySelectHeading.classList.remove('scrollLocked');
            } else {
                categorySelectList.classList.add('scrollLocked');
                categorySelectHeading.classList.add('scrollLocked');
            }
        });
    
        // Toggle category select on mobile devices

        const toggleCategorySelect = () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(categorySelectBackdrop, 'category-select__backdrop--hidden', 'category-select__backdrop--visible', 'category-select__backdrop--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.switchClass(categorySelectMobileBtn, 'category-select__mobile-button--show', 'category-select__mobile-button--hide');
    
            if ([...categorySelectMobileBtn.classList].includes('category-select__mobile-button--show')) {
                categorySelectMobileBtn.textContent = 'Zobrazit kategorie';
            } else {
                categorySelectMobileBtn.textContent = 'Skrýt kategorie';
            }
        }

        categorySelectMobileBtn.addEventListener('click', toggleCategorySelect);
        categorySelectBackdrop.addEventListener('click', toggleCategorySelect);
    }
});


  

/***/ }),

/***/ "./src/js/utils/ajax.js":
/*!******************************!*\
  !*** ./src/js/utils/ajax.js ***!
  \******************************/
/*! namespace exports */
/*! export orderSubmitHandler [provided] [no usage info] [missing usage info prevents renaming] */
/*! export postCartHandler [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postCartHandler": () => /* binding */ postCartHandler,
/* harmony export */   "orderSubmitHandler": () => /* binding */ orderSubmitHandler
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functions */ "./src/js/utils/functions.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data */ "./src/js/utils/data.js");



const postCartHandler = async ({ action, csrf, amount, productId }) => {
    switch (action) {
        case 'ADD':
        case 'REMOVE':

            // Create body object
            const bodyObj = {
                action: action,
                amount: amount,
                productId: productId
            };

            // Send request
            fetch('/kosik', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrf,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            }).then(res => {
                if (!(res.ok && res.status >= 200 && res.status < 300)) {                
                    return res.json().then(json => {
                        throw new Error(json.msg);
                    });
                }
            }).catch(err => {
                throw new Error(err);
            })

            break;
        default: throw new Error('Non-existing cart action');
    }
}

const orderSubmitHandler = e => {

    e.preventDefault();

    ////Validatings input values 

        const emailValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.email);
        const firstNameValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.firstName);
        const lastNameValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.lastName);
        const phoneValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.phone);
        const streetValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.street);
        const cityValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.city);
        const zipCodeValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.zipCode);
        const deliveryValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.delivery);
        const paymentValue = _functions__WEBPACK_IMPORTED_MODULE_0__.validateInput(_data__WEBPACK_IMPORTED_MODULE_1__.formELs.payment);

    // If validation has failed (at least one element has class 'invalid'), returning

        if(document.querySelector('.invalid')) {
            return;
        }

    
    if (paymentValue === 'CRD') {

        // Get form elements and stripe public key
        const stripePublicKey = e.target.dataset.stripepublickey;
        const formEls = e.target.elements;

        // Initialize stripe
        const stripe = Stripe(stripePublicKey);
        
        // Create new form data
        const formData = new FormData();
        formData.append('_csrf', formEls._csrf.value);
        formData.append('firstName', firstNameValue);
        formData.append('lastName', lastNameValue);
        formData.append('email', emailValue);
        formData.append('phone', phoneValue);
        formData.append('street', streetValue);
        formData.append('city', cityValue);
        formData.append('delivery', deliveryValue);
        formData.append('payment', paymentValue);
        formData.append('zipCode', zipCodeValue);

        // Fetch POST /objednavka, expecting json
        fetch('/objednavka', {
            method: 'POST',
            body: formData
        }).then(res => {
            return res.json();
        }).then(session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        }).then(result => {
            if (result.error) {
                // SHOW ERROR MODAL ----------------------------------------------------------------------
            }
        }).catch(err => {
            // SHOW ERROR MODAL ----------------------------------------------------------------------
        }) 
    }
}

/***/ }),

/***/ "./src/js/utils/data.js":
/*!******************************!*\
  !*** ./src/js/utils/data.js ***!
  \******************************/
/*! namespace exports */
/*! export RegexMap [provided] [no usage info] [missing usage info prevents renaming] */
/*! export formELs [provided] [no usage info] [missing usage info prevents renaming] */
/*! export otherArgsMap [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "formELs": () => /* binding */ formELs,
/* harmony export */   "RegexMap": () => /* binding */ RegexMap,
/* harmony export */   "otherArgsMap": () => /* binding */ otherArgsMap
/* harmony export */ });
////
//SUBMIT
//
const orderForm = document.getElementById('order-form');

const formELs = orderForm ? orderForm.elements : undefined;

const RegexMap = orderForm ? new Map([
    [formELs.email, /^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$/],
    [formELs.firstName, /^[a-zA-ZčČďĎňŇřŘšŠťŤáéíóúůýě]{2,}$/],
    [formELs.lastName, /^[a-zA-ZčČďĎňŇřŘšŠťŤáéíóúůýě]{2,}$/],
    [formELs.phone, /^[0-9]{9}$/],
    [formELs.street, /(.+){2,}/],
    [formELs.city, /(.+){2,}/],
    [formELs.zipCode, /[0-9]{5}/],
    [formELs.delivery, /(ZAS|POS|OOD)/],
    [formELs.payment, /(DOB|CRD|BTR)/]
]
) : undefined;

const otherArgsMap = orderForm ? new Map([
    // [input, [markedElId, removeWhiteSpace]]
    [formELs.phone, [undefined, true]],
    [formELs.zipCode, [undefined, true]],
    [formELs.payment, ['order-payment']],
    [formELs.delivery, ['order-delivery']]
]) : undefined;

/***/ }),

/***/ "./src/js/utils/functions.js":
/*!***********************************!*\
  !*** ./src/js/utils/functions.js ***!
  \***********************************/
/*! namespace exports */
/*! export createCartHint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createModal [provided] [no usage info] [missing usage info prevents renaming] */
/*! export moveCategoriesSlider [provided] [no usage info] [missing usage info prevents renaming] */
/*! export outerWidth [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ready [provided] [no usage info] [missing usage info prevents renaming] */
/*! export refreshSubmitBtn [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeCartHint [provided] [no usage info] [missing usage info prevents renaming] */
/*! export removeModal [provided] [no usage info] [missing usage info prevents renaming] */
/*! export showOrHideEl [provided] [no usage info] [missing usage info prevents renaming] */
/*! export switchClass [provided] [no usage info] [missing usage info prevents renaming] */
/*! export validateInput [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ready": () => /* binding */ ready,
/* harmony export */   "outerWidth": () => /* binding */ outerWidth,
/* harmony export */   "showOrHideEl": () => /* binding */ showOrHideEl,
/* harmony export */   "switchClass": () => /* binding */ switchClass,
/* harmony export */   "moveCategoriesSlider": () => /* binding */ moveCategoriesSlider,
/* harmony export */   "refreshSubmitBtn": () => /* binding */ refreshSubmitBtn,
/* harmony export */   "validateInput": () => /* binding */ validateInput,
/* harmony export */   "createModal": () => /* binding */ createModal,
/* harmony export */   "removeModal": () => /* binding */ removeModal,
/* harmony export */   "removeCartHint": () => /* binding */ removeCartHint,
/* harmony export */   "createCartHint": () => /* binding */ createCartHint
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/js/utils/data.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/js/utils/state.js");



///////////////////////////////////
///// DEFINING FUNCTIONS

/////
// ready function to execute when DOM is loaded
/////
const ready = callbackFunc => {
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
const outerWidth = (el) => {
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
const showOrHideEl = (element, hiddenClass, visibleClass, hidingClass) => {
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
const switchClass = (el, classA, classB) => {
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
const moveCategoriesSlider = () => {
    // Find #categoires-scrollable-container
    const scrollableContainer = document.getElementById("categories-scrollable-container");

    // Find .categories-category
    const categoryEl = document.querySelector('.categories-category');
    // Find categoryEl width with margin
    const moveInPixels = outerWidth(categoryEl);

    // Conditionally scroll to left or to right
    if (_state__WEBPACK_IMPORTED_MODULE_1__.default.categoriesSlider.selectedArr === 'left') {
        scrollableContainer.scrollBy({
        top: 0,
        left: -moveInPixels,
        behavior: "smooth"
        });
    } else if (_state__WEBPACK_IMPORTED_MODULE_1__.default.categoriesSlider.selectedArr === 'right') {
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
const refreshSubmitBtn = (agreeGDPR, agreeConditions, submitToCartBtn)  => {
    
    // If both inputs are checked, disabled class on the submit button is removed
   if (agreeGDPR.checked && agreeConditions.checked) {

       submitToCartBtn.classList.remove('disabled');
       submitToCartBtn.removeAttribute('disabled');

   } else {

    submitToCartBtn.classList.add('disabled');
    submitToCartBtn.setAttribute('disabled', '');

   }
}
function validateInput(input) {

    // Getting regex for the current input
    const inputRegExp = _data__WEBPACK_IMPORTED_MODULE_0__.RegexMap.get(input);
    if(!inputRegExp) {
        return;
    }

    // Getting other arguments, if otherArgsMap contains them for current input
    let markedElId;
    let removeWhiteSpace;
    if (_data__WEBPACK_IMPORTED_MODULE_0__.otherArgsMap.get(input)) {
        [markedElId, removeWhiteSpace] = _data__WEBPACK_IMPORTED_MODULE_0__.otherArgsMap.get(input);
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
const createModal = (text, subText, buttonText) => {
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

    modalButton.addEventListener('click', removeModal.bind(undefined, modal));
    modalCloseButton.addEventListener('click', removeModal.bind(undefined, modal))
}

const removeModal = modal => {
    modal.parentElement.removeChild(modal);
}
/////
// CART-HINT
/////
const removeCartHint = cartHint => {
    cartHint.parentElement.removeChild(cartHint);
}
const createCartHint = (state, text) => {

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
    cartHintCloseButton.addEventListener('click', removeCartHint.bind(undefined, cartHint));

    // Cart hint gradually dissapears after 5 seconds
    setTimeout(() => {
        cartHint = document.querySelector('.cart-hint');
        cartHint.addEventListener('animationend', () => {
            removeCartHint(cartHint);
        })
        switchClass(cartHint, 'cart-hint--visible', 'cart-hint--hiding');
    }, 5000)
}



/***/ }),

/***/ "./src/js/utils/state.js":
/*!*******************************!*\
  !*** ./src/js/utils/state.js ***!
  \*******************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
///////////////////////////////////
///// DEFINE STATE
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    categoriesSlider: {
        selectedArr: null // 'left' || 'right'
    },
    hamburgerBtn: null
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=index.js.map