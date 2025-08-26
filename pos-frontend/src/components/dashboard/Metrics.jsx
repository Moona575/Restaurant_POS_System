import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getDishes } from "../../https";
import { metricsData } from "../../constants";
import CategoriesModalview from "./CategoriesModalview";
import DishesModal from "./DishesModal";
import { Sparklines, SparklinesLine } from "react-sparklines";

const Metrics = () => {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isDishesModalOpen, setIsDishesModalOpen] = useState(false);

  const prevCategoriesLength = useRef(null);
  const prevDishesLength = useRef(null);

  const [categoriesPercentage, setCategoriesPercentage] = useState(0);
  const [dishesPercentage, setDishesPercentage] = useState(0);
  const [categoriesIsIncrease, setCategoriesIsIncrease] = useState(true);
  const [dishesIsIncrease, setDishesIsIncrease] = useState(true);

  const [categoriesHistory, setCategoriesHistory] = useState([]);
  const [dishesHistory, setDishesHistory] = useState([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: dishesData, isLoading: dishesLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const categories = categoriesData?.data?.data || [];
  const dishes = dishesData?.data?.data || [];

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const currentLength = categories.length;
      const storedPrevious = localStorage.getItem('prevCategoriesLength');
      
      if (storedPrevious !== null) {
        const prevLength = parseInt(storedPrevious);
        const diff = currentLength - prevLength;
        const percentage = prevLength === 0 ? 0 : Math.round((diff / prevLength) * 100);
        
        setCategoriesPercentage(Math.abs(percentage));
        setCategoriesIsIncrease(diff >= 0);
      } else {
        // First time - no previous data
        setCategoriesPercentage(0);
        setCategoriesIsIncrease(true);
      }
      
      // Store current value for next time and update history
      localStorage.setItem('prevCategoriesLength', currentLength.toString());
      setCategoriesHistory(h => [...h.slice(-9), currentLength]);
    }
  }, [categories.length, categoriesLoading]);

  useEffect(() => {
    if (!dishesLoading && dishes.length > 0) {
      const currentLength = dishes.length;
      const storedPrevious = localStorage.getItem('prevDishesLength');
      
      if (storedPrevious !== null) {
        const prevLength = parseInt(storedPrevious);
        const diff = currentLength - prevLength;
        const percentage = prevLength === 0 ? 0 : Math.round((diff / prevLength) * 100);
        
        setDishesPercentage(Math.abs(percentage));
        setDishesIsIncrease(diff >= 0);
      } else {
        // First time - no previous data
        setDishesPercentage(0);
        setDishesIsIncrease(true);
      }
      
      // Store current value for next time and update history
      localStorage.setItem('prevDishesLength', currentLength.toString());
      setDishesHistory(h => [...h.slice(-9), currentLength]);
    }
  }, [dishes.length, dishesLoading]);

  const itemsData = [
    {
      title: "Total Categories",
      value: categoriesLoading ? "..." : categories.length.toString(),
      percentage: `${categoriesPercentage}%`,
      color: "#5b45b0",
      isIncrease: categoriesIsIncrease,
      clickable: true,
      onClick: () => setIsCategoriesModalOpen(true),
      icon: "📂",
      history: categoriesHistory,
    },
    {
      title: "Total Dishes",
      value: dishesLoading ? "..." : dishes.length.toString(),
      percentage: `${dishesPercentage}%`,
      color: "#285430",
      isIncrease: dishesIsIncrease,
      clickable: true,
      onClick: () => setIsDishesModalOpen(true),
      icon: "🍽️",
      history: dishesHistory,
    },
    {
      title: "Active Orders",
      value: "12",
      percentage: "8%",
      color: "#735f32",
      isIncrease: true,
      icon: "📋",
    },
    {
      title: "Total Tables",
      value: "15",
      color: "#7f167f",
      icon: "🪑",
    },
  ];

  const handleCardClick = (item) => {
    if (item.clickable && item.onClick) item.onClick();
  };

  return (
    <>
      <div className="w-full max-w-full py-2 px-2 sm:px-6 md:px-4 sm:container sm:mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="min-w-0">
            <h2 className="font-semibold text-[#f5f5f5] text-sm sm:text-xl truncate">
              Overall Performance
            </h2>
            <p className="text-xs sm:text-sm text-[#ababab] leading-tight">
              Track key metrics and performance
            </p>
          </div>
          <button className="flex items-center justify-center gap-1 px-2 sm:px-4 py-1 sm:py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a] text-xs sm:text-sm flex-shrink-0 w-fit sm:w-auto">
            Last 1 Month
            <svg
              className="w-2 h-2 sm:w-3 sm:h-3"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="mt-2 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-4">
          {metricsData.map((metric, index) => (
            <div
              key={index}
              className="shadow-sm rounded-md sm:rounded-lg p-2 sm:p-4 min-w-0"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-start">
                <p className="font-medium text-xs text-[#f5f5f5] break-words pr-1 leading-tight flex-1 min-w-0">{metric.title}</p>
                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 ml-1">
                  <svg
                    className="w-2 h-2 sm:w-3 sm:h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs whitespace-nowrap"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-base sm:text-2xl text-[#f5f5f5] truncate">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between mt-4 sm:mt-12">
          <div className="min-w-0">
            <h2 className="font-semibold text-[#f5f5f5] text-sm sm:text-xl truncate">Restaurant Management</h2>
            <p className="text-xs sm:text-sm text-[#ababab] leading-tight">
              Manage categories, dishes, and operations
            </p>
          </div>

          <div className="mt-2 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-4">
            {itemsData.map((item, index) => (
              <div
                key={index}
                className={`shadow-sm rounded-md sm:rounded-lg p-2 sm:p-4 transition-transform duration-200 min-w-0 ${
                  item.clickable ? "cursor-pointer hover:scale-105 hover:shadow-lg" : ""
                }`}
                style={{ backgroundColor: item.color }}
                onClick={() => handleCardClick(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 pr-1">
                    <span className="text-xs sm:text-lg flex-shrink-0">{item.icon}</span>
                    <p className="font-medium text-xs text-[#f5f5f5] break-words leading-tight min-w-0">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 relative group flex-shrink-0 ml-1">
                    {item.percentage && (
                      <>
                        <svg
                          className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        >
                          <path
                            d={item.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                          />
                        </svg>
                        <p className="font-medium text-xs text-[#f5f5f5] whitespace-nowrap">{item.percentage}</p>

                        {/* bigger mini graph */}
                        {item.history && item.history.length > 0 && (
                          <div className="absolute bottom-full mb-2 hidden group-hover:flex p-2 sm:p-3 bg-[#1a1a1a] rounded shadow-lg w-20 sm:w-36 h-12 sm:h-20 justify-center items-center z-10">
                            <Sparklines
                              data={
                                item.history.length === 1
                                  ? [item.history[0], item.history[0]] // <- duplicate first point
                                  : item.history
                              }
                              width={60}
                              height={30}
                            >
                              <SparklinesLine color="#f5f5f5" />
                            </Sparklines>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className="font-semibold text-base sm:text-2xl text-[#f5f5f5] truncate flex-1">{item.value}</p>
                  {item.clickable && (
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-[#f5f5f5] opacity-70 flex-shrink-0 ml-1"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCategoriesModalOpen && (
        <CategoriesModalview setIsCategoriesModalOpen={setIsCategoriesModalOpen} />
      )}
      {isDishesModalOpen && (
        <DishesModal setIsDishesModalOpen={setIsDishesModalOpen} />
      )}
    </>
  );
};

export default Metrics;