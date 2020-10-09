//HEADER
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
//
