import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose, IoMdAdd, IoMdTrash, IoMdCreate } from "react-icons/io";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory, addCategory, updateCategory } from "../../https";
import { enqueueSnackbar } from "notistack";

const CategoriesModalview = ({ setIsCategoriesModalOpen }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesData?.data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to delete category", { variant: "error" });
    },
  });

  const addMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setIsAddingCategory(false);
      setNewCategory({ name: "", description: "" });
      enqueueSnackbar("Category added successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to add category", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      setEditingCategory(null);
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.message || "Failed to update category", { variant: "error" });
    },
  });

  const handleClose = () => setIsCategoriesModalOpen(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      enqueueSnackbar("Category name is required", { variant: "error" });
      return;
    }
    addMutation.mutate(newCategory);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      enqueueSnackbar("Category name is required", { variant: "error" });
      return;
    }
    updateMutation.mutate({ id: editingCategory._id, data: { name: editingCategory.name, description: editingCategory.description } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
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
            <h2 className="text-2xl font-semibold text-white">Manage Categories</h2>
            <p className="text-gray-400 text-sm">Add, edit, or delete restaurant categories</p>
          </div>
          <button onClick={handleClose} className="text-white hover:text-red-500">
            <IoMdClose size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Category Button */}
          {!editingCategory && (
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="flex items-center gap-2 px-5 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <IoMdAdd size={20} /> Add New Category
            </button>
          )}

          {/* Add Category Form */}
          {isAddingCategory && !editingCategory && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCategory}
              className="p-6 bg-[#1f1f1f] rounded-xl flex flex-col gap-4 shadow-inner"
            >
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                placeholder="Category Name"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? "Adding..." : "Add Category"}
                </button>
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory({ name: "", description: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Edit Category Form */}
          {editingCategory && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleUpdateCategory}
              className="p-6 bg-[#1f1f1f] rounded-xl flex flex-col gap-4 shadow-inner"
            >
              <input
                type="text"
                name="name"
                value={editingCategory.name}
                onChange={handleEditInputChange}
                placeholder="Category Name"
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                name="description"
                value={editingCategory.description || ""}
                onChange={handleEditInputChange}
                placeholder="Description (optional)"
                rows={3}
                className="w-full p-3 bg-[#262626] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Category"}
                </button>
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Categories List */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading ? (
              <div className="text-center col-span-full py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">No categories found.</p>
            ) : (
              categories.map(category => (
                <div
                  key={category._id}
                  className="bg-[#1f1f1f] p-4 rounded-xl flex flex-col justify-between hover:bg-[#2a2a2a] transition-colors shadow"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      📂 {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 justify-end">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                      title="Edit category"
                    >
                      <IoMdCreate size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors disabled:opacity-50"
                      title="Delete category"
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

export default CategoriesModalview;
