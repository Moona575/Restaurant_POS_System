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
      {/* Categories */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
            style={{ backgroundColor: menu.bgColor }}
            onClick={() => {
              setSelected(menu);
              setItemId(null);
              setItemCount(0);
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {menu.icon} {menu.name}
              </h1>
              {selected.id === menu.id && (
                <GrRadialSelected className="text-white" size={20} />
              )}
            </div>
            <p className="text-[#ababab] text-sm font-semibold">
              {menu.items.length} Items
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Items */}
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {selected.items.map((item) => (
          <div
            key={item._id || item.id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[180px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
          >
            <div className="flex items-start justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">{item.name}</h1>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
              >
                <FaShoppingCart size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-[#f5f5f5] text-xl font-bold">Rs {item.price}</p>
              <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 w-[50%]">
                <button
                  onClick={() => decrement(item._id || item.id)}
                  className="text-yellow-500 text-2xl"
                >
                  &minus;
                </button>
                <span className="text-white">
                  {itemId === (item._id || item.id) ? itemCount : 0}
                </span>
                <button
                  onClick={() => increment(item._id || item.id)}
                  className="text-yellow-500 text-2xl"
                >
                  &#43;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuContainer;
