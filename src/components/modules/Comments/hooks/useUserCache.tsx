import { useState, useEffect } from 'react';

interface UserCacheData {
  name: string;
  email: string;
  profilePic?: File | null;
  profilePicUrl?: string;
}

interface UseUserCacheReturn {
  cachedData: UserCacheData;
  saveUserData: (data: Partial<UserCacheData>) => void;
  clearUserData: () => void;
  hasCachedData: boolean;
}

const CACHE_KEY = 'karen_portfolio_user_data';
const CACHE_VERSION = '1.0';

export const useUserCache = (): UseUserCacheReturn => {
  const [cachedData, setCachedData] = useState<UserCacheData>({
    name: '',
    email: '',
    profilePic: null,
    profilePicUrl: ''
  });
  
  const [hasCachedData, setHasCachedData] = useState(false);

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      
      if (cached) {
        const parsedData = JSON.parse(cached);
        
        // Check cache version for compatibility
        if (parsedData.version === CACHE_VERSION) {
          const userData: UserCacheData = {
            name: parsedData.name || '',
            email: parsedData.email || '',
            profilePic: null, // Files can't be stored in localStorage
            // Don't load blob: URLs as they're temporary and invalid
            profilePicUrl: (parsedData.profilePicUrl && !parsedData.profilePicUrl.startsWith('blob:')) ? parsedData.profilePicUrl : ''
          };
          
          setCachedData(userData);
          setHasCachedData(!!(userData.name || userData.email));
        } else {
          // Clear old version cache
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached user data:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  };

  // Function to clean corrupted blob URLs from existing cache
  const cleanCorruptedCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedData = JSON.parse(cached);
        if (parsedData.profilePicUrl && parsedData.profilePicUrl.startsWith('blob:')) {
          console.log('🧹 Cleaning corrupted blob URL from cache');
          const cleanData = {
            ...parsedData,
            profilePicUrl: ''
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cleanData));
        }
      }
    } catch (error) {
      console.warn('❌ Failed to clean corrupted cache:', error);
    }
  };

  // Load cached data on mount and clean corrupted data
  useEffect(() => {
    cleanCorruptedCache();
    loadCachedData();
  }, []);

  const saveUserData = (data: Partial<UserCacheData>) => {
    try {
      const updatedData = { ...cachedData, ...data };
      
      // Prepare data for localStorage (exclude File objects and blob URLs)
      const dataToCache = {
        version: CACHE_VERSION,
        name: updatedData.name,
        email: updatedData.email,
        // Don't save blob: URLs as they're temporary
        profilePicUrl: (updatedData.profilePicUrl && !updatedData.profilePicUrl.startsWith('blob:')) ? updatedData.profilePicUrl : '',
        timestamp: Date.now()
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      setCachedData(updatedData);
      setHasCachedData(!!(updatedData.name || updatedData.email));
    } catch (error) {
      console.warn('❌ Failed to cache user data:', error);
    }
  };

  const clearUserData = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setCachedData({
        name: '',
        email: '',
        profilePic: null,
        profilePicUrl: ''
      });
      setHasCachedData(false);
      console.log('User cache cleared');
    } catch (error) {
      console.warn('❌ Failed to clear user cache:', error);
    }
  };

  return {
    cachedData,
    saveUserData,
    clearUserData,
    hasCachedData
  };
};

export default useUserCache;
