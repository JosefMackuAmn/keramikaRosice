import state from './state';

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
// Header functions
/////
export const resizeHeaderHandler = () => {
    console.log(window.clientX);
    if (document.documentElement.getBoundingClientRect().width > 700) {
        const navList = state.hamburgerBtn.nextElementSibling;

        navList.classList.remove("header__nav-list--shown");
        state.hamburgerBtn.classList.remove("header__nav-button--clicked");
        state.hamburgerBtn.nextElementSibling.removeAttribute('style');

        for(const child of state.hamburgerBtn.nextElementSibling.children) {
            child.style.animation = 'none';
        }
    }
};

export const hamburgerBtnClickHandler = (btn, event) => {
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