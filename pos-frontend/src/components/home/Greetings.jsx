import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Greetings = () => {
  const userData = useSelector(state => state.user);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
  };

  const formatTime = (date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 mt-2 gap-2">
      {/* Left Greeting */}
      <div>
        <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wide">
          Good Morning, {userData.name || "TEST USER"}
        </h1>
        <p className="text-[#ababab] text-[0.65rem] sm:text-xs">
          Give your best services for customers 😀
        </p>
      </div>

      {/* Right Time & Date */}
      <div className="flex flex-col items-start sm:items-end">
        <h1 className="text-[#f5f5f5] text-lg sm:text-xl font-medium tracking-wide w-[110px] sm:w-[120px] text-left sm:text-right">
          {formatTime(dateTime)}
        </h1>
        <p className="text-[#ababab] text-[0.65rem] sm:text-xs">{formatDate(dateTime)}</p>
      </div>
    </div>
  );
};

export default Greetings;
