import React, { useState, useEffect } from "react";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = ({ orderData }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const customerDetails = orderData?.customerDetails;

  useEffect(() => {
    setDateTime(new Date()); // refresh timestamp if needed
  }, [orderData]);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
          {customerDetails?.name || "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1">
          #{orderData?._id || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
        {getAvatarName(customerDetails?.name) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;
