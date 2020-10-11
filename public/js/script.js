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

/////
// Header functions
/////
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
  hamburgerBtn.addEventListener(
    "click",
    hamburgerBtnClickHandler.bind(this, hamburgerBtn)
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

//
