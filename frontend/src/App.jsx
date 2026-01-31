import Navbar from "./components/Navbar";

import StudentPage from "./pages/StudentPage";
import HomePage from "./pages/HomePage";

import {Routes, Route} from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { theme, fetchGlobalTheme } = useThemeStore();

  // Fetch global theme on app mount
  useEffect(() => {
    fetchGlobalTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student/:id" element={<StudentPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
