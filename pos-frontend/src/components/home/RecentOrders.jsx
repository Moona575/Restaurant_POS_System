import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

const RecentOrders = () => {
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4 w-full h-[calc(100vh-1rem)]">
      <div className="bg-[#1a1a1a] w-full h-full rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0">
          <h1 className="text-[#f5f5f5] text-base sm:text-lg font-medium tracking-wide">
            Recent Orders
          </h1>
          <a href="#" className="text-[#025cca] text-xs sm:text-sm font-medium">
            View all
          </a>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 sm:gap-4 bg-[#1f1f1f] rounded-[12px] px-4 sm:px-5 py-2 sm:py-3 mx-4 sm:mx-6 flex-shrink-0">
          <FaSearch className="text-[#f5f5f5] text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search recent orders"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full text-xs sm:text-sm"
          />
        </div>

        {/* Order list */}
        <div className="mt-3 px-4 sm:px-6 overflow-y-auto flex-1 pb-3">
          {resData?.data.data.length > 0 ? (
            resData.data.data.map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="text-gray-500 text-xs mt-2">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
