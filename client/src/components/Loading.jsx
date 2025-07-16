import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
const Loading = () => {

    const {navigate} = useAppContext();
    let {search} = useLocation();
    const queryParams = new URLSearchParams(search);
    const nexturl = queryParams.get('next');

    useEffect(() => {
        if (nexturl) {
            setTimeout(() => {
                navigate(`/${nexturl}`);
            }, 3000); // Redirect after 2 seconds
        }
    
    }, [nexturl]);

  return (
    <div className="flex flex-col items-center justify-center h-screen" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[4px] border-t-green-500"></div>
      <p className="mt-4 text-sm text-gray-500">Loading, please wait...</p>
    </div>
  );
};

export default Loading;