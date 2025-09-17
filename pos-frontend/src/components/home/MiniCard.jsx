import React from 'react'

const MiniCard = ({ title, icon, number, footerNum }) => {
  return (
    <div className='bg-[#1a1a1a] py-2.5 px-3 rounded-lg w-[46%] sm:w-[46%] ml-2 sm:ml-4'>
      {/* Top Row: Title and Icon */}
      <div className='flex items-start justify-between'>
        <h1 className='text-[#f5f5f5] text-xs sm:text-sm font-semibold tracking-wide'>{title}</h1>
        <button
          className={`${
            title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"
          } p-1.5 sm:p-2 rounded-lg text-[#f5f5f5] text-lg sm:text-xl`}
        >
          {icon}
        </button>
      </div>

      {/* Bottom: Number and Footer */}
      <div>
        <h1 className='text-[#f5f5f5] text-lg sm:text-xl font-bold mt-2.5'>
  {title === "Total Earnings" ? `Rs ${number}` : number}
</h1>
<h1 className='text-[#f5f5f5] text-[0.65rem] mt-1'>
  <span className='text-[#02ca3a]'>{footerNum}%</span> than yesterday
</h1>

      </div>
    </div>
  )
}

export default MiniCard
