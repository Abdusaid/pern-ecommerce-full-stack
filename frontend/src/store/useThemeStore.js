import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? (import.meta.env.VITE_API_URL || "http://localhost:3000")
  : "";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("preferred-theme") || "forest",
  loading: false,

  // Fetch global theme from the database
  fetchGlobalTheme: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/preferences/theme`);
      const globalTheme = response.data.data.theme || "forest";
      localStorage.setItem("preferred-theme", globalTheme);
      set({ theme: globalTheme });
    } catch (error) {
      console.error("Error fetching global theme:", error);
      // Fall back to localStorage
      const localTheme = localStorage.getItem("preferred-theme") || "forest";
      set({ theme: localTheme });
    } finally {
      set({ loading: false });
    }
  },

  // Set global theme and persist to database (only for authenticated users)
  setTheme: async (theme, isAuthenticated = false) => {
    localStorage.setItem("preferred-theme", theme);
    set({ theme });

    // If user is authenticated, save to database as global theme
    if (isAuthenticated) {
      try {
        await axios.put(`${BASE_URL}/api/preferences/theme`, { theme });
      } catch (error) {
        console.error("Error saving global theme to database:", error);
      }
    }
  },
}));