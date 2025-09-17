import React, { useEffect, useState } from "react";
import { getCategories, getDishesByCategory } from "../../https"; // ✅ use helpers
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";

const placeholderImage = "https://via.placeholder.com/150?text=Dish";

// Helpers for dynamic colors and emojis
const getCategoryColor = (name) => {
  const colors = ["#5b45b0", "#e85d04", "#d00000", "#0096c7", "#8ac926", "#f48c06"];
  let index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const getCategoryEmoji = (name) => {
  const emojis = {
    Pizza: "🍕",
    Burger: "🍔",
    Dessert: "🍰",
    Drinks: "🥤",
    Salad: "🥗",
  };
  return emojis[name] || ["🍽️", "🥘", "🍜", "🥪", "🌮"][name.length % 5];
};

const MenuContainer = () => {
  const [menus, setMenus] = useState([]);
  const [selected, setSelected] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenus([]); // reset menus when fetching

        const categoriesRes = await getCategories();
        const categories = categoriesRes.data.data;

        const menusData = await Promise.all(
          categories.map(async (category) => {
            const dishesRes = await getDishesByCategory(category._id);
            const dishes = dishesRes.data.data.map((dish) => ({
              ...dish,
              image: dish.image || placeholderImage,
            }));
            return {
              id: category._id,
              name: category.name,
              items: dishes,
              bgColor: getCategoryColor(category.name),
              icon: getCategoryEmoji(category.name),
            };
          })
        );

        setMenus(menusData);
        setSelected(menusData[0]);
      } catch (err) {
        console.error("Failed to fetch menus:", err);
      }
    };

    fetchMenus();
  }, []);

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;
    const { name, price } = item;
    const newObj = {
      id: new Date(),
      name,
      pricePerQuantity: price,
      quantity: itemCount,
      price: price * itemCount,
    };
    dispatch(addItems(newObj));
    setItemCount(0);
  };

  if (!selected) return <p>Loading menus...</p>;

  return (
    <>
      <div className="px-4 sm:px-8 py-4 w-full flex flex-col h-[calc(100vh-5rem)]">
  {/* Categories */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
    {menus.map((menu) => (
      <div
        key={menu.id}
        className={`flex items-center justify-between p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-200 break-words`}
        style={{ backgroundColor: menu.bgColor, minHeight: "80px" }}
        onClick={() => {
          setSelected(menu);
          setItemId(null);
          setItemCount(0);
        }}
      >
        {/* Left: Icon + Name */}
        <div className="flex items-center gap-2">
          <span className="text-[#f5f5f5] text-sm sm:text-base md:text-base font-semibold flex items-center gap-1">
            {menu.icon} {menu.name}
          </span>
        </div>

        {/* Right: Radio Button */}
        <div>
          {selected.id === menu.id && (
            <GrRadialSelected className="text-white" size={20} />
          )}
        </div>
      </div>
    ))}
  </div>

  <hr className="border-[#2a2a2a] border-t-2 my-4" />

  {/* Items */}
  {/* Items */}
<div className="flex-1 w-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
    {selected.items.map((item) => (
      <div
        key={item._id || item.id}
        className="flex flex-col justify-between p-2 md:p-3 rounded-lg min-h-[140px] w-full cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a] break-words min-w-0"
      >
        {/* Name + Cart */}
        <div className="flex items-start justify-between w-full min-w-0">
          <h1 className="text-[#f5f5f5] text-sm sm:text-base md:text-base font-semibold break-words truncate max-w-[70%]">
            {item.name}
          </h1>
          <button
            onClick={() => handleAddToCart(item)}
            className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg flex-shrink-0"
          >
            <FaShoppingCart size={18} />
          </button>
        </div>

        {/* Price + Counter */}
        <div className="flex items-center justify-between w-full mt-2 min-w-0">
          <p className="text-[#f5f5f5] text-sm sm:text-base md:text-lg font-bold break-words truncate max-w-[40%]">
            Rs {item.price}
          </p>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-3 py-1 rounded-lg gap-2 w-[55%] sm:w-[50%] flex-shrink-0">
            <button
              onClick={() => decrement(item._id || item.id)}
              className="text-yellow-500 text-lg sm:text-xl"
            >
              &minus;
            </button>
            <span className="text-white text-sm sm:text-base">
              {itemId === (item._id || item.id) ? itemCount : 0}
            </span>
            <button
              onClick={() => increment(item._id || item.id)}
              className="text-yellow-500 text-lg sm:text-xl"
            >
              &#43;
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

</div>

    </>
  );
};

export default MenuContainer;
