import React from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => console.log(error),
  });

  const handleLogout = () => logoutMutation.mutate();

  return (
   <header className="flex flex-row justify-between items-center py-2.5 px-3 sm:px-6 bg-[#1a1a1a] gap-2.5 sm:gap-3 flex-wrap">
  {/* LOGO */}
  <div
    onClick={() => navigate("/")}
    className="flex items-center gap-2 cursor-pointer flex-shrink-0"
  >
    <img src={logo} className="h-6 w-6 sm:h-8 sm:w-8" alt="restro logo" />
    <h1 className="text-sm sm:text-base font-medium sm:font-semibold text-[#f5f5f5] tracking-wide">
      Restro
    </h1>
  </div>

  {/* SEARCH */}
  <div className="flex items-center gap-2 sm:gap-3 bg-[#1f1f1f] rounded-[10px] px-3 sm:px-4 py-1.5 sm:py-2 flex-1 min-w-0 overflow-hidden">
    <FaSearch className="text-[#f5f5f5] text-sm sm:text-base flex-shrink-0" />
    <input
      type="text"
      placeholder="Search"
      className="bg-[#1f1f1f] outline-none text-sm sm:text-base text-[#f5f5f5] w-full truncate"
    />
  </div>

  {/* USER DETAILS */}
  <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
    {userData.role === "Admin" && (
      <div
        onClick={() => navigate("/dashboard")}
        className="bg-[#1f1f1f] rounded-[10px] p-2 sm:p-3 cursor-pointer flex-shrink-0"
      >
        <MdDashboard className="text-[#f5f5f5] text-xl sm:text-2xl" />
      </div>
    )}

    <div className="bg-[#1f1f1f] rounded-[10px] p-2 sm:p-3 cursor-pointer flex-shrink-0">
      <FaBell className="text-[#f5f5f5] text-xl sm:text-2xl" />
    </div>

    <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer flex-shrink-0">
      <FaUserCircle className="text-[#f5f5f5] text-2xl sm:text-3xl flex-shrink-0" />
      <div className="flex flex-col items-start overflow-hidden">
        <h1 className="text-sm sm:text-[0.85rem] text-[#f5f5f5] font-medium sm:font-semibold tracking-wide truncate">
          {userData.name || "TEST USER"}
        </h1>
        <p className="text-[0.65rem] sm:text-[0.75rem] text-[#ababab] font-medium truncate">
          {userData.role || "Role"}
        </p>
      </div>
      <IoLogOut
        onClick={handleLogout}
        className="text-[#f5f5f5] flex-shrink-0"
        size={28}
      />
    </div>
  </div>
</header>

  );
};

export default Header;
