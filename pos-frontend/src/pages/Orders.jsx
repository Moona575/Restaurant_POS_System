import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, modifyOrder } from "../https";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const [status, setStatus] = useState("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    placeholderData: [],
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      modifyOrder(orderId, { orderStatus }),
    onSuccess: () => queryClient.invalidateQueries(["orders"]),
    onError: () =>
      enqueueSnackbar("Failed to update order status!", { variant: "error" }),
  });

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => modifyOrder(orderId, { orderStatus: "Canceled" }),
    onSuccess: () => queryClient.invalidateQueries(["orders"]),
    onError: () =>
      enqueueSnackbar("Failed to cancel order!", { variant: "error" }),
  });

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const filteredOrders =
    resData?.data?.data?.filter((order) => {
      if (status === "all") return true;
      if (status === "progress") return order.orderStatus === "In Progress";
      if (status === "ready") return order.orderStatus === "Ready";
      if (status === "completed") return order.orderStatus === "Completed";
      return true;
    }) || [];

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide px-4 sm:px-6 md:px-10 py-4">
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
            Orders
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {[
            { key: "all", label: "All" },
            { key: "progress", label: "In Progress" },
            { key: "ready", label: "Ready" },
            { key: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatus(tab.key)}
              className={`text-[#ababab] text-sm sm:text-base ${
                status === tab.key ? "bg-[#383838]" : ""
              } rounded-lg px-3 sm:px-5 py-1 sm:py-2 font-semibold`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto scrollbar-hide h-[calc(100vh-14rem)]">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="col-span-1 text-gray-500">No orders available</p>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
