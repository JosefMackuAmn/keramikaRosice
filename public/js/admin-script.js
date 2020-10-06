///////////////////////////////////
///// DEFINING FUNCTIONS

/////
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

/////
// Menu functions
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

/////
// Submit functions
const onDeleteProduct = (e) => {
    const productId = e.target.dataset.id;
    const csrf = e.target.dataset.csrf;

    fetch('/admin/products/' + productId + '?_csrf=' + csrf, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok === true) {
                document.getElementById(productId).remove(); // SHOW SUCCESS MODAL --------------------------
            } else {
                throw new Error('Deleting was not successfull'); // SHOW ERROR MODAL --------------------------
            }
        })
        .catch(err => {
            console.log(err); // SHOW ERROR MODAL --------------------------
        });
}

// Element click functions
const onShowModal = () => {
    state.modalEls.modal.style.display = 'block';
}

onCloseModal = () => {
    // Hide modal
    state.modalEls.modal.style.display = 'none';
}

onSaveModal = () => {
    // Hide modal
    state.modalEls.modal.style.display = 'none';

    const dataModel = state.modalEls.modal.dataset.model;

    switch (dataModel) {
        case 'categories':
            const categoryId = modal.querySelector('#categoryId').value;
            const categoryName = modal.querySelector('#categoryName').value;
            const csrf = modal.querySelector('#csrf').value;

            if (!state.editMode) {
                fetch('/admin/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'CSRF-Token': csrf
                    },
                    body: JSON.stringify({
                        categoryId: categoryId,
                        categoryName: categoryName
                    })
                })
                    .then(response => {
                        return Promise.all([response.clone(), response.json()]);
                    })
                    .then(resolved => {
                        const [res, json] = resolved;
                        console.log(json);
                        console.log(res);
                        if (res.ok === true) {
                            // SHOW SUCCESS MODAL ------------------------------------------------
                            // RENDER NEW CATEGORY -----------------------------------------------
                        } else {
                            throw new Error(json.msg); // SHOW ERROR MODAL --------------------------
                        }
                    })
                    .catch(err => {
                        console.log(err); // SHOW ERROR MODAL --------------------------
                    });
            } else {
        
            }
        break;
        default: throw new Error('Data model extracted from modal dataset does not exist'); // SHOW ERROR MODAL --------------------------
    }
}

///////////////////////////////////
///// Define state
const state = {
    modalEls: null,
    editMode: undefined
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

    // Try to find delete product button
    const deleteProductBtns = document.querySelectorAll('.deleteProductBtn');
    if (deleteProductBtns.length > 0) {
        deleteProductBtns.forEach(button => button.addEventListener('click', onDeleteProduct));
    }

    // Try to find add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        const modal = document.getElementById('modal');
        const modalHeading = modal.querySelector('#modal-heading');
        const modalAction = modal.querySelector('#modal-action');
        const modalClose = modal.querySelector('#modal-close');
        const modalCancel = modal.querySelector('#modal-cancel');

        const modalEls = {
            modal,
            modalHeading,
            modalAction,
            modalClose,
            modalCancel
        }

        state.modalEls = modalEls;

        // Add event listeners for modal elements
        const closeModalListenerFcn = (e) => {
            onCloseModal();
        }
        const saveModalListenerFcn = e => {
            onSaveModal();
        }
    
        // On cancelling modal
        modalEls.modalClose.addEventListener('click', closeModalListenerFcn);
        modalEls.modalCancel.addEventListener('click', closeModalListenerFcn);
    
        // On saving modal
        modalEls.modalAction.addEventListener('click', saveModalListenerFcn);

        addCategoryBtn.addEventListener('click', () => {
            state.editMode = false;
            return onShowModal();
        });
    }
});