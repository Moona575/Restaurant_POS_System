import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";

// Import your modals
import TableModal from "../components/dashboard/Modal";
import CategoryModal from "../components/dashboard/CategoryModal";
import DishModal from "../components/dashboard/DishModal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  const [activeTab, setActiveTab] = useState("Metrics");
  const [activeModal, setActiveModal] = useState(null); // 'table' | 'category' | 'dishes' | null

  const handleOpenModal = (action) => setActiveModal(action);
  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="bg-[#1f1f1f] min-h-screen text-white">
      {/* Header: Buttons + Tabs */}
      <div className="container mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 sm:py-6 px-3 sm:px-4 gap-3 sm:gap-4">
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start lg:justify-start w-full sm:w-auto">
          {buttons.map(({ label, icon, action }) => (
            <button
              key={action}
              onClick={() => handleOpenModal(action)}
              className="bg-[#1a1a1a] hover:bg-[#262626] px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-sm sm:text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center sm:justify-center lg:justify-end w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap w-full sm:w-auto justify-center ${
                activeTab === tab
                  ? "bg-[#262626]"
                  : "bg-[#1a1a1a] hover:bg-[#262626]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-3 sm:px-4 pb-8 sm:pb-10">
        {activeTab === "Metrics" && <Metrics />}
        {activeTab === "Orders" && <RecentOrders />}
        {activeTab === "Payments" && (
          <div className="text-center py-8 sm:py-10 text-gray-400 text-sm sm:text-base">
            Payment Component Coming Soon
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === "table" && <TableModal setIsTableModalOpen={handleCloseModal} />}
      {activeModal === "category" && <CategoryModal setIsCategoryModalOpen={handleCloseModal} />}
      {activeModal === "dishes" && <DishModal setIsDishModalOpen={handleCloseModal} />}
    </div>
  );
};

export default Dashboard;