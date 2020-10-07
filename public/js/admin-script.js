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
/////
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
// General functions
/////
const showErrorModal = (error) => {
    // Expects string with an error message or error object with msg or message property
    let message;
    if (typeof error === 'string') {
        message = error;
    }
    if (!message) {
        message = error.message || error.msg;
    }

    const errorModalHTML = `
    <section class="err-modal">
        <h4 class="heading-4">Vyskytla se chyba</h4>
        <p>Celá zpráva: ${message}</p>
    </section>
    `;

    document.querySelector('html').insertAdjacentHTML('afterbegin', errorModalHTML);

    setTimeout(() => {
        document.querySelector('.err-modal').remove();
    }, 10000);
}

/////
// Submit functions
/////
const onDeleteProduct = (e) => {
    const isConfirmed = confirm('Opravdu chcete smazat produkt?');
    if (!isConfirmed) return;

    const productId = e.target.dataset.id;
    const csrf = e.target.dataset.csrf;

    fetch('/admin/products/' + productId + '?_csrf=' + csrf, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok === true) {
                document.getElementById(productId).remove();
            } else {
                throw new Error('Deleting was not successfull');
            }
        })
        .catch(err => {
            showErrorModal(err);
        });
}
const onDeleteModal = () => {
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
                        // Refresh after success
                        window.location.href = '/admin/categories?success=true';
                    } else {
                        throw new Error(json.msg);
                    }
                })
                .catch(err => {
                    showErrorModal(err);
                });
        break;
        default:
            const err = new Error('Data model extracted from modal dataset does not exist');
            showErrorModal(err);
            throw err;
    }

    // Close modal
    onCloseModal();
}

/////
// Modal fcns
/////
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
        state.modalEls.modalDelete.addEventListener('click', onDeleteModal);

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
                            // Refresh after success
                            window.location.href = '/admin/categories?success=true';
                        } else {
                            throw new Error(json.msg);
                        }
                    })
                    .catch(err => {
                        showErrorModal(err);
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
                            // Refresh after success
                            window.location.href = '/admin/categories?success=true';
                        } else {
                            throw new Error(json.msg);
                        }
                    })
                    .catch(err => {
                        showErrorModal(err);
                    });
            }
        break;
        default:
            const err = new Error('Data model extracted from modal dataset does not exist');
            showErrorModal(err);
            throw err;
    }

    // Close modal
    onCloseModal();
}

/////
// Product form functions
/////
const onSelectCategory = () => {
    // Retrieve all subcategories from dataset and currently selected categoryId
    const allSubcategories = JSON.parse(state.prodFormEls.inpSubcategory.dataset.subcategories);
    const categoryId = state.prodFormEls.inpCategory.value;

    // Clean up last options
    state.prodFormEls.inpSubcategory.innerHTML = "";
    state.prodFormEls.inpSubcategory.setAttribute('disabled', true);
    // Readd default option element
    const defaultOptionElement = document.createElement('option');
    defaultOptionElement.setAttribute('value', "");
    defaultOptionElement.innerText = "Vyberte podkategorii";
    state.prodFormEls.inpSubcategory.insertAdjacentElement('beforeend', defaultOptionElement);


    const curSubcategories = allSubcategories[categoryId];
    if (!curSubcategories) return;
    if (curSubcategories.length > 0) {
        curSubcategories.forEach(subcategory => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', subcategory._id);
            optionElement.innerText = subcategory.name;
            
            state.prodFormEls.inpSubcategory.insertAdjacentElement('beforeend', optionElement);
            state.prodFormEls.inpSubcategory.removeAttribute('disabled');
        })
    }
}

///////////////////////////////////
///// DEFINE STATE
const state = {
    // Modal elements
    modalEls: null,
    // Is modal editing or creating
    editMode: undefined,
    // Which element is currently selected (important for its dataset)
    selectedElement: undefined,
    // Product form elements
    prodFormEls: null
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

    // Try to find #product-form
    const productForm = document.getElementById('product-form');
    if (productForm) {
        // Get inputs
        const inpCategory = productForm.querySelector('#categoryId');
        const inpSubcategory = productForm.querySelector('#subcategoryId');

        const prodFormEls = {
            inpCategory,
            inpSubcategory
        }

        // Put form elements into global state
        state.prodFormEls = prodFormEls;

        // Listen for change in category select to display matching subcategories
        inpCategory.addEventListener('change', onSelectCategory);
    }
});