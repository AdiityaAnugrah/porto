import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSteamSymbol } from 'react-icons/fa';

const SteamCard = () => {
  // Using dummy data for initial UI build
  const [steamData, setSteamData] = useState({
    username: 'Aditya',
    level: 42,
    state: 'In-Game', // Options: 'Online', 'Offline', 'In-Game'
    avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    gameName: 'Counter-Strike 2',
    gameIconUrl: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg'
  });

  const [isLoading, setIsLoading] = useState(false);

  // Status Colors Configuration
  const getStatusColor = (state) => {
    switch(state) {
      case 'Online': return 'bg-blue-400';
      case 'In-Game': return 'bg-green-500'; // Steam uses a vibrant green for in-game
      case 'Offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBorder = (state) => {
    switch(state) {
      case 'Online': return 'border-blue-400';
      case 'In-Game': return 'border-green-500';
      case 'Offline': return 'border-gray-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusText = (state) => {
    switch(state) {
      case 'Online': return 'text-blue-400';
      case 'In-Game': return 'text-green-500';
      case 'Offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  }

  // Effect to fetch from real API later
  useEffect(() => {
    // TODO: fetch(`https://api.beliakun.com/steam/profile`)
    // .then(res => res.json())
    // .then(data => setSteamData(data));
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="group relative bg-[#171a21]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#2a475e]/50 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-500 hover:border-[#66c0f4]/50"
    >
      {/* Background Steam Pattern/Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#66c0f4]/10 via-[#2a475e]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none transition-all duration-700 group-hover:from-[#66c0f4]/20" />
      
      {/* Header section: Icon & Level */}
      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className="flex items-center space-x-3">
            <div className="bg-[#1b2838] p-3 rounded-2xl shadow-inner border border-white/5">
                 <FaSteamSymbol className="text-3xl text-[#66c0f4] drop-shadow-[0_0_8px_rgba(102,192,244,0.5)]" />
            </div>
            <div>
                 <h2 className="text-white/80 font-display font-semibold tracking-wide text-sm uppercase">Gaming Profile</h2>
                 <p className="text-[#66c0f4] text-xs font-mono font-medium tracking-wider">STEAM COMMUNITY</p>
            </div>
        </div>
        
        {/* Steam Level Badge */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
            <span className="text-white font-bold text-sm">{steamData.level}</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-5 relative z-10 w-full mt-auto">
        
        {/* Avatar with Status Ring */}
        <div className="relative shrink-0">
          <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${getStatusBorder(steamData.state)} p-[2px] bg-[#1b2838]`}>
             <img 
               src={steamData.avatarUrl} 
               alt={steamData.username} 
               className="w-full h-full object-cover rounded-lg"
             />
          </div>
          {/* Status Dot */}
          <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-[#171a21] rounded-full ${getStatusColor(steamData.state)} shadow-lg`} />
        </div>

        {/* User Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-white truncate group-hover:text-[#66c0f4] transition-colors duration-300">
                {steamData.username}
              </h3>
              
              <div className="flex items-center space-x-2 mt-1">
                 <span className={`text-sm font-semibold tracking-wide ${getStatusText(steamData.state)}`}>
                   {steamData.state === 'In-Game' ? 'In-Game' : steamData.state}
                 </span>
                 
                 {/* Currently Playing Game */}
                 {steamData.state === 'In-Game' && (
                   <>
                      <span className="text-white/30 text-xs">•</span>
                      <span className="text-white/80 text-sm truncate font-medium">
                        {steamData.gameName}
                      </span>
                   </>
                 )}
              </div>
          </div>
        </div>

      </div>
      
      {/* Optional: Small Game Icon overlay if playing */}
      {steamData.state === 'In-Game' && steamData.gameIconUrl && (
          <div className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100 origin-bottom-right">
              <img src={steamData.gameIconUrl} alt="Game Icon" className="w-12 h-12 rounded shadow-lg border border-white/10" />
          </div>
      )}
      
    </motion.div>
  );
};

export default SteamCard;
