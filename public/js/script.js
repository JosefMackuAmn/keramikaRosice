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

    element.addEventListener('animationend', function() {
     element.classList.remove(hidingClass);
     element.classList.add(hiddenClass);
    }, {
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
const hamburgerBtn = document.querySelector("#hamburger-btn");

hamburgerBtn.addEventListener(
  "click",
  hamburgerBtnClickHandler.bind(this, hamburgerBtn)
);

window.addEventListener("resize", resizeHeaderHandler.bind(this, hamburgerBtn));
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
