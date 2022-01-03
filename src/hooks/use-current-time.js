import { useEffect, useState } from "react";

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let hasUnmounted = false;
    const interval = setInterval(() => {
      if (!hasUnmounted) setCurrentTime(new Date());
    }, 30000);
    return () => {
      hasUnmounted = true;
      clearInterval(interval);
    };
  }, []);

  return currentTime;
};
