import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({ id, name, status, initials, seats }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (name) => {
    if (status === "Booked") return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  return (
    <div
      onClick={() => handleClick(name)}
      key={id}
      className="flex-1 min-w-[220px] max-w-[300px] hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer flex flex-col justify-between"
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-lg sm:text-xl font-semibold break-words">
          Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" /> {name}
        </h1>
        <p
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm ${
            status === "Booked"
              ? "text-green-600 bg-[#2e4a40]"
              : "bg-[#664a04] text-white"
          }`}
        >
          {status}
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center justify-center mt-4 mb-4">
        <h1
          className={`text-white rounded-full p-4 sm:p-5 text-lg sm:text-xl`}
          style={{
            backgroundColor: initials ? getBgColor() : "#1f1f1f",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>

      {/* Seats */}
      <p className="text-[#ababab] text-xs sm:text-sm">
        Seats: <span className="text-[#f5f5f5]">{seats}</span>
      </p>
    </div>
  );
};

export default TableCard;
