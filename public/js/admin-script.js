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
const onDeleteCategory = () => {
    // Hide modal
    state.modalEls.modal.style.display = 'none';

    // Get data model for which is modal shown
    const dataModel = state.modalEls.modal.dataset.model;

    switch (dataModel) {
        case 'categories':
            const csrf = modal.querySelector('#csrf').value;

            // Get dataset values of selected element
            const categoryId = state.selectedElement.dataset.categoryid;
            const subcategoryId = state.selectedElement.dataset.subcategoryid;
            
            // Ask to confirm destructive action
            const isConfirmed = confirm('Opravdu chcete smazat kategorii? Všechny produkty, které do ní spadaly, budou nezařazeny.');
            if (!isConfirmed) {
                // Close modal
                onCloseModal();

                return;
            }

            // Set endpoint
            let endpointStr = '/admin/categories/' + categoryId;
            if (subcategoryId) endpointStr = '/admin/categories/sub/' + subcategoryId;

            // Delete (sub)category
            fetch(endpointStr, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'CSRF-Token': csrf
                }
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
                        // DELETE DELETED CATEGORY -----------------------------------------------
                    } else {
                        throw new Error(json.msg); // SHOW ERROR MODAL --------------------------
                    }
                })
                .catch(err => {
                    console.log(err); // SHOW ERROR MODAL --------------------------
                });
        break;
        default: throw new Error('Data model extracted from modal dataset does not exist'); // SHOW ERROR MODAL --------------------------
    }

    // Close modal
    onCloseModal();
}

// Modal fcns
const onShowModal = () => {
    if (!state.editMode) {
        // If in "add" mode
        state.modalEls.modalHeading.innerText = "Přidat kategorii";
    } else {
        // If in "edit" mode
        state.modalEls.modalHeading.innerText = "Upravit kategorii";

        // Disable selecting higher order category
        state.modalEls.modal.querySelector('#categoryId').setAttribute('disabled', true);

        // Add delete button
        state.modalEls.modalDelete = document.createElement("button");
        state.modalEls.modalDelete.classList = "modal__btn modal__btn--danger";
        state.modalEls.modalDelete.setAttribute('id', 'modal-delete');
        state.modalEls.modalDelete.innerText = "Smazat";
        state.modalEls.modalDelete.addEventListener('click', onDeleteCategory);

        // Get dataset values
        const nameAttr = state.selectedElement.dataset.name;
        const categoryId = state.selectedElement.dataset.categoryid;
        const subcategoryId = state.selectedElement.dataset.subcategoryid;

        // Adjust modal for selected element
        state.modalEls.modal.querySelector('#categoryName').value = nameAttr;
        if (subcategoryId) {
            state.modalEls.modal.querySelector('#categoryId').querySelector(`[value="${categoryId}"]`).setAttribute('selected', 'selected');
        }
        
        state.modalEls.modalAction.insertAdjacentElement('afterend', state.modalEls.modalDelete); 
    }

    state.modalEls.modal.style.display = 'block';
}

onCloseModal = () => {
    // Hide modal
    state.modalEls.modal.style.display = 'none';

    // Enable selecting higher order category
    state.modalEls.modal.querySelector('#categoryId').removeAttribute('disabled');

    // Reset modal
    state.modalEls.modal.querySelector('#categoryId').querySelectorAll('option').forEach(option => option.removeAttribute('selected'));
    state.modalEls.modal.querySelector('#categoryId').querySelector('[value=""]').setAttribute('selected', 'selected');

    // Clean up state
    if (state.modalEls.modalDelete) {
        state.modalEls.modalDelete.remove();
        state.modalEls.modalDelete = undefined;
    }

    // Clean up state
    state.selectedElement = undefined;
    
}

onSaveModal = () => {
    // Hide modal
    state.modalEls.modal.style.display = 'none';

    // Get data model for which is modal shown
    const dataModel = state.modalEls.modal.dataset.model;

    switch (dataModel) {
        case 'categories':
            // Get input values
            let categoryId = modal.querySelector('#categoryId').value;
            !categoryId ? categoryId = null : null;
            const categoryName = modal.querySelector('#categoryName').value;
            const csrf = modal.querySelector('#csrf').value;

            console.log(categoryId);

            if (!state.editMode) {
                // Add new (sub)category
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
                // Update (sub)category

                // Get dataset values of selected element
                const categoryId = state.selectedElement.dataset.categoryid;
                const subcategoryId = state.selectedElement.dataset.subcategoryid;

                // Create body for request
                const bodyObj = { newCategoryName: categoryName };

                let endpointStr = '/admin/categories';
                if (subcategoryId) {
                    endpointStr = '/admin/categories/sub';
                    bodyObj.subcategoryId = subcategoryId;
                } else {
                    bodyObj.categoryId = categoryId;
                }

                // Update
                fetch(endpointStr, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'CSRF-Token': csrf
                    },
                    body: JSON.stringify(bodyObj)
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
                            // RENDER UPDATED CATEGORY -----------------------------------------------
                        } else {
                            throw new Error(json.msg); // SHOW ERROR MODAL --------------------------
                        }
                    })
                    .catch(err => {
                        console.log(err); // SHOW ERROR MODAL --------------------------
                    });
            }
        break;
        default: throw new Error('Data model extracted from modal dataset does not exist'); // SHOW ERROR MODAL --------------------------
    }

    // Close modal
    onCloseModal();
}

///////////////////////////////////
///// DEFINE STATE
const state = {
    // Modal elements
    modalEls: null,
    // Is modal editing or creating
    editMode: undefined,
    // Which element is currently selected (important for its dataset)
    selectedElement: undefined
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
        // Find modal elements
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

        // Put modal elements into global state
        state.modalEls = modalEls;
    
        // On cancelling modal
        modalEls.modalClose.addEventListener('click', onCloseModal);
        modalEls.modalCancel.addEventListener('click', onCloseModal);
    
        // On saving modal
        modalEls.modalAction.addEventListener('click', onSaveModal);

        // Add listener to add category button
        addCategoryBtn.addEventListener('click', () => {
            state.editMode = false;
            return onShowModal();
        });

        // Add event listeners to edit buttons
        Array.from(document.querySelectorAll('.category-box__edit-btn')).forEach(btn => {
            btn.addEventListener('click', () => {
                state.editMode = true;
                state.selectedElement = btn;
                return onShowModal();
            });
        })
    }
});