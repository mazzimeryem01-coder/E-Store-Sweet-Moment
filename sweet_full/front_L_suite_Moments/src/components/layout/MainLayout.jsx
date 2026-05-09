import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TopBar from './TopBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-out-cubic' });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${location.pathname}${location.search}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
