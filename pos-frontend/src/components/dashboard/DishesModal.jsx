import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose, IoMdAdd, IoMdTrash, IoMdCreate } from "react-icons/io";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishes, addDish, updateDish, deleteDish, getCategories } from "../../https";
import { enqueueSnackbar } from "notistack";

const DishesModal = ({ setIsDishesModalOpen }) => {
  const [editingDish, setEditingDish] = useState(null);
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "" });
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = categoriesData?.data?.data || [];

  const { data: dishesData, isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });
  const dishes = dishesData?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete dish", { variant: "error" });
    },
  });

  const addMutation = useMutation({
    mutationFn: addDish,
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
      setIsAddingDish(false);
      setNewDish({ name: "", description: "", price: "", category: "" });
      enqueueSnackbar("Dish added successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to add dish", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["dishes"]);
      setEditingDish(null);
      enqueueSnackbar("Dish updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to update dish", { variant: "error" });
    },
  });

  const handleClose = () => setIsDishesModalOpen(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newDish.name.trim()) {
      enqueueSnackbar("Dish name is required", { variant: "error" });
      return;
    }
    if (!newDish.category) {
      enqueueSnackbar("Please select a category", { variant: "error" });
      return;
    }
    addMutation.mutate({ ...newDish, price: parseFloat(newDish.price) });
  };

  const handleUpdateDish = (e) => {
    e.preventDefault();
    if (!editingDish.name.trim()) {
      enqueueSnackbar("Dish name is required", { variant: "error" });
      return;
    }
    if (!editingDish.category) {
      enqueueSnackbar("Please select a category", { variant: "error" });
      return;
    }
    updateMutation.mutate({
      id: editingDish._id,
      data: { ...editingDish, price: parseFloat(editingDish.price) },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDish((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 md:p-8"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="bg-[#262626] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#3a3a3a]">
          <div>
            <h2 className="text-2xl font-semibold text-white">Manage Dishes</h2>
            <p className="text-gray-400 text-sm">Add, edit, or delete restaurant dishes</p>
          </div>
          <button onClick={handleClose} className="text-white hover:text-red-500">
            <IoMdClose size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!editingDish && (
            <button
              onClick={() => setIsAddingDish(!isAddingDish)}
              className="flex items-center gap-2 px-5 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <IoMdAdd size={20} /> Add New Dish
            </button>
          )}

          {/* Add Dish Form */}
          {isAddingDish && !editingDish && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddDish}
              className="p-6 bg-[#1f1f1f] rounded-xl flex flex-col gap-4 shadow-inner"
            >
              <input
                type="text"
                name="name"
                value={newDish.name}
                onChange={handleInputChange}
                placeholder="Dish Name"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                name="description"
                value={newDish.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <input
                type="number"
                name="price"
                value={newDish.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              {/* Category Dropdown */}
              <select
                name="category"
                value={newDish.category}
                onChange={handleInputChange}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? "Adding..." : "Add Dish"}
                </button>
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setIsAddingDish(false);
                    setNewDish({ name: "", description: "", price: "", category: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Edit Dish Form */}
          {editingDish && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleUpdateDish}
              className="p-6 bg-[#1f1f1f] rounded-xl flex flex-col gap-4 shadow-inner"
            >
              <input
                type="text"
                name="name"
                value={editingDish.name}
                onChange={handleEditInputChange}
                placeholder="Dish Name"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                name="description"
                value={editingDish.description || ""}
                onChange={handleEditInputChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <input
                type="number"
                name="price"
                value={editingDish.price}
                onChange={handleEditInputChange}
                placeholder="Price"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              {/* Category Dropdown */}
              <select
                name="category"
                value={editingDish.category}
                onChange={handleEditInputChange}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Dish"}
                </button>
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => setEditingDish(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Dish List */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading ? (
              <div className="text-center col-span-full py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
              </div>
            ) : dishes.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">No dishes found.</p>
            ) : (
              dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="bg-[#1f1f1f] p-4 rounded-xl flex flex-col justify-between hover:bg-[#2a2a2a] transition-colors shadow"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      🍽️ {dish.name}
                    </h4>
                    {dish.description && (
                      <p className="text-gray-400 text-sm mt-1">{dish.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      Price: ${dish.price}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Category: {categories.find(c => c._id === dish.category)?.name || "—"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Created: {new Date(dish.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 justify-end">
                    <button
                      onClick={() => setEditingDish(dish)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit dish"
                    >
                      <IoMdCreate size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dish._id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                      title="Delete dish"
                    >
                      <IoMdTrash size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-[#3a3a3a]">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-[#3a3a3a] rounded-lg hover:bg-[#4a4a4a] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DishesModal;
