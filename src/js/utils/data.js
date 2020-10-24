////
//SUBMIT
//
const orderForm = document.getElementById('order-form');

export const formELs = orderForm ? orderForm.elements : undefined;

export const RegexMap = orderForm ? new Map([
    [formELs.email, /^[a-zA-Z0-9!#$_*?^{}~-]+(\.[a-zA-Z0-9!#$_*?^{}~-]+)*@([a-zA-Z-]+\.)+[a-zA-z]{2,}$/],
    [formELs.firstName, /^[a-zA-ZčČďĎňŇřŘšŠťŤáéíóúůýě]{2,}$/],
    [formELs.lastName, /^[a-zA-ZčČďĎňŇřŘšŠťŤáéíóúůýě]{2,}$/],
    [formELs.phone, /^[0-9]{9}$/],
    [formELs.street, /(.+){2,}/],
    [formELs.city, /(.+){2,}/],
    [formELs.zipCode, /[0-9]{5}/],
    [formELs.delivery, /(ZAS|POS|OOD)/],
    [formELs.payment, /(DOB|CRD|BTR)/]
]
) : undefined;



export  const otherArgsMap = orderForm ? new Map([
    // [input, [markedElId, removeWhiteSpace]]
    [formELs.phone, [undefined, true]],
    [formELs.zipCode, [undefined, true]],
    [formELs.payment, ['order-payment']],
    [formELs.delivery, ['order-delivery']]
]) : undefined;