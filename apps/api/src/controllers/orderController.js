const mongoose = require('mongoose');
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const memoryStore = require('../models/memoryStore');

/**
 * Create Order & Lock Inventory (Checkout)
 * POST /api/v1/orders
 * Access: Customer & Admin
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, paymentToken } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one artwork piece.' });
        }

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
            return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;
        let orderItems = [];
        let calculatedTotalCents = 0;

        if (isMongoConnected) {
            for (const item of items) {
                const artId = typeof item === 'string' ? item : (item.id || item.artworkId || item._id);
                let artwork = null;

                if (mongoose.Types.ObjectId.isValid(artId)) {
                    artwork = await Artwork.findById(artId);
                }
                if (!artwork) {
                    artwork = await Artwork.findOne({ artworkId: artId });
                }

                if (!artwork) {
                    return res.status(404).json({ success: false, message: `Artwork item [${artId}] not found.` });
                }

                // Inventory Invariant Lock: Ensure artwork is AVAILABLE
                if (artwork.status !== 'AVAILABLE' || artwork.stock <= 0) {
                    return res.status(409).json({
                        success: false,
                        message: `Acquisition Conflict: Artwork [${artwork.title}] is no longer available (Current Status: ${artwork.status}).`
                    });
                }

                // Lock original physical piece to RESERVED
                artwork.status = 'RESERVED';
                artwork.stock = 0;
                await artwork.save();

                const framingPrice = Number(item.framingPriceCents) || 0;
                orderItems.push({
                    artwork: artwork._id,
                    artworkId: artwork.artworkId,
                    title: artwork.title,
                    priceCents: artwork.priceCents,
                    medium: artwork.medium,
                    framing: item.framing || artwork.framingOptions,
                    framingPriceCents: framingPrice
                });

                calculatedTotalCents += (artwork.priceCents + framingPrice);
            }

            // Simulate Payment Processing for Stripe Card or COD
            const selectedMethod = paymentMethod === 'CASH_ON_DELIVERY' ? 'CASH_ON_DELIVERY' : 'STRIPE_CARD';
            const paymentStatus = selectedMethod === 'STRIPE_CARD' ? 'COMPLETED' : 'PENDING';

            const order = await Order.create({
                customer: req.user._id,
                items: orderItems,
                totalCents: calculatedTotalCents,
                shippingAddress,
                paymentMethod: selectedMethod,
                paymentStatus,
                shippingStatus: 'PENDING',
                trackingNumber: `AG-${Math.floor(100000 + Math.random() * 900000)}`
            });

            return res.status(201).json({
                success: true,
                message: 'Order placed successfully. Artwork inventory locked.',
                order,
                data: order
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            for (const item of items) {
                const artId = typeof item === 'string' ? item : (item.id || item.artworkId || item._id);
                const artwork = memoryStore.findArtworkById(artId);

                if (!artwork) {
                    return res.status(404).json({ success: false, message: `Artwork item [${artId}] not found.` });
                }

                if (artwork.status !== 'AVAILABLE' || artwork.stock <= 0) {
                    return res.status(409).json({
                        success: false,
                        message: `Acquisition Conflict: Artwork [${artwork.title}] is no longer available (Current Status: ${artwork.status}).`
                    });
                }

                // Lock inventory in memoryStore
                memoryStore.updateArtwork(artwork.artworkId || artwork._id, {
                    status: 'RESERVED',
                    stock: 0
                });

                const framingPrice = Number(item.framingPriceCents) || 0;
                orderItems.push({
                    artwork: artwork._id || artwork.id,
                    artworkId: artwork.artworkId,
                    title: artwork.title,
                    priceCents: artwork.priceCents,
                    medium: artwork.medium,
                    framing: item.framing || artwork.framingOptions,
                    framingPriceCents: framingPrice
                });

                calculatedTotalCents += (artwork.priceCents + framingPrice);
            }

            const selectedMethod = paymentMethod === 'CASH_ON_DELIVERY' ? 'CASH_ON_DELIVERY' : 'STRIPE_CARD';
            const paymentStatus = selectedMethod === 'STRIPE_CARD' ? 'COMPLETED' : 'PENDING';

            const order = memoryStore.addOrder({
                customer: req.user.id || req.user._id,
                customerName: req.user.name,
                items: orderItems,
                totalCents: calculatedTotalCents,
                shippingAddress,
                paymentMethod: selectedMethod,
                paymentStatus,
                shippingStatus: 'PENDING',
                trackingNumber: `AG-${Math.floor(100000 + Math.random() * 900000)}`
            });

            return res.status(201).json({
                success: true,
                message: 'Order placed successfully. Artwork inventory locked.',
                order,
                data: order
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get Authenticated Customer Orders
 * GET /api/v1/orders/my-orders
 * Access: Customer
 */
exports.getMyOrders = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const orders = await Order.find({ customer: req.user._id })
                .populate('items.artwork', 'title images medium priceCents')
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const userId = req.user.id || req.user._id;
            const orders = memoryStore.findOrders({ customer: userId });

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get All Gallery Orders (Fulfillment Queue)
 * GET /api/v1/orders
 * Access: Admin Only
 */
exports.getAllOrders = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const orders = await Order.find()
                .populate('customer', 'name email')
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            return res.status(200).json({
                success: true,
                count: memoryStore.orders.length,
                data: memoryStore.orders
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Update Order Shipping / Fulfillment Status
 * PUT /api/v1/orders/:id/status
 * Access: Admin Only
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { shippingStatus, status, trackingNumber, paymentStatus } = req.body;
        const targetStatus = shippingStatus || status;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const order = await Order.findOne({
                $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { orderId: id }]
            });

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            if (targetStatus) {
                order.shippingStatus = targetStatus;
            }
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (paymentStatus) order.paymentStatus = paymentStatus;

            if (targetStatus === 'DELIVERED') {
                order.deliveredAt = new Date();
                // When delivered, transition original artworks to SOLD permanently
                for (const item of order.items) {
                    await Artwork.findByIdAndUpdate(item.artwork, { status: 'SOLD' });
                }
            }

            await order.save();

            return res.status(200).json({
                success: true,
                message: `Order [${order.orderId}] status updated to [${order.shippingStatus}].`,
                order,
                data: order
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const order = memoryStore.orders.find(o => o.orderId === id || o._id === id || o.id === id);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            if (targetStatus) {
                order.shippingStatus = targetStatus;
                order.status = targetStatus;
            }
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (paymentStatus) order.paymentStatus = paymentStatus;

            if (targetStatus === 'DELIVERED') {
                order.deliveredAt = new Date().toISOString();
                for (const item of order.items) {
                    memoryStore.updateArtwork(item.artworkId || item.artwork, { status: 'SOLD' });
                }
            }

            return res.status(200).json({
                success: true,
                message: `Order [${order.orderId}] status updated to [${order.shippingStatus}].`,
                order,
                data: order
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
