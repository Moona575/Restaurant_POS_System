import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDish, getCategories } from "../../https";
import { enqueueSnackbar } from "notistack";

const DishModal = ({ setIsDishModalOpen }) => {
  const [dishData, setDishData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    isAvailable: true,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesData?.data?.data || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDishData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price to number
    const submitData = {
      ...dishData,
      price: parseFloat(dishData.price)
    };
    
    dishMutation.mutate(submitData);
  };

  const handleCloseModal = () => {
    setIsDishModalOpen(false);
  };

  const dishMutation = useMutation({
    mutationFn: (reqData) => addDish(reqData),
    onSuccess: (res) => {
      setIsDishModalOpen(false);
      enqueueSnackbar(res.data.message, { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Error", { variant: "error" });
      console.log(error);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add Dish</h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-10">
          {/* Dish Name */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Dish Name
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="name"
                value={dishData.name}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Price
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="price"
                value={dishData.price}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Category
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <select
                name="category"
                value={dishData.category}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none"
                required
                disabled={categoriesLoading}
              >
                <option value="" className="bg-[#1f1f1f] text-white">
                  {categoriesLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories.map((category) => (
                  <option 
                    key={category._id} 
                    value={category._id}
                    className="bg-[#1f1f1f] text-white"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
              Description
            </label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
              <textarea
                name="description"
                value={dishData.description}
                onChange={handleInputChange}
                className="bg-transparent flex-1 text-white focus:outline-none resize-none"
                rows="3"
                placeholder="Optional description..."
              />
            </div>
          </div>

          {/* Is Available Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isAvailable"
              checked={dishData.isAvailable}
              onChange={handleInputChange}
              className="w-4 h-4 text-yellow-400 bg-[#1f1f1f] border-gray-600 rounded focus:ring-yellow-400"
              id="isAvailable"
            />
            <label htmlFor="isAvailable" className="text-[#ababab] text-sm font-medium">
              Available for ordering
            </label>
          </div>

          <button
            type="submit"
            disabled={dishMutation.isPending || categoriesLoading}
            className="w-full rounded-lg mt-10 mb-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {dishMutation.isPending ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DishModal;