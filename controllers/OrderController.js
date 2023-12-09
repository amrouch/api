const Order = require("../models/OrderModel")
const Product = require("../models/ProductModel")

const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const products = req.body.products;

        if (!products || products.length === 0) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        let totalPrice = 0;
        const orderProducts = [];

        for (const productInfo of products) {
            const { productId, quantity } = productInfo;
            const product = await Product.findById(productId).populate('name price');;

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ error: `Insufficient quantity for product with ID ${productId}` });
            }

            const productTotalPrice = quantity * product.price;
            totalPrice += productTotalPrice;

            orderProducts.push({
                product: productId,
                quantity: quantity,
            });

            product.quantity -= quantity;
            await product.save();
        }

        const order = new Order({
            user: userId,
            products: orderProducts,
            totalPrice: totalPrice,
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully' });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ error: 'Products array is required' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }

        let newTotalPrice = 0;
        const updatedOrderProducts = [];

        for (const productInfo of products) {
            const { productId, quantity } = productInfo;

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({ error: `Insufficient quantity for product with ID ${productId}` });
            }

            const productTotalPrice = quantity * product.price;
            newTotalPrice += productTotalPrice;

            updatedOrderProducts.push({
                product: productId,
                quantity: quantity,
            });

            product.quantity -= quantity;
            await product.save();
        }

        order.products = updatedOrderProducts;
        order.totalPrice = newTotalPrice;

        await order.save();

        res.status(200).json({ message: 'Order updated successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const getOrder = await Order.findById(req.params.id).populate('products.product', 'name price');
        if (!getOrder) {
            return res.status(404).json({ error: `Order with ID ${req.params.id} not found` });
        }
        res.json(getOrder);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getOrders = async (req, res, next) => {
    try {
        const getAllOrders = await Order.find({}).populate('products.product', 'name price');;
        res.json(getAllOrders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const getByClient = async (req, res, next) => {
    const user = req.params.id;
    try {
        const orders = await Order.find({ user: user })
            .populate('products.product', 'name price');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: `No orders found for client ${user}` });
        }

        res.json(orders);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const OrderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(OrderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
        next(err);
    }
}
module.exports = {
    createOrder,
    updateOrder,
    getOrder,
    getOrders,
    getByClient,
    deleteOrder
}