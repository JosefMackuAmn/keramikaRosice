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

  
  
///////////////////////////////////
///// CALLING READY FUNCTION
_utils_functions__WEBPACK_IMPORTED_MODULE_1__.ready(() => {

    /////
    // MENU
    /////

    // Select hamburger button and attach click listener
    const hamburgerBtn = _utils_state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn = document.querySelector("#hamburger-btn");
    const headerList = hamburgerBtn.nextElementSibling;

    hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if(![hamburgerBtn.classList].includes('header__nav-button--hiding')) {

            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(hamburgerBtn, 'header__nav-button--show', 'header__nav-button--hide', 'header__nav-button--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');

            for (const listItem of headerList.children) {
                _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
            }
        }
    });

    // Window resize listener
    window.addEventListener("resize", _utils_functions__WEBPACK_IMPORTED_MODULE_1__.resizeHeaderHandler);

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
    // E-SHOP
    /////

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
        categorySelectMobileBtn.addEventListener('click', () => {
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
            _utils_functions__WEBPACK_IMPORTED_MODULE_1__.switchClass(categorySelectMobileBtn, 'category-select__mobile-button--show', 'category-select__mobile-button--hide');
    
            if([...categorySelectMobileBtn.classList].includes('category-select__mobile-button--show')) {
                categorySelectMobileBtn.textContent = 'Zobrazit kategorie';
            } else {
                categorySelectMobileBtn.textContent = 'Skrýt kategorie';
            }
        });
    }
    /////
    // MODAL
    /////
});


  

/***/ }),

/***/ "./src/js/utils/functions.js":
/*!***********************************!*\
  !*** ./src/js/utils/functions.js ***!
  \***********************************/
/*! namespace exports */
/*! export moveCategoriesSlider [provided] [no usage info] [missing usage info prevents renaming] */
/*! export outerWidth [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ready [provided] [no usage info] [missing usage info prevents renaming] */
/*! export resizeHeaderHandler [provided] [no usage info] [missing usage info prevents renaming] */
/*! export showOrHideEl [provided] [no usage info] [missing usage info prevents renaming] */
/*! export switchClass [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ready": () => /* binding */ ready,
/* harmony export */   "outerWidth": () => /* binding */ outerWidth,
/* harmony export */   "showOrHideEl": () => /* binding */ showOrHideEl,
/* harmony export */   "switchClass": () => /* binding */ switchClass,
/* harmony export */   "resizeHeaderHandler": () => /* binding */ resizeHeaderHandler,
/* harmony export */   "moveCategoriesSlider": () => /* binding */ moveCategoriesSlider
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./src/js/utils/state.js");


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
// Header functions
/////
const resizeHeaderHandler = () => {
    console.log(window.clientX);
    if (document.documentElement.getBoundingClientRect().width > 700) {
        const navList = _state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn.nextElementSibling;

        navList.classList.remove("header__nav-list--shown");
        _state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn.classList.remove("header__nav-button--clicked");
        _state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn.nextElementSibling.removeAttribute('style');

        for(const child of _state__WEBPACK_IMPORTED_MODULE_0__.default.hamburgerBtn.nextElementSibling.children) {
            child.style.animation = 'none';
        }
    }
};

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
    if (_state__WEBPACK_IMPORTED_MODULE_0__.default.categoriesSlider.selectedArr === 'left') {
        scrollableContainer.scrollBy({
        top: 0,
        left: -moveInPixels,
        behavior: "smooth"
        });
    } else if (_state__WEBPACK_IMPORTED_MODULE_0__.default.categoriesSlider.selectedArr === 'right') {
        scrollableContainer.scrollBy({
        top: 0,
        left: moveInPixels,
        behavior: "smooth"
        });
    }
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