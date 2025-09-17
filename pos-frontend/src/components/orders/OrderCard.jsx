import React from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle, FaEdit, FaTrash } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyOrder } from "../../https";

const OrderCard = ({ order }) => {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (id) => modifyOrder(id, { orderStatus: "Canceled" }),
    onSuccess: () => queryClient.invalidateQueries(["orders"]),
  });

  const handleDelete = () => cancelMutation.mutate(order._id);
  const handleEdit = () => (window.location.href = `/menu?orderId=${order._id}`);

  return (
    <div className="bg-[#262626] p-4 rounded-lg w-full flex flex-col gap-4 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg flex-shrink-0">
          {getAvatarName(order.customerDetails.name)}
        </button>

        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">
              #{Math.floor(new Date(order.orderDate).getTime())} / Dine in
            </p>
            <p className="text-[#ababab] text-sm flex items-center gap-1">
              Table <FaLongArrowAltRight className="inline" /> {order.table.tableNo}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg flex items-center gap-1">
                  <FaCheckDouble /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm flex items-center gap-1">
                  <FaCircle className="text-green-600" /> Ready to serve
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg flex items-center gap-1">
                  <FaCircle /> {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm flex items-center gap-1">
                  <FaCircle className="text-yellow-600" /> Preparing your order
                </p>
              </>
            )}

            <div className="flex gap-3 mt-1">
              <FaEdit
                className="text-blue-400 cursor-pointer hover:text-blue-500"
                onClick={handleEdit}
              />
              <FaTrash
                className="text-red-400 cursor-pointer hover:text-red-500"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[#ababab] text-sm">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>

      <hr className="border-gray-500" />

      <div className="flex justify-between items-center mt-2">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">
          Rs {order.bills.totalWithTax.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
