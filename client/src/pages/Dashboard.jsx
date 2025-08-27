import React, { useState, useEffect, useContext } from "react";
import AnimatedContent from '../components/AnimatedContent';
import Lanyard from "../components/Lanyard";
import MagicBento from "../components/MagicBento";
import Dock from "../components/Dock";
import { VscHome} from 'react-icons/vsc';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { GiBatMask } from "react-icons/gi";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';


const Dashboard = () => {

  const navigate = useNavigate();
  const {backendUrl, setUserData, setIsLoggedin} = useContext(AppContext);

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

  const items = [
    { icon: <VscHome size={18} />, label: 'Lobby', onClick: () => navigate('/') },
    { icon: <RiDashboardHorizontalFill size={18} />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <GiBatMask size={18} />, label: 'Portfolio', onClick: () => window.location.href = 'https://abhaypratap.vercel.app'},
    { icon: <PiSignOutBold size={18} />, label: 'CaveOut', onClick: logout },
  ];
  const { userData } = useContext(AppContext);

  const [terminalText, setTerminalText] = useState("");
  const [showTerminal, setShowTerminal] = useState(true); // ✅ controls visibility

  const fullText = `
  [ACCESSING WAYNE ENTERPRISES SECURE NETWORK...]
  [BATCAVE TERMINAL ONLINE]
  Accessing secure database...
  Retrieving user credentials...
  `;

  // Typing animation for terminal
  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      setTerminalText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(typeTimer);
    }, 30);

    // ✅ Hide terminal after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTerminal(false);
    }, 5000);

    return () => {
      clearInterval(typeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Terminal Area */}
      {showTerminal && (
        <div className="p-6 max-w-4xl mx-auto transition-opacity duration-500">
          <div className="bg-black border-2  mt-50 p-4 rounded-lg shadow-md">
            <pre className="whitespace-pre-wrap force-neon terminal-text">
              {terminalText}
              <span className="animate-pulse">█</span>
            </pre>
          </div>
        </div>
      )}

      {/* Main Content After Terminal */}
      {!showTerminal && (
        <>
          {userData ? (
            <div className="relative w-full min-h-screen">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("/bg.png")` }}
              ></div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black opacity-60"></div>
              {/* Content */}
              <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]}/>
              <div className="flex justify-center items-center pb-30 sm:pb-0">
              <MagicBento 
                textAutoHide={false}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="0, 255, 247"
              />
              <Dock 
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
              />
              </div>
              
            </div>
          ) : (
            <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
              <p className="mb-6 text-base md:text-lg">Access Denied. Please login first.</p>
              <div style={{ display: 'flex', justifyContent: 'center'}}>
        <AnimatedContent
          distance={40}
          direction="verticle"
          reverse={false}
          duration={0.6}
          ease="bounce.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.2}
        >
          <div onClick={() => navigate('/login')} className="px-6 py-2 border-2 border-[#00fff7] rounded-md font-semibold hover:bg-cyan-600 cursor-pointer transition-all duration-300">
            Login
          </div>
        </AnimatedContent>
      </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
