//UTILITY-CLASSES///////////////////////////////////////////////////////////////

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

//HEADER/////////////////////////////////////////////////////////////////////////////////////////////////////////

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
