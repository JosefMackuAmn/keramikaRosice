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

// Switching between two classes, if element has class A, the class A is replaced for class B, if element has class B, the class B is replaced for class A
const switchClass = (el, classA, classB) => {
  if([...el.classList].includes(classA)) {
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
//HEADER/////////////////////////////////////////////////////////////////////////////////////////////////////////
const resizeHeaderHandler = (btn) => {
  console.log(window.clientX);
  if (document.documentElement.getBoundingClientRect().width > 700) {
    const navList = btn.nextElementSibling;
    navList.classList.remove("header__nav-list--shown");
    btn.classList.remove("header__nav-button--clicked");
    btn.nextElementSibling.removeAttribute('style');
    for(const child of btn.nextElementSibling.children) {
      child.style.animation = 'none';
    }
  }
};
const hamburgerBtnClickHandler = (btn, event) => {
  event.stopPropagation();

  if (Array.from(btn.classList).includes("header__nav-button--clicked")) {
    btn.classList.remove("header__nav-button--clicked");
    btn.nextElementSibling.addEventListener('animationend', function(e) {
      btn.nextElementSibling.style.display = 'none';
    }, {
      capture: false,
      once: true,
      passive: false
    });
    for(const child of btn.nextElementSibling.children) {
      child.style.animation = 'headerShiftOut .2s forwards';
    }
  } else {
    btn.classList.toggle("header__nav-button--clicked");
    btn.nextElementSibling.style.display = 'block';
    for(const child of btn.nextElementSibling.children) {
      child.style.animation = 'headerShiftIn .2s forwards';
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

///////////////////////////////////
///// DEFINE STATE
const state = {
  categoriesSlider: {
    selectedArr: null // 'left' || 'right'
  }
}


///////////////////////////////////
///// CALLING READY FUNCTION
ready(() => {
  // Select hamburger button and attach click listener
  const hamburgerBtn = document.querySelector("#hamburger-btn");
  const headerList = hamburgerBtn.nextElementSibling;

  hamburgerBtn.addEventListener(
    "click",
    () => {

      switchClass(hamburgerBtn, 'header__nav-button--hide', 'header__nav-button--show');
      showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');
      for (const listItem of headerList.children) {
        showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
      }

    }
  );

  // Window resize listener
  window.addEventListener("resize", resizeHeaderHandler.bind(this, hamburgerBtn));

  // Try to find #categories-slider
  const categoriesSlider = document.getElementById("categories-slider");
  // If #categories-slider found
  if (categoriesSlider) {
    // Find arrows
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");
    
    // Attach click listener to arrows
    arrowLeft.addEventListener("click", () => {
      state.categoriesSlider.selectedArr = 'left';
      moveCategoriesSlider();
    });
    arrowRight.addEventListener("click", () => {
      state.categoriesSlider.selectedArr = 'right';
      moveCategoriesSlider();
    });
    
  }
     
});

//ESHOP//////////////////////////////////////////////////////////////////////

//ESHOP-CATEGORY-SELECT

const categorySelect = document.querySelector('.category-select');
const categorySelectButtons = categorySelect.querySelectorAll('.category-select__button');

for (const btn of categorySelectButtons) {
  const list = btn.parentElement.querySelector('.category-select__subcategory-list');

  btn.addEventListener('click', () => {
    switchClass(btn, 'category-select__button--show', 'category-select__button--hide'); // changes the button style
    showOrHideEl(list, 'category-select__subcategory-list--hidden', 'category-select__subcategory-list--visible', 'category-select__subcategory-list--hiding'); // shows or removes the subcategory list
  }); 
}

//ESHOP-PRODUCT

const products = document.querySelectorAll('.product');

for(const prod of products) {
  const btnShowProdModal = prod.querySelector('.product-info .to-cart-button');
  const btnCloseProdModal = prod.querySelector('.product-modal__close-button');
  const modal = prod.querySelector('.product-modal');

  btnShowProdModal.addEventListener('click', () => {
    switchClass(modal, 'product-modal--toggled', 'product-modal--hidden'); //shows product modal
  });
  btnCloseProdModal.addEventListener('click', () => {
    switchClass(modal, 'product-modal--toggled', 'product-modal--hidden'); //hides product modal
  });
  
}

//ESHOP-CATEGORY-SELECT-MOBILE-BUTTON

const categorySelectMobileBtn = categorySelect.querySelector('button');
const categorySelectList = categorySelectMobileBtn.parentElement.querySelector('.category-select__category-list');
const categorySelectHeading = categorySelectMobileBtn.parentElement.querySelector('.heading-2');


categorySelectMobileBtn.addEventListener('click', () => {
  showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
  showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
})
