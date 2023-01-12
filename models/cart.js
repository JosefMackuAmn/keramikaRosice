const Product = require("./product");

class Cart {
    constructor(items = [], total = 0, shippingCostId = 0) {
        this.items = items;
        this.total = total;
        this.shippingCostId = shippingCostId; // 0 === cheper shipping && 1 === more expensive shipping
    }

    getItemById(product) {
        for (const item of this.items) {
            if (item.product._id.toString() === product._id.toString()) {
                return item;
            }
        }
        return null;
    }

    add(product, amount) {
        const itemIndex = this.items.findIndex(item => item.product._id.toString() === product._id.toString());
        if (itemIndex > -1) {
            const newAmountInCart = +this.items[itemIndex].amount + +amount;
            if (newAmountInCart > product.amountInStock) {
                throw new Error('not enough products in stock');
            }
            this.items[itemIndex] = {
                product: product,
                amount: newAmountInCart
            }
        } else {
            if (amount > product.amountInStock) {
                throw new Error('not enough products in stock');
            }
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
        const itemIndex = this.items.findIndex(item => item.product._id.toString() === product._id.toString());
        if (itemIndex === -1) return;

        if (!amount || +amount >= +this.items[itemIndex].amount) {
            const removedProduct = this.items.splice(itemIndex, 1)[0];
            this.total = +this.total - (+removedProduct.product.price * +removedProduct.amount);

            // Loop through items to determine shippingCostId
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

    async isEnoughProductsInStock() {
        for (const item of this.items) {
            const product = await Product.findById(item.product._id);
            if (product.amountInStock < item.amount) {
                return false;
            }
        }
        return true;
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