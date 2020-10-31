exports.getDelPayLabel = (deliveryMethod, paymentMethod) => {

    let deliveryLabel, paymentLabel;

    switch(deliveryMethod) {
        case 'ZAS': deliveryLabel = 'Zásilkovna';
        break;
        case 'POS': deliveryLabel = 'Česká pošta';
        break;
        case 'OOD': deliveryLabel = 'Osobní odběr';
        break;
        case 'ADR': deliveryLabel = 'Doručení na adresu (DPD)';
        break;
        default: deliveryLabel = '';
    }

    switch(paymentMethod) {
        case 'DOB': paymentLabel = 'Dobírka';
        break;
        case 'BTR': paymentLabel = 'Bankovní převod';
        break;
        case 'CRD': paymentLabel = 'Kartou online';
        break;
        default: paymentLabel = '';
    }

    return [deliveryLabel, paymentLabel];
}

exports.formatDate = (date) => {
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
}