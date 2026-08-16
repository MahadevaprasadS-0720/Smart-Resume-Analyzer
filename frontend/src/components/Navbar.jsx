import React, { useState } from 'react';
import {
  Sparkles, FileText, HelpCircle,
  History, Zap, LogIn, LogOut, User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  user,
  onOpenAuthModal,
  onLogout,
  onOpenBulletRewriter,
  onOpenCoverLetter,
  onOpenInterviewPrep,
  onOpenHistory,
  historyCount = 0,
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-3 z-50 max-w-7xl w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] mx-auto">
      <div className="crystalline-nav rounded-2xl px-4 sm:px-6 h-[66px] flex items-center justify-between shadow-lg shadow-indigo-900/5">

        {/* 1. Left: Brand Logo & Live Engine Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-white" />
          </motion.div>

          <div className="flex items-center space-x-2.5">
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Resume<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">AI</span>
            </span>

            {/* Live Precision Status Pill */}
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full
              text-[11px] font-black tracking-wide
              bg-emerald-50 text-emerald-700
              border border-emerald-200/90 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>ATS 99.8% PRECISION</span>
            </span>
          </div>
        </div>

        {/* 2. Center: Creative Integrated Tool Suite Dock */}
        <nav className="hidden lg:flex items-center space-x-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-inner">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 cursor-default"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-200" />
            <span>Analyzer</span>
          </button>

          <motion.button
            type="button"
            onClick={onOpenBulletRewriter}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Bullets</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onOpenCoverLetter}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-white transition-all flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Cover Letter</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={onOpenInterviewPrep}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-cyan-600 hover:bg-white transition-all flex items-center space-x-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
            <span>Mock Interview</span>
          </motion.button>
        </nav>

        {/* 3. Right: Scan Vault & Authentication User Menu */}
        <div className="flex items-center space-x-2.5">
          {/* Scan Vault Button */}
          <motion.button
            type="button"
            onClick={onOpenHistory}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-black
              bg-white hover:bg-indigo-50/50
              text-slate-800 hover:text-indigo-700
              border border-slate-200/90 hover:border-indigo-300
              shadow-sm shadow-slate-900/5 transition-all group"
            title="Scan Vault History"
          >
            <History className="w-4 h-4 text-indigo-600 group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden sm:inline">Scan Vault</span>
            {historyCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-sm">
                {historyCount}
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </motion.button>

          {/* Firebase Authentication Component */}
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 shadow-sm transition-all"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-black">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 hidden md:inline max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0] || 'Account'}
                </span>
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-200/90 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {user.displayName || 'Authenticated User'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenHistory();
                      }}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <History className="w-4 h-4 text-indigo-600" />
                      <span>My Cloud Scans</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full mt-1 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={onOpenAuthModal}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold
                bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700
                text-white shadow-md shadow-indigo-600/25 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
