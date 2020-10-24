class Cart {
    constructor(items = [], total = 0, shippingCostId = 0) {
        this.items = items;
        this.total = total;
        this.shippingCostId = shippingCostId; // 0 === cheper shipping && 1 === more expensive shipping
    }

    add(product, amount) {
        const itemIndex = this.items.findIndex(item => item.product._id.toString() === product._id.toString());
        if (itemIndex > -1) {
            this.items[itemIndex] = {
                product: product,
                amount: +this.items[itemIndex].amount + +amount
            }
        } else {
            this.items.push({
                product: product,
                amount: +amount
            });
        }
        this.total = +this.total + +product.price * +amount;
        if (this.shippingCostId === 0 && product.shippingCostId === 1) {
            this.shippingCostId = 1;
        }
    }
    
    remove(product, amount) {
        console.log('here');
        const itemIndex = this.items.findIndex(item => item.product._id.toString() === product._id.toString());
        if (itemIndex === -1) return;

        if (!amount || +amount >= +this.items[itemIndex].amount) {
            const removedProduct = this.items.splice(itemIndex, 1)[0];
            console.log(removedProduct);
            this.total = +this.total - (+removedProduct.product.price * +removedProduct.amount);
            let newShippingCostId = 0;
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].product.shippingCostId === 1) {
                    newShippingCostId = 1;
                    break;
                }
            }
            this.shippingCostId = newShippingCostId;
            return removedProduct;
        }

        this.items[itemIndex] = {
            ...this.items[itemIndex],
            amount: +this.items[itemIndex].amount - +amount
        }
        this.total = +this.total - (+this.items[itemIndex].product.price * +amount);

        return this.items[itemIndex];
    }
};

module.exports = Cart;

/* items: [{
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    amount: Number
}],
total: Number,
shippingCostId: Number */