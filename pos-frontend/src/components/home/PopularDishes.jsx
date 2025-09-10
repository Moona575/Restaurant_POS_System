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
    <div className="mt-6 pr-6">
      <div className="bg-[#1a1a1a] w-full max-h-[90vh] rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 flex-shrink-0">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <a href="" className="text-[#025cca] text-sm font-semibold">
            View all
          </a>
        </div>

        {/* Dish list */}
        <div className="overflow-y-auto flex-1 px-6 scrollbar-hide">
          {dishes.map((dish) => (
            <div
              key={dish._id} // use MongoDB _id, not dish.id
              className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-4"
            >
              <h1 className="text-[#f5f5f5] font-bold text-xl mr-4">
                {dish.rank < 10 ? `0${dish.rank}` : dish.rank}
              </h1>
              <div className="w-[50px] h-[50px] rounded-full bg-[#2a2a2a] flex items-center justify-center">
                🍽️
              </div>
              <div>
                <h1 className="text-[#f5f5f5] font-semibold tracking-wide">
                  {dish.name}
                </h1>
                <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
                  <span className="text-[#ababab]">Orders: </span>
                  {dish.numberOfOrders}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
