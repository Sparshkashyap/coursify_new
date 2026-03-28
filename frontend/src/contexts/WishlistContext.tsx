import React, { createContext, useContext, useEffect, useState } from "react";
import { getWishlist, toggleWishlistCourse } from "@/api/wishlistApi";

interface WishlistContextType {
  wishlist: string[];
  loading: boolean;
  toggleWishlist: (courseId: string) => Promise<void>;
  isWishlisted: (courseId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>(
  {} as WishlistContextType
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const refreshWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = getStoredUser();

      if (!token || !user || user.role !== "student") {
        setWishlist([]);
        setLoading(false);
        return;
      }

      const data = await getWishlist();
      const ids = (data.wishlist || []).map((course: any) => course._id);
      setWishlist(ids);
    } catch (err) {
      console.error("WISHLIST LOAD ERROR:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const toggleWishlist = async (courseId: string) => {
    const token = localStorage.getItem("token");
    const user = getStoredUser();

    if (!token || !user || user.role !== "student") return;

    await toggleWishlistCourse(courseId);
    await refreshWishlist();
  };

  const isWishlisted = (courseId: string) => wishlist.includes(courseId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, isWishlisted, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);