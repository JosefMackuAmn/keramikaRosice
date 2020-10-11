//HEADER////////////////////////////////////////////////////////////////
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
const categorySelectButtonClickHandler = (event) => {

  const btn = event.target;
  const list = btn.parentElement.querySelector('.category-select__subcategory-list');
  const btnClasses = [...btn.classList];
  console.log(btnClasses);

  if(btnClasses.includes('category-select__button--show')) {
    list.classList.remove('category-select__subcategory-list--hidden');
    btn.classList.remove('category-select__button--show');
    btn.classList.add('category-select__button--hide');
  } else {
    list.classList.add('category-select__subcategory-list--hiding');
    btn.classList.remove('category-select__button--hide');
    btn.classList.add('category-select__button--show');
    list.addEventListener('animationend', function(e) {
      list.classList.remove('category-select__subcategory-list--hiding');
      list.classList.add('category-select__subcategory-list--hidden');
    }, {
      capture: false,
      once: true,
      passive: false
    });
  }

}
// Getting all buttons on the category select portion of the page
const categorySelect = document.querySelector('.category-select');
const categorySelectButtons = categorySelect.querySelectorAll('button');
// Setting up event listeners
for (const btn of categorySelectButtons) {
  btn.addEventListener('click', categorySelectButtonClickHandler); 
}

//ESHOP-PRODUCT
const showProdModal = (prod, event) => {
  const modal = prod.querySelector('.product-modal');
  modal.classList.add('product-modal--toggled');
}
const closeProdModal = (prod, event) => {
  const modal = prod.querySelector('.product-modal');
  modal.classList.remove('product-modal--toggled');
}

const products = document.querySelectorAll('.product');
for(const prod of products) {
  const btnShowProdModal = prod.querySelector('.product-info .to-cart-button');
  const btnCloseProdModal = prod.querySelector('.product-modal__close-button');

  btnShowProdModal.addEventListener('click', showProdModal.bind(this, prod));
  btnCloseProdModal.addEventListener('click', closeProdModal.bind(this, prod));
}