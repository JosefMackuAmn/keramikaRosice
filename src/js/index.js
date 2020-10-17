import state from './utils/state';
import * as fcns from './utils/functions';  
  
///////////////////////////////////
///// CALLING READY FUNCTION
fcns.ready(() => {

    /////
    // MENU
    /////

    // Select hamburger button and attach click listener
    const hamburgerBtn = state.hamburgerBtn = document.querySelector("#hamburger-btn");
    const headerList = hamburgerBtn.nextElementSibling;

    hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if(![hamburgerBtn.classList].includes('header__nav-button--hiding')) {

            fcns.showOrHideEl(hamburgerBtn, 'header__nav-button--show', 'header__nav-button--hide', 'header__nav-button--hiding');
            fcns.showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');

            for (const listItem of headerList.children) {
                fcns.showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
            }
        }
    });

    // Window resize listener
    window.addEventListener("resize", fcns.resizeHeaderHandler);

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
            state.categoriesSlider.selectedArr = 'left';
            fcns.moveCategoriesSlider();
        });
        arrowRight.addEventListener("click", () => {
            state.categoriesSlider.selectedArr = 'right';
            fcns.moveCategoriesSlider();
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
                fcns.switchClass(btn, 'category-select__button--show', 'category-select__button--hide');
                // shows or removes the subcategory list
                fcns.showOrHideEl(list, 'category-select__subcategory-list--hidden', 'category-select__subcategory-list--visible', 'category-select__subcategory-list--hiding');
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
                fcns.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            });
            btnCloseProdModal.addEventListener('click', () => {
                // Hides product modal
                fcns.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
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
            fcns.showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
            fcns.showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
            fcns.switchClass(categorySelectMobileBtn, 'category-select__mobile-button--show', 'category-select__mobile-button--hide');
    
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


  