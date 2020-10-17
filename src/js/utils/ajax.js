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

            // Send request
            fetch('/kosik', {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrf,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            }).then(res => {
                if (!(res.ok && res.status >= 200 && res.status < 300)) {                
                    return res.json().then(json => {
                        throw new Error(json.msg);
                    });
                }
            }).catch(err => {
                throw new Error(err);
            })

            break;
        default: throw new Error('Non-existing cart action');
    }
}

export const orderSubmitHandler = e => {
    const payment = e.target.elements.payment.value;

    if (payment === 'CRD') {
        e.preventDefault();

        // Get form elements and stripe public key
        const stripePublicKey = e.target.dataset.stripepublickey;
        const formEls = e.target.elements;

        // Initialize stripe
        const stripe = Stripe(stripePublicKey);

        // Create new form data
        const formData = new FormData();
        formData.append('_csrf', formEls._csrf.value);
        formData.append('firstName', formEls.firstName.value);
        formData.append('lastName', formEls.lastName.value);
        formData.append('email', formEls.email.value);
        formData.append('phone', formEls.phone.value);
        formData.append('street', formEls.street.value);
        formData.append('city', formEls.city.value);
        formData.append('delivery', formEls.delivery.value);
        formData.append('payment', formEls.payment.value);
        formData.append('zipCode', formEls.zipCode.value);

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
                // SHOW ERROR MODAL ----------------------------------------------------------------------
            }
        }).catch(err => {
            // SHOW ERROR MODAL ----------------------------------------------------------------------
        })
    }
}