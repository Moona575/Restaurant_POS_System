import React, { useEffect, useRef } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../https";
import { removeAllItems, setCartItems } from "../redux/slices/cartSlice";
import { setCustomer, removeCustomer } from "../redux/slices/customerSlice";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const dispatch = useDispatch();

  const loadedOrderRef = useRef(null);

  const { data: fetchedOrderData, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const response = await getOrder(orderId);
      return response.data;
    },
    enabled: !!orderId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    onSuccess: (order) => {
      if (!order) return;

      // Clear previous Redux state only if switching orders
      if (loadedOrderRef.current !== orderId) {
        dispatch(removeAllItems());
        dispatch(removeCustomer());
      }

      // Update Redux for cart items & customer
      dispatch(setCartItems(order.items || []));
      dispatch(
        setCustomer({
          customerName: order.customerDetails?.name,
          customerPhone: order.customerDetails?.phone,
          guests: order.customerDetails?.guests,
          table: order.table,
        })
      );

      loadedOrderRef.current = orderId;
    },
  });

  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customer = fetchedOrderData?.customerDetails;
  const table = fetchedOrderData?.table;

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide flex flex-col md:flex-row gap-3 px-4 sm:px-6">
  {/* Left Main Section */}
  <div className="flex-[3] min-w-0 flex flex-col">
    <div className="flex items-center justify-between px-4 py-3 sm:px-10 sm:py-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-[#f5f5f5] text-2xl font-medium tracking-wide">Menu</h1>
      </div>
      <div className="flex items-center justify-around gap-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl" />
          <div className="flex flex-col items-start min-w-0">
            <h1 className="text-md sm:text-base text-[#f5f5f5] font-normal truncate">
              {customer?.name || "Customer Name"}
            </h1>
            <p className="text-xs sm:text-sm text-[#ababab] font-normal truncate">
              Table : {table?.tableNo || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Menu Container */}
    <div className="pb-4 flex-1 min-w-0">
      <MenuContainer />
    </div>
  </div>

  {/* Right Sidebar */}
  <div className="flex-[1] bg-[#1a1a1a] mt-4 md:mt-0 rounded-lg pt-2 flex flex-col w-full md:w-auto md:max-h-[calc(100vh-5rem)]">
    {isLoading ? (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#ababab] font-normal">Loading order details...</p>
      </div>
    ) : (
      <div className="flex flex-col flex-1 md:overflow-y-auto scrollbar-hide gap-2 px-2 pb-4">
        <CustomerInfo orderInfo={fetchedOrderData} />
        <hr className="border-[#2a2a2a] border-t-2" />
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        <Bill key={orderId} orderData={fetchedOrderData} />
      </div>
    )}
  </div>

  <BottomNav />
</section>

  );
};

export default Menu;