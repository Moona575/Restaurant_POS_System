// Bill.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";

import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  completeOrder,
  modifyOrder,
  getOrder
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";
import { useLocation } from "react-router-dom";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const { data: fetchedOrderData, isLoading } = useQuery({
    queryKey: ["order", orderIdFromUrl],
    queryFn: () => getOrder(orderIdFromUrl),
    enabled: !!orderIdFromUrl,
  });

  useEffect(() => {
    if (fetchedOrderData?.data) {
      setOrderInfo(fetchedOrderData.data);
      setOrderPlaced(true);
    }
  }, [fetchedOrderData]);

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);
      setOrderPlaced(true);
      if (data.table) {
        const tableData = {
          status: "Booked",
          orderId: data._id,
          tableId: data.table,
        };
        tableUpdateMutation.mutate(tableData);
      }
      enqueueSnackbar("Order Created!", { variant: "success" });
    },
    onError: (error) => console.log(error),
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onError: (error) => console.log(error),
  });

  const handlePlaceOrder = async () => {
  if (!cartData.length) {
    enqueueSnackbar("Cart data missing!", { variant: "warning" });
    return;
  }

  // Use customer info from Redux if available, otherwise fallback to existing order (for modifications)
  const customerDetails = {
    name:
      customerData.customerName ||
      customerData.name ||
      orderInfo?.customerDetails?.name ||
      "Unknown",
    phone:
      customerData.customerPhone ||
      customerData.phone ||
      orderInfo?.customerDetails?.phone ||
      "0000000000",
    guests:
      customerData.guests ||
      orderInfo?.customerDetails?.guests ||
      1,
  };

  const orderData = {
    customerDetails,
    orderStatus: "In Progress",
    bills: {
      total,
      tax,
      totalWithTax: totalPriceWithTax,
    },
    items: cartData,
    table: customerData.table?.tableId || orderInfo?.table || null,
    paymentMethod: null,
  };

  try {
    if (orderIdFromUrl) {
      // Modify existing order using orderIdFromUrl
      await modifyOrder(orderIdFromUrl, orderData);
      enqueueSnackbar("Order updated successfully!", { variant: "success" });
      setOrderInfo({ ...orderData, _id: orderIdFromUrl });
    } else {
      // Create new order
      orderMutation.mutate(orderData);
    }
  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to place/update order!", { variant: "error" });
  }
};


  const handleCompleteOrder = async () => {
  if (!cartData.length) {
    enqueueSnackbar("Cart data missing!", { variant: "warning" });
    return;
  }

  if (!paymentMethod) {
    enqueueSnackbar("Please select a payment method!", { variant: "warning" });
    return;
  }

  const orderId = orderIdFromUrl;

  if (!orderId) {
    enqueueSnackbar("No active order to complete!", { variant: "warning" });
    return;
  }

  // Use Redux customer data first, fallback to existing orderInfo, then defaults
  const customerDetails = {
    name:
      customerData.customerName ||
      customerData.name ||
      orderInfo?.customerDetails?.name ||
      "Unknown",
    phone:
      customerData.customerPhone ||
      customerData.phone ||
      orderInfo?.customerDetails?.phone ||
      "0000000000",
    guests:
      customerData.guests ||
      orderInfo?.customerDetails?.guests ||
      1,
  };

  const finalOrderData = {
    ...orderInfo, // keep existing order info
    customerDetails,
    orderStatus: "Completed",
    bills: {
      total,
      tax,
      totalWithTax: totalPriceWithTax,
    },
    items: cartData,
    table: customerData.table?.tableId || orderInfo?.table || null,
    paymentMethod,
  };

  try {
    if (paymentMethod === "Online") {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) return enqueueSnackbar("Razorpay SDK failed to load!", { variant: "error" });

      const { data } = await createOrderRazorpay({ amount: totalPriceWithTax.toFixed(2) });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        handler: async (response) => {
          await completeOrder(orderId, {
            ...finalOrderData,
            paymentData: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            },
          });

          enqueueSnackbar("Payment Successful & Order Completed!", { variant: "success" });
          setOrderInfo(finalOrderData);
          setShowInvoice(true);
          setPaymentCompleted(true);

          dispatch(removeAllItems());
          dispatch(removeCustomer());
        },
      };
      new window.Razorpay(options).open();
    } else {
      await completeOrder(orderId, finalOrderData);
      enqueueSnackbar("Order Completed with Cash Payment!", { variant: "success" });
      setOrderInfo(finalOrderData);
      setShowInvoice(true);
      setPaymentCompleted(true);

      dispatch(removeAllItems());
      dispatch(removeCustomer());
    }
  } catch (err) {
    console.error(err);
    enqueueSnackbar("Failed to complete order!", { variant: "error" });
  }
};


  return (
    <>
      {/* Bill Summary */}
      <div className="flex flex-col gap-2 px-3 sm:px-5 mt-2 w-full max-w-3xl mx-auto">
        <div className="flex justify-between text-[#f5f5f5]">
          <p>Items({cartData.length})</p>
          <p>₹{total.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-[#f5f5f5]">
          <p>Tax(5.25%)</p>
          <p>₹{tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-[#f5f5f5] font-bold">
          <p>Total With Tax</p>
          <p>₹{totalPriceWithTax.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Method (show immediately) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 px-3 sm:px-5 mt-4 w-full max-w-3xl mx-auto">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
            paymentMethod === "Cash" ? "bg-[#383737]" : ""
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold ${
            paymentMethod === "Online" ? "bg-[#383737]" : ""
          }`}
        >
          Online
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 px-3 sm:px-5 mt-4 w-full max-w-3xl mx-auto">
        <button
          className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-base sm:text-lg"
          disabled={!paymentCompleted}
        >
          Print Receipt
        </button>
        <button
          onClick={handlePlaceOrder}
          className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-base sm:text-lg"
          disabled={orderMutation.isLoading}
        >
          Place Order
        </button>
        <button
          onClick={handleCompleteOrder}
          className="bg-[#1f7a0a] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-base sm:text-lg"
          disabled={!orderPlaced}
        >
          Complete Order
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;