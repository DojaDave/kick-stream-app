import React, { useState, useEffect } from 'react';
import { Bell, Gift, ShoppingBag, Play, User, Home, Star, ExternalLink, Coins } from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [streamLive, setStreamLive] = useState(false);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [attendanceStreak, setAttendanceStreak] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [streamClicks, setStreamClicks] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Simulate user data
  const [userData, setUserData] = useState({
    totalStreamTime: 0,
    streamsAttended: 0,
    consecutiveLogins: 0,
    pointsEarned: 0
  });

  // Shop items
  const shopItems = [
    { id: 1, name: 'Custom Emote', price: 500, image: '🎭' },
    { id: 2, name: 'VIP Badge', price: 1000, image: '👑' },
    { id: 3, name: 'Stream Shoutout', price: 750, image: '📢' },
    { id: 4, name: 'Discord Role', price: 300, image: '🎮' },
    { id: 5, name: 'Exclusive Wallpaper', price: 200, image: '🖼️' },
    { id: 6, name: 'Priority Chat', price: 1500, image: '⚡' }
  ];

  // Login system
  const handleLogin = (username) => {
    const today = new Date().toDateString();
    const user = {
      username,
      loginDate: today,
      points: userPoints
    };
    
    setCurrentUser(user);
    
    // Check for daily login reward
    if (lastLoginDate !== today) {
      const reward = 50 + (userData.consecutiveLogins * 10);
      setUserPoints(prev => prev + reward);
      setUserData(prev => ({
        ...prev,
        consecutiveLogins: prev.consecutiveLogins + 1,
        pointsEarned: prev.pointsEarned + reward
      }));
      setLastLoginDate(today);
      
      addNotification(`Daily login reward: +${reward} points! 🎉`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Notification system
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  // Stream simulation
  const toggleStream = () => {
    setStreamLive(!streamLive);
    if (!streamLive) {
      addNotification('🔴 Stream is now LIVE! Join now!');
      // Simulate attendance reward after 10 seconds
      setTimeout(() => {
        if (currentUser) {
          const reward = 25;
          setUserPoints(prev => prev + reward);
          setUserData(prev => ({
            ...prev,
            streamsAttended: prev.streamsAttended + 1,
            totalStreamTime: prev.totalStreamTime + 1,
            pointsEarned: prev.pointsEarned + reward
          }));
          addNotification(`Attendance reward: +${reward} points! 📺`);
        }
      }, 10000);
    }
  };

  // Track stream link clicks
  const handleStreamClick = () => {
    setStreamClicks(prev => prev + 1);
    if (currentUser) {
      const reward = 5;
      setUserPoints(prev => prev + reward);
      addNotification(`Stream link bonus: +${reward} points! 🔗`);
    }
    // In real app, this would open the Kick stream
    alert('Stream link clicked! (Would open Kick stream in real app)');
  };

  // Shop purchase
  const handlePurchase = (item) => {
    if (userPoints >= item.price) {
      setUserPoints(prev => prev - item.price);
      addNotification(`Purchased ${item.name}! 🛍️`);
    } else {
      addNotification(`Not enough points for ${item.name} 😢`);
    }
  };

  // Login Form Component
  const LoginForm = () => {
    const [username, setUsername] = useState('');
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Stream Rewards</h1>
            <p className="text-gray-600">Join the community!</p>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl mb-4 text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && username.trim()) {
                  handleLogin(username.trim());
                }
              }}
            />
            <button
              onClick={() => {
                if (username.trim()) handleLogin(username.trim());
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Login & Start Earning
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main App Component
  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Hey, {currentUser.username}!</h1>
            <div className="flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4" />
              <span className="font-semibold">{userPoints} points</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white/20 px-3 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stream Status Banner */}
      {streamLive && (
        <div className="bg-red-500 text-white p-3 text-center animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">🔴 STREAM IS LIVE!</span>
            <button 
              onClick={handleStreamClick}
              className="ml-4 bg-white text-red-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
            >
              Watch Now <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 pb-20">
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{userData.streamsAttended}</div>
                <div className="text-sm text-gray-600">Streams Attended</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-pink-600">{userData.consecutiveLogins}</div>
                <div className="text-sm text-gray-600">Login Streak</div>
              </div>
            </div>

            {/* Stream Link */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Join the Stream</h3>
              <button 
                onClick={handleStreamClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Go to Kick Stream
                <ExternalLink className="w-4 h-4" />
              </button>
              <div className="text-sm text-gray-500 mt-2 text-center">
                Clicks tracked: {streamClicks} • Earn 5 points per click!
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Activity
              </h3>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 3).map(notif => (
                    <div key={notif.id} className="text-sm p-2 bg-gray-50 rounded-lg">
                      {notif.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Controls (Demo) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Demo Controls</h4>
              <button 
                onClick={toggleStream}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  streamLive 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}
              >
                {streamLive ? 'End Stream' : 'Start Stream'}
              </button>
            </div>
          </div>
        )}

        {currentView === 'rewards' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Daily Rewards</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Login Streak Rewards
              </h3>
              <div className="space-y-3">
                {[1, 3, 7, 14, 30].map(day => (
                  <div key={day} className={`flex justify-between items-center p-3 rounded-lg ${
                    userData.consecutiveLogins >= day ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span>Day {day}</span>
                    <span className="font-semibold">{50 + (day * 10)} points</span>
                    {userData.consecutiveLogins >= day && (
                      <Star className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Stream Attendance</h3>
              <p className="text-gray-600 mb-2">Earn 25 points for each stream you attend!</p>
              <div className="bg-purple-100 p-3 rounded-lg">
                <div className="text-lg font-semibold text-purple-800">
                  Total Earned: {userData.streamsAttended * 25} points
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'shop' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Shop</h2>
              <div className="bg-purple-100 px-3 py-1 rounded-full">
                <span className="text-purple-800 font-semibold">{userPoints} points</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {shopItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-purple-600 font-bold">{item.price} points</p>
                    </div>
                    <button 
                      onClick={() => handlePurchase(item)}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        userPoints >= item.price
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={userPoints < item.price}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold">{currentUser.username}</h3>
                <p className="text-gray-600">Community Member</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Points</span>
                  <span className="font-semibold">{userPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Streams Attended</span>
                  <span className="font-semibold">{userData.streamsAttended}</span>
                </div>
                <div className="flex justify-between">
                  <span>Login Streak</span>
                  <span className="font-semibold">{userData.consecutiveLogins} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Points Earned</span>
                  <span className="font-semibold">{userData.pointsEarned}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stream Link Clicks</span>
                  <span className="font-semibold">{streamClicks}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'rewards', icon: Gift, label: 'Rewards' },
            { id: 'shop', icon: ShoppingBag, label: 'Shop' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setCurrentView(nav.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentView === nav.id 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600'
              }`}
            >
              <nav.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{nav.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
