import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSteamSymbol } from 'react-icons/fa';

const SteamCard = () => {
  const [steamData, setSteamData] = useState({
    username: 'Loading...',
    realName: '',
    state: 'Offline',
    avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg', // Default avatar
    gameName: null,
    gameId: null,
    profileUrl: '#',
    countryCode: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  // Status Colors Configuration based on new backend guide
  const getStatusColor = (state) => {
    switch(state) {
      case 'Online': return 'bg-blue-500';
      case 'In-Game': return 'bg-green-500';
      case 'Offline': return 'bg-gray-500';
      case 'Busy': return 'bg-red-500';
      case 'Away': 
      case 'Snooze': return 'bg-yellow-500';
      case 'Looking to Play': return 'bg-emerald-500';
      case 'Looking to Trade': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBorder = (state) => {
    switch(state) {
      case 'Online': return 'border-blue-500';
      case 'In-Game': return 'border-green-500';
      case 'Offline': return 'border-gray-500';
      case 'Busy': return 'border-red-500';
      case 'Away':
      case 'Snooze': return 'border-yellow-500';
      case 'Looking to Play': return 'border-emerald-500';
      case 'Looking to Trade': return 'border-purple-500';
      default: return 'border-gray-500';
    }
  };

  const getStatusText = (state) => {
    switch(state) {
      case 'Online': return 'text-blue-500';
      case 'In-Game': return 'text-green-500';
      case 'Offline': return 'text-gray-500';
      case 'Busy': return 'text-red-500';
      case 'Away':
      case 'Snooze': return 'text-yellow-500';
      case 'Looking to Play': return 'text-emerald-500';
      case 'Looking to Trade': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  }

  // Fetch real data from backend
  useEffect(() => {
    const fetchSteamProfile = async () => {
      try {
        const response = await fetch('https://api.beliakun.com/steam/profile');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setSteamData(data);
      } catch (error) {
        console.error('Error fetching Steam profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteamProfile();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchSteamProfile, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className="group relative bg-[#171a21]/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#2a475e]/50 overflow-hidden flex flex-col justify-between min-h-[220px] transition-all duration-500 hover:border-[#66c0f4]/50 h-full"
    >
      {/* Background Steam Pattern/Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#66c0f4]/10 via-[#2a475e]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none transition-all duration-700 group-hover:from-[#66c0f4]/20" />
      
      {/* Header section: Icon & Link */}
      <div className="flex justify-between items-start mb-6 relative z-10 w-full">
        <div className="flex items-center space-x-3">
            <div className="bg-[#1b2838] p-3 rounded-2xl shadow-inner border border-white/5">
                 <FaSteamSymbol className="text-3xl text-[#66c0f4] drop-shadow-[0_0_8px_rgba(102,192,244,0.5)]" />
            </div>
            <div>
                 <h2 className="text-white/80 font-display font-semibold tracking-wide text-sm uppercase">Profil Gaming</h2>
                 <p className="text-[#66c0f4] text-xs font-mono font-medium tracking-wider">STEAM COMMUNITY</p>
            </div>
        </div>
        
        {/* Steam Level / Country Badge */}
        {steamData.countryCode && !isLoading && (
            <div className="flex items-center justify-center h-10 px-3 rounded-full border border-white/20 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
                <span className="text-white/80 font-mono text-xs tracking-widest">{steamData.countryCode}</span>
            </div>
        )}
      </div>

      {/* Profile Section */}
      <div className={`flex items-center space-x-5 relative z-10 w-full mt-auto transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* Avatar with Status Ring */}
        <div className="relative shrink-0">
          <a href={steamData.profileUrl !== '#' ? steamData.profileUrl : undefined} target="_blank" rel="noreferrer" className="block">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 ${getStatusBorder(steamData.state)} p-[2px] bg-[#1b2838] transition-colors duration-500`}>
                 <img 
                   src={steamData.avatarUrl} 
                   alt={steamData.username} 
                   className="w-full h-full object-cover rounded-lg"
                 />
              </div>
          </a>
          {/* Status Dot */}
          <span className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-[#171a21] rounded-full ${getStatusColor(steamData.state)} shadow-lg transition-colors duration-500`} />
        </div>

        {/* User Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col">
              <a href={steamData.profileUrl !== '#' ? steamData.profileUrl : undefined} target="_blank" rel="noreferrer" className="block truncate">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate group-hover:text-[#66c0f4] transition-colors duration-300">
                    {steamData.username}
                  </h3>
              </a>
              {steamData.realName && (
                  <p className="text-white/40 text-xs truncate uppercase tracking-wider">{steamData.realName}</p>
              )}
              
              <div className="flex items-center space-x-2 mt-1">
                 <span className={`text-xs sm:text-sm font-semibold tracking-wide ${getStatusText(steamData.state)} transition-colors duration-500`}>
                   {steamData.state === 'In-Game' ? 'Playing' : steamData.state}
                 </span>
                 
                 {/* Currently Playing Game */}
                 {steamData.state === 'In-Game' && steamData.gameName && (
                   <>
                      <span className="text-white/30 text-xs">•</span>
                      <span className="text-green-400/80 text-xs sm:text-sm truncate font-medium">
                        {steamData.gameName}
                      </span>
                   </>
                 )}
              </div>
          </div>
        </div>

      </div>
      
    </motion.div>
  );
};

export default SteamCard;
