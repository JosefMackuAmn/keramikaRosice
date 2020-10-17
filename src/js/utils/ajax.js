export const postCart = async ({ action, csrf, amount, productId }) => {
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