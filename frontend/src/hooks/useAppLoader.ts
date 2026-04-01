import { useEffect, useState } from "react";

const useAppLoader = (delay = 1950) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay]);

  return loading;
};

export default useAppLoader;