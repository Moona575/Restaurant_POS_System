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
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
      <div className="flex-[3]">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Menu</h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customer?.name || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Table : {table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <MenuContainer />
      </div>

      <div className="flex-[1] bg-[#1a1a1a] mt-4 mr-3 h-[780px] rounded-lg pt-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#ababab]">Loading order details...</p>
          </div>
        ) : (
          <>
            <CustomerInfo orderInfo={fetchedOrderData} />
            <hr className="border-[#2a2a2a] border-t-2" />
            <CartInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
            <Bill key={orderId} orderData={fetchedOrderData} />
          </>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
