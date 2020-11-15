import 'url-search-params-polyfill';
import 'fetch-polyfill';

import state from './utils/state';
import * as fcns from './utils/functions';
import * as ajax from './utils/ajax';
import { formELs }  from './utils/data';

  
///////////////////////////////////
///// CALLING READY FUNCTION
fcns.ready(() => {

    /////
    // SHOW MODAL
    /////

    const params = new URLSearchParams(window.location.search);
    
    if (params.has('payment')) {

        const payment = params.get('payment');

        if (payment === 'success') {
            fcns.createModal('Úspěch', 'Platba proběhla úspěšně. Faktura k objednávce Vám přišla na e-mail.', 'OK')
        } else if (payment === 'canceled') {
            fcns.createModal('Storno', 'Platba byla přerušena, ale prodejce byl o Vaší objednávce informován a kontaktuje Vás.', 'OK')
        }

        if(payment === 'BTR') {

            if(params.has('success') && params.has('mailSent')) {

                const success = params.get('success');
                const mailSent = params.get('mailSent');

                if(success === 'true' && mailSent === 'true') {
                    fcns.createModal('Odesláno', 'Objednávka byla odeslána. <em>Byl vám zaslán mail s pokyny k platbě.</em>', 'OK', true)
                }

                if(success === 'true' && mailSent === 'false') {
                    fcns.createModal('Nepovedlo se odeslat e-mail', '<em> Objednávku jsme zaregistrovali, ale nepodařil se odeslat mail s informacemi k platbě. Prosím, kontaktujte mě na adrese keramikarosice@seznam.cz </em>', 'OK', true)
                }

                if(success === 'false' && mailSent === 'true') {
                    fcns.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

                if(success === 'false' && mailSent === 'false') {
                    fcns.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

            }
            
        }

        if(payment === 'DOB') {
            
            if(params.has('success') && params.has('mailSent')) {

                const success = params.get('success');
                const mailSent = params.get('mailSent');

                if(success === 'true' && mailSent === 'true') {
                    fcns.createModal('Úspěch', 'Objednávka proběhla úspěšně. Faktura vám přišla na mail.', 'OK')
                }

                if(success === 'true' && mailSent === 'false') {
                    fcns.createModal('Úspěch', 'Objednávka proběhla úspěšně', 'OK')
                }

                if(success === 'false' && mailSent === 'true') {
                    fcns.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat.', 'OK')
                }

                if(success === 'false' && mailSent === 'false') {
                    fcns.createModal('Chyba', 'Nastala chyba, objednávku se nepodařilo odeslat..', 'OK')
                }
            }
            
        }
    }

    /////
    // MENU
    /////

    // Select hamburger button and attach click listener
    const hamburgerBtn = state.hamburgerBtn = document.querySelector("#hamburger-btn");
    const headerList = hamburgerBtn.nextElementSibling;
    const headerBackDrop = document.querySelector('.header__backdrop');

    const toggleHeader = (e) => {
        e.stopPropagation();

        if(![hamburgerBtn.classList].includes('header__nav-button--hiding')) {

            fcns.showOrHideEl(hamburgerBtn, 'header__nav-button--show', 'header__nav-button--hide', 'header__nav-button--hiding');
            fcns.showOrHideEl(headerList, 'header__nav-list--hidden', 'header__nav-list--visible', 'header__nav-list--hiding');
            fcns.showOrHideEl(headerBackDrop, 'header__backdrop--hidden', 'header__backdrop--visible', 'header__backdrop--hiding');

            for (const listItem of headerList.children) {
                fcns.showOrHideEl(listItem, 'header__nav-item--hidden', 'header__nav-item--visible', 'header__nav-item--hiding');
            }
        }
    }
    headerBackDrop.addEventListener('click', toggleHeader);
    hamburgerBtn.addEventListener("click", toggleHeader);

    ///// Initial update cart amount
    
    const cartAmountEl = document.querySelector('.header__cart-amount');
    const cartAmount = +cartAmountEl.textContent;
    if(cartAmount > 0) {
        cartAmountEl.style.display = 'flex';
    }

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
    // CART & ORDER
    /////

    ///// Submit button event listener
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', ajax.orderSubmitHandler);

        fcns.updateCartPage();
    }


    // Agreement checkbox event listeners 
    
    const agreeGDPR = document.getElementById('agree-gdpr');
    const agreeConditions = document.getElementById('agree-conditions');
    const submitToCartBtn = document.getElementById('submit-order');
    if(orderForm) {
        [agreeGDPR, agreeConditions].forEach(el => el.addEventListener('click', () => {
            el.blur();
        }))
        agreeGDPR.addEventListener('change', () => {
            fcns.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        })
        agreeConditions.addEventListener('change', () => {
            fcns.refreshSubmitBtn(agreeGDPR, agreeConditions, submitToCartBtn);
        });
    }

    ///// Input Validation
    if(orderForm) {
        for (const input of formELs) {
            input.addEventListener('input', fcns.validateInput.bind(this, input));
        }
    }

    /////DOB Price is 0 when OOD is selected
    if(orderForm) {

        const orderDelivery = document.getElementById('order-delivery');
        const OODInput = document.getElementById('OOD');
        const DOBpriceEl = document.getElementById('DOBprice');
        const DOBpriceValue = DOBpriceEl.textContent;

        if (OODInput.checked) {
            DOBpriceEl.textContent = '0Kč'
        } else {
            DOBpriceEl.textContent = DOBpriceValue;
        }

        orderDelivery.addEventListener('input', () => {

            if (OODInput.checked) {
                DOBpriceEl.textContent = '0Kč'
            } else {
                DOBpriceEl.textContent = DOBpriceValue;
            }

        });

    }
    

    //// Managing cart items
    const cartItems = document.querySelectorAll('.cart-item');

    if(orderForm) {

        const frogAudio = new Audio('/img/frogAudio.mp3');
        orderForm.querySelector('#firstName').addEventListener('input', fcns.easterTime.bind(this, frogAudio));

        for(const cartItem of cartItems) {

            const addButton = cartItem.querySelector('.cart-item__amount-box__btn--add');
            const removeButton = cartItem.querySelector('.cart-item__amount-box__btn--remove');
            const removeAllButton = cartItem.querySelector('.close-button');

            addButton.addEventListener('click', async () => {

                const postCartData = {
                    action: 'ADD',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: 1
                }
                
                fcns.addToCart(postCartData).then((updatedCart) => {
                    fcns.updateCartItem(cartItem, updatedCart);
                });
            });
            removeButton.addEventListener('click', () => {

                const postCartData = {
                    action: 'REMOVE',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: 1
                }
                
                fcns.removeFromCart(postCartData).then((updatedCart) => {
                    fcns.updateCartItem(cartItem, updatedCart);

                    
                });
            })
            removeAllButton.addEventListener('click', () => {

                const postCartData = {
                    action: 'REMOVE',
                    productId: cartItem.dataset.productid,
                    csrf: cartItem.dataset.csrf,
                    amount: false
                }

                fcns.removeFromCart(postCartData).then( (updatedCart) => {
                    fcns.updateCartItem(cartItem, updatedCart);
                })

            })
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
                    amount: btn.parentElement.querySelector('select').value
                }

                fcns.addToCart(postCartData).then((updatedCart) => {
                    fcns.updateCartIcon(updatedCart);
                }).catch(err => console.log(err));
                
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
                fcns.switchClass(btn, 'category-select__button--show', 'category-select__button--hide');
                // shows or removes the subcategory list
                if(list) {fcns.showOrHideEl(list, 'category-select__subcategory-list--hidden', 'category-select__subcategory-list--visible', 'category-select__subcategory-list--hiding');}
            });
        }

        ///// PRODUCT MODAL
        const products = document.querySelectorAll('.product');

        for (const prod of products) {
            const btnShowProdModal = prod.querySelector('.product__info .to-cart-button');
            const btnCloseProdModal = prod.querySelector('.product__modal__close-button');
            const modal = prod.querySelector('.product__modal');
            const btnAddToCart = modal.querySelector('.to-cart-button');
            
            btnShowProdModal.addEventListener('click', () => {
                // Shows product modal
                fcns.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');

                // Removing focus from the showProdModal button
                btnShowProdModal.blur();

                 // Focusing the modal, so the keydown event can be registered on it
                modal.focus();
            });
            btnCloseProdModal.addEventListener('click', () => {
                // Hides product modal
                fcns.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            });   
            btnAddToCart.addEventListener('click', () => {
                // Hides product modal
                fcns.switchClass(modal, 'product__modal--toggled', 'product__modal--hidden');
            })   
            modal.addEventListener('click', () => {
                // Focusing the, so the keydown event can be registered on it
                modal.focus();
            })
            modal.addEventListener('keydown', (e) => {
                // If the user pressed enter, simulating click on the add-to-cart button
                if(e.key === 'Enter') {
                    btnAddToCart.click();
                }
             })
            
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
            fcns.showOrHideEl(categorySelectList, 'category-select__category-list--hidden', 'category-select__category-list--visible', 'category-select__category-list--hiding');
            fcns.showOrHideEl(categorySelectHeading, 'heading-2--hidden', 'heading-2--visible', 'heading-2--hiding');
            fcns.showOrHideEl(categorySelectBackdrop, 'category-select__backdrop--hidden', 'category-select__backdrop--visible', 'category-select__backdrop--hiding');
            fcns.switchClass(categorySelectMobileBtn, 'category-select__mobile-button--show', 'category-select__mobile-button--hide');
    
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


  