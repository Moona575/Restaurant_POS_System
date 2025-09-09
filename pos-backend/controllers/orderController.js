const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      orderStatus: "In Progress"
    }).populate("table");

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};
// NEW: Complete Order method
const completeOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // full order object including payment, status, items, bills

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Order completed successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// orderController.js

const modifyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const order = await Order.findById(id);
    if (!order) {
      return next(createHttpError(404, "Order not found!"));
    }

    // 🟢 FIX: Directly replace the existing items with the new ones from the request body.
    // This is because the frontend (Redux cart) is the single source of truth for the list of items.
    if (updateData.items) {
      order.items = updateData.items;
    }

    // Update other fields
    if (updateData.customerDetails) order.customerDetails = updateData.customerDetails;
    if (updateData.bills) order.bills = updateData.bills;
    if (updateData.orderStatus) order.orderStatus = updateData.orderStatus;
    if (updateData.paymentMethod) order.paymentMethod = updateData.paymentMethod;
    if (updateData.table) order.table = updateData.table;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order modified successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
const deleteOrderItem = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(createHttpError(404, "Order not found!"));
    }

    // Filter out the item to be deleted
    order.items = order.items.filter((item) => item.id.toString() !== itemId);

    // Recalculate bills if necessary (recommended)
    // You might need to add logic here to re-sum the total, tax, etc.

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item deleted from order successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { addOrder, getOrderById, getOrders, updateOrder, completeOrder ,modifyOrder, deleteOrderItem};
