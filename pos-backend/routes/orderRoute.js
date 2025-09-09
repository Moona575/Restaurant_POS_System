const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, completeOrder,modifyOrder,deleteOrderItem  } = require("../controllers/orderController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");



router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
router.route("/complete/:id").put(isVerifiedUser, completeOrder);
router.put("/modify/:id", modifyOrder);
router.delete("/:orderId/item/:itemId", deleteOrderItem);
module.exports = router;