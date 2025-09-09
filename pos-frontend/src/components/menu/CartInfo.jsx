// CartInfo.jsx

import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import { useMutation } from "@tanstack/react-query"; // 🟢 NEW: Import useMutation
import { useLocation } from "react-router-dom"; // 🟢 NEW: Import useLocation
import { enqueueSnackbar } from "notistack"; // Optional: for user feedback
import { deleteOrderItem } from "../../https/index"; // 🟢 NEW: Import the delete API

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();
  const location = useLocation(); // 🟢 NEW: Get location object

  // 🟢 NEW: Read the orderId from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderIdFromUrl = queryParams.get("orderId");

  // 🟢 NEW: Mutation hook for deleting an item from the order
  const deleteItemMutation = useMutation({
    mutationFn: (data) => deleteOrderItem(data.orderId, data.itemId),
    onSuccess: () => {
      enqueueSnackbar("Item removed from order!", { variant: "success" });
      // We don't need to refetch the whole order, as the local state is already updated.
      // But if there's a need to update the order's total price on the backend,
      // you would need another API call here.
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar("Failed to remove item from order!", { variant: "error" });
    },
  });

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleRemove = (itemId) => {
    // 1. First, remove the item from the local cart state
    dispatch(removeItem(itemId));

    // 2. If an orderId exists, call the backend API to also remove the item from the DB
    if (orderIdFromUrl) {
      deleteItemMutation.mutate({
        orderId: orderIdFromUrl,
        itemId: itemId,
      });
    }
  };

  return (
    <div className="px-4 py-2">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>
      <div className="mt-4 overflow-y-scroll scrollbar-hide h-[380px]" ref={scrolLRef}>
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm flex justify-center items-center h-[380px]">Your cart is empty. Start adding items!</p>
        ) : cartData.map((item) => {
          return (
            <div key={item.id} className="bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-[#ababab] font-semibold tracling-wide text-md">
                  {item.name}
                </h1>
                <p className="text-[#ababab] font-semibold">x{item.quantity}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => handleRemove(item.id)}
                    className="text-[#ababab] cursor-pointer"
                    size={20}
                  />
                  <FaNotesMedical
                    className="text-[#ababab] cursor-pointer"
                    size={20}
                  />
                </div>
                <p className="text-[#f5f5f5] text-md font-bold">Rs {item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartInfo;