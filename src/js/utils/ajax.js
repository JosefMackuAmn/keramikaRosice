import * as fcns from './functions';
import {formELs}  from './data';

export const postCartHandler = async ({ action, csrf, amount, productId }) => {
    switch (action) {
        case 'ADD':
        case 'REMOVE':

            // Create body object
            const bodyObj = {
                action: action,
                amount: amount,
                productId: productId
            };
            
            console.log(bodyObj);

            // Send request
            return fetch('/kosik', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrf,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            }).then(res => {
                return Promise.all([res, res.json()]);
            }).then(promises => {
                const [ response, body ] = promises;
                if (!(response.ok && response.status >= 200 && response.status < 300)) {

                    throw new Error(body.msg);
                }
                const updatedCart = body.cart;                
                return updatedCart;
            }).catch(err => {
                throw new Error(err);
            });

            break;
        default: throw new Error('Non-existing cart action');
    }
}

export const orderSubmitHandler = e => {

    ///// Validatings input values 

    const emailValue = fcns.validateInput(formELs.email);
    const firstNameValue = fcns.validateInput(formELs.firstName);
    const lastNameValue = fcns.validateInput(formELs.lastName);
    const phoneValue = fcns.validateInput(formELs.phone);
    const streetValue = fcns.validateInput(formELs.street);
    const cityValue = fcns.validateInput(formELs.city);
    const zipCodeValue = fcns.validateInput(formELs.zipCode);
    const deliveryValue = fcns.validateInput(formELs.delivery);
    const paymentValue = fcns.validateInput(formELs.payment);

    // If validation has failed (at least one element has class 'invalid'), returning
    
    if (document.querySelector('.invalid')) {
        e.preventDefault();
        return;
    }
       
    // Show spinner on submit button
    const submitBtn = e.target.elements.order_submit;
    const submitBtnText = submitBtn.textContent;
    submitBtn.textContent = "";
    submitBtn.classList.add('loading');

    ///// Handle getting stripe session id and stripe redirection
    if (paymentValue === 'CRD') {
        e.preventDefault();

        // Get form elements and stripe public key
        const stripePublicKey = e.target.dataset.stripepublickey;
        const formEls = e.target.elements;

        // Initialize stripe
        const stripe = Stripe(stripePublicKey);
        
        // Create new form data
        const formData = new FormData();
        formData.append('_csrf', formEls._csrf.value);
        formData.append('firstName', firstNameValue);
        formData.append('lastName', lastNameValue);
        formData.append('email', emailValue);
        formData.append('phone', phoneValue);
        formData.append('street', streetValue);
        formData.append('city', cityValue);
        formData.append('delivery', deliveryValue);
        formData.append('payment', paymentValue);
        formData.append('zipCode', zipCodeValue);

        // Fetch POST /objednavka, expecting json
        fetch('/objednavka', {
            method: 'POST',
            body: formData
        }).then(res => {
            return res.json();
        }).then(session => {
            return stripe.redirectToCheckout({ sessionId: session.id });
        }).then(result => {
            if (result.error) {
                fcns.createModal('Nastala chyba', 'Platba se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz', 'OK');
            }
        }).catch(err => {
            fcns.createModal('Nastala chyba', 'Objednávka se nezdařila, prosím kontaktujte mě na e-mailu keramikarosice@seznam.cz', 'OK');
        }).finally(() => {
            submitBtn.textContent = submitBtnText;
            submitBtn.classList.remove('loading');
        })
    }
}


