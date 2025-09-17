import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";

const Home = () => {
  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  return (
    <section className="bg-[#1f1f1f] min-h-screen p-3 flex flex-col md:flex-row gap-3">
      {/* Left Div */}
      <div className="md:flex-[3] flex flex-col gap-6">
        <Greetings />
       <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-2 px-2 sm:px-4 text-xs">
  <MiniCard
    title="Total Earnings"
    icon={<BsCashCoin className="text-lg" />}
    number={512}
    footerNum={1.6}
    className="p-2 sm:p-3 text-xs max-w-[140px] sm:max-w-[160px]"
  />
  <MiniCard
    title="In Progress"
    icon={<GrInProgress className="text-lg" />}
    number={16}
    footerNum={3.6}
    className="p-2 sm:p-3 text-xs max-w-[140px] sm:max-w-[160px]"
  />
</div>

        <RecentOrders />
      </div>

      {/* Right Div */}
      <div className="md:flex-[2] flex flex-col gap-6">
        <PopularDishes />
      </div>

      <BottomNav />
    </section>
  );
};

export default Home;
