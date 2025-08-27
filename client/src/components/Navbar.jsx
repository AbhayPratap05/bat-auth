// Navbar.jsx
import React, { useContext } from 'react'
import GooeyNav from './GooeyNav'
import Logo from './Logo'
import Dock from './Dock';
import { VscHome} from 'react-icons/vsc';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { GiBatMask } from "react-icons/gi";
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const items = [
  { label: "Home", href: "/" },
  { label: "Login", href: "/login" },
];

const Navbar = () => {

  const navigate = useNavigate();

  const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContext);

  const sendVerificationOtp = async()=>{
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if(data.success) {
        toast.success(data.message)
        navigate('/email-verify')
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async ()=>{
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/logout')

      data.success && setIsLoggedin(false)
      data.success && setUserData(null)

      navigate('/')

    } catch (error) {
      toast.error(error.message)
    }
  }

  const fitems = [
    { icon: <VscHome size={18} />, label: 'Lobby', onClick: () => navigate('/') },
    { icon: <RiDashboardHorizontalFill size={18} />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GiBatMask size={18} />, label: 'Portfolio', onClick: () => window.location.href = 'https://abhaypratap.vercel.app'},
    { icon: <PiSignOutBold size={18} />, label: 'CaveOut', onClick: logout },
  ];

  return (
  <div className="w-full px-5 pt-5 sm:px-5 sm:pt-5 px-4 pt-4">
    <div className="flex items-center justify-center sm:justify-between h-[120px] sm:h-[120px] h-[80px] flex-wrap gap-4 sm:mb-0 mb-20">
        <Logo />
        {userData ? 
        <div>
        <div className='dock'>
        <Dock 
                  items={fitems}
                  panelHeight={68}
                  baseItemSize={50}
                  magnification={70}
                />
                </div>
        <div className="relative group">
  {/* Avatar button */}
  <div className="w-10 h-10 mr-10 flex items-center justify-center rounded-full border border-[#00fff7] font-bold text-xl cursor-pointer hover:brightness-125 transition">
    {userData.name[0].toUpperCase()}
  </div>

  {/* Dropdown on hover */}
  <div className="absolute right-0 mt-2 w-40 bg-[#11181f] rounded-md shadow-lg border border-[#00fff7] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition duration-300 ease-out z-50">
    <ul className="py-2 text-sm">
      {!userData.isAccountVerified &&
      <li className="w-full text-left px-4 py-2 hover:bg-cyan-700 transition-colors cursor-pointer" onClick={sendVerificationOtp}>
          Authorize
      </li>}
      <li className="w-full text-left px-4 py-2 hover:bg-cyan-700 transition-colors cursor-pointer"  onClick={logout}>
        Cave Out
      </li>
    </ul>
  </div>
</div></div>


        :
        <div className="relative group flex-shrink-0">
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
        </div>
        }
    </div>
      </div>
  )
}

export default Navbar
