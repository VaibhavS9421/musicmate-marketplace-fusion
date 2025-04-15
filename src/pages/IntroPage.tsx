
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to role selection after 3 seconds
    const timer = setTimeout(() => {
      navigate('/role-selection');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="logo-text text-5xl">
          <span className="text-music-red">Music</span>
          <span className="text-mate-black">Mate</span>
        </h1>
        <p className="mt-4 text-gray-500 fade-in-delay-1">Connect with music instruments</p>
      </div>
    </div>
  );
};

export default IntroPage;
