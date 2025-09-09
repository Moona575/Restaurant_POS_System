import React from "react";
import {
  FaCheckDouble,
  FaLongArrowAltRight,
  FaCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getAvatarName } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifyOrder } from "../../https"; // ✅ use modifyOrder now
import { useNavigate } from "react-router-dom";

const OrderList = ({ order }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Cancel (update order status to Canceled)
  const cancelMutation = useMutation({
    mutationFn: (id) => modifyOrder(id, { orderStatus: "Canceled" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]); // refresh list
    },
  });

  const handleDelete = () => {
    cancelMutation.mutate(order._id);
  };

  const handleEdit = () => {
    navigate(`/menu?orderId=${order._id}`);
  };

  return (
    <div className="flex items-center gap-5 mb-3 bg-[#1a1a1a] p-3 rounded-lg">
      {/* Avatar Button */}
      <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
        {getAvatarName(order.customerDetails.name)}
      </button>

      {/* Order Info */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            {order.customerDetails.name}
          </h1>
          <p className="text-[#ababab] text-sm">{order.items.length} Items</p>
        </div>

        <h1 className="text-[#f6b100] font-semibold border border-[#f6b100] rounded-lg p-1">
          Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
          {order.table?.tableNo || "N/A"}
        </h1>

        {/* Status + Actions */}
        <div className="flex flex-col items-end gap-2">
          {order.orderStatus === "Ready" ? (
            <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
              <FaCheckDouble className="inline mr-2" /> {order.orderStatus}
            </p>
          ) : (
            <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
              <FaCircle className="inline mr-2" /> {order.orderStatus}
            </p>
          )}

          {/* Action Icons */}
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
  );
};

export default OrderList;
