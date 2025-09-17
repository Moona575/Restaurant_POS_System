import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { tables } from "../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";

const Tables = () => {
  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Tables"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  console.log(resData);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col">
  {/* Header */}
  <div className="flex items-center justify-between px-4 sm:px-10 py-2 flex-wrap gap-4">
    <div className="flex items-center gap-3">
      <BackButton />
      <h1 className="text-[#f5f5f5] text-lg font-bold tracking-wide">
        Tables
      </h1>
    </div>
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
  <button
    onClick={() => setStatus("all")}
    className={`text-[#ababab] text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg font-semibold ${
      status === "all" && "bg-[#383838]"
    }`}
  >
    All
  </button>
  <button
    onClick={() => setStatus("booked")}
    className={`text-[#ababab] text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg font-semibold ${
      status === "booked" && "bg-[#383838]"
    }`}
  >
    Booked
  </button>
</div>

  </div>

  {/* Tables Grid */}
  <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {resData?.data.data.map((table) => (
        <TableCard
          key={table._id}
          id={table._id}
          name={table.tableNo}
          status={table.status}
          initials={table?.currentOrder?.customerDetails.name}
          seats={table.seats}
          className="min-w-[260px] max-w-[340px] p-6 sm:p-7"
        />
      ))}
    </div>
  </div>

  <BottomNav />
</section>

  );
};

export default Tables;
