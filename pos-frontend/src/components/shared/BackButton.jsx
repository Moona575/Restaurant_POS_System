import React from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className='bg-[#025cca] p-2 rounded-full text-white flex items-center justify-center'
    > 
      <IoArrowBackOutline size={18} /> {/* smaller icon size */}
    </button>
  )
}

export default BackButton
