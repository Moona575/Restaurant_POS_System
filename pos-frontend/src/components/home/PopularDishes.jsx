import React, { useEffect, useState } from "react";
import { getPopularDishes } from "../../https"; // adjust path if needed

const PopularDishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopularDishes();
        setDishes(res.data.data); // API returns { success, data }
      } catch (err) {
        console.error("Failed to fetch popular dishes:", err);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6 w-full h-[calc(100vh-2rem)]">
      <div className="bg-[#1a1a1a] w-full h-full rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <h1 className="text-[#f5f5f5] text-base font-medium tracking-wide">
            Popular Dishes
          </h1>
          <a href="#" className="text-[#025cca] text-xs sm:text-sm font-medium">
            View all
          </a>
        </div>

        {/* Dish list */}
<div className="overflow-y-auto flex-1 px-4 sm:px-6 pb-4 scrollbar-hide">
  {dishes.length > 0 ? (
    dishes.map((dish) => (
      <div
        key={dish._id}
        className="flex items-center gap-3 bg-[#1f1f1f] rounded-[15px] px-4 sm:px-5 py-2 sm:py-3 mt-3"
      >
        {/* Rank */}
        <h1 className="text-[#f5f5f5] font-medium text-sm sm:text-base mr-3">
          {dish.rank < 10 ? `0${dish.rank}` : dish.rank}
        </h1>

        {/* Icon */}
        <div className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm">
          🍽️
        </div>

        {/* Details */}
        <div>
          <h1 className="text-[#f5f5f5] font-medium tracking-wide text-xs sm:text-sm">
            {dish.name}
          </h1>
          <p className="text-[#f5f5f5] text-[11px] sm:text-xs font-normal mt-1">
            <span className="text-[#ababab]">Orders: </span>
            {dish.numberOfOrders}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-xs mt-4">No popular dishes found</p>
  )}
</div>

      </div>
    </div>
  );
};

export default PopularDishes;
