// src/components/menu/CustomerInfo.jsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = ({ orderInfo }) => {
  const [dateTime, setDateTime] = useState(new Date());

  const customerDetails = orderInfo?.customerDetails;
  const customerDataFromRedux = useSelector((state) => state.customer);
  const finalCustomerDetails = customerDetails || customerDataFromRedux;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
          {finalCustomerDetails?.name ||
            finalCustomerDetails?.customerName ||
            "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1">
          #{orderInfo?._id || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
        {getAvatarName(
          finalCustomerDetails?.name || finalCustomerDetails?.customerName
        ) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;