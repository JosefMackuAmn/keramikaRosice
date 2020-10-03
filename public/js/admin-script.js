///////////////////////////////////
///// DEFINING FUNCTIONS

// ready function to execute when DOM is loaded
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

const toggleMenu = (menu) => {
    if (menu.classList.contains('opened')) {
        menu.classList.remove('opened');
        menu.querySelector('.navigation__heading').style.display = 'block';
        menu.querySelector('.navigation__list').style.display = 'none';
    } else {
        menu.classList.add('opened');
        setTimeout(() => {
            menu.querySelector('.navigation__heading').style.display = 'none';
            menu.querySelector('.navigation__list').style.display = 'block';
        }, 200);
    }    
}

const emphasizeHoveredMenuItem = (menuItems, itemIndex) => {
    menuItems.forEach(menuItem => menuItem.classList.remove('active'));
    if (itemIndex !== -1) menuItems[itemIndex].classList.add('active');
}

///////////////////////////////////
///// CALLING READY FUNCTION
ready(() => {
    const menu = document.getElementById('menu');

    if (menu) {
        const menuItems = Array.from(menu.querySelectorAll('.navigation__item'));
        const activeMenuItemIndex = menuItems.findIndex(item => item.classList.contains('active'));
        
        // Toggle menu on click
        menu.addEventListener('click', toggleMenu.bind(this, menu));

        menuItems.forEach((item, index) => {
            // Emphasize hovered item
            item.addEventListener('mouseenter', emphasizeHoveredMenuItem.bind(this, menuItems, index));
            // Emphasize active page on unhover 
            item.addEventListener('mouseleave', emphasizeHoveredMenuItem.bind(this, menuItems, activeMenuItemIndex));
        });
    }
});