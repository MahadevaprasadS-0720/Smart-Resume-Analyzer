import React, { useState } from 'react';
import {
  History,
  Clock,
  Trash2,
  GitCompare,
  RotateCcw,
  FileText,
  X,
  Sparkles,
  Download,
  Cloud,
  HardDrive,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  user = null,
  onDeleteScan,
  onClearHistory,
  onRestoreScan,
  onCompareScans,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const toggleSelectForCompare = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 2) {
        setSelectedIds([selectedIds[1], id]);
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleLaunchCompare = () => {
    if (selectedIds.length === 2) {
      const scanA = history.find((h) => h.id === selectedIds[0]);
      const scanB = history.find((h) => h.id === selectedIds[1]);
      if (scanA && scanB) {
        onCompareScans(scanA, scanB);
      }
    }
  };

  const getScoreColorBadge = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-md flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-50 border-l border-slate-200"
        >
          {/* Header Bar */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[15px] flex items-center justify-center">
                  <History className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Scan Vault
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center space-x-1">
                    {user ? (
                      <>
                        <Cloud className="w-3 h-3 text-cyan-300" />
                        <span>Cloud Synced</span>
                      </>
                    ) : (
                      <>
                        <HardDrive className="w-3 h-3 text-slate-400" />
                        <span>Local Vault</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {user
                    ? `Showing private scans for ${user.displayName || user.email}`
                    : 'Sign in with Google to sync scans across your devices.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Compare Toolbar (if scans selected) */}
          {selectedIds.length > 0 && (
            <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900">
                <GitCompare className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  {selectedIds.length === 1
                    ? '1 of 2 Selected (Pick 1 more)'
                    : '2 Scans Ready to Compare'}
                </span>
              </div>

              {selectedIds.length === 2 ? (
                <button
                  type="button"
                  onClick={handleLaunchCompare}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Compare Side-by-Side</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-indigo-700 hover:underline font-medium"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}

          {/* History Cards List Area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50">
            {history.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No Scan History Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Run an ATS resume analysis to automatically save your results for tracking and version comparison.
                </p>
              </div>
            ) : (
              history.map((scan) => {
                const isSelected = selectedIds.includes(scan.id);
                const score = scan.score || scan.overallScore || 0;
                const role = scan.targetRole || 'Target Role';
                const file = scan.fileName || scan.resumeName || 'Resume Document';

                return (
                  <div
                    key={scan.id}
                    className={`p-4 rounded-2xl bg-white border transition-all shadow-sm space-y-3 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Date, Role, Score Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {scan.timestamp
                              ? new Date(scan.timestamp).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Recent Scan'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {role}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px] font-medium">{file}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1.5">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getScoreColorBadge(score)}`}>
                          {score}% ATS
                        </span>
                        {scan.fileUrl && (
                          <a
                            href={scan.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-0.5"
                            title="Download original file from Firebase Storage"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats Pill Row */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        ✓ {scan.matchedSkills?.length || 0} Matched Skills
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
                        ✗ {scan.missingSkills?.length || 0} Missing Gaps
                      </span>
                      {scan.roleFit && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {scan.roleFit}
                        </span>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Checkbox for Compare */}
                      <label className="flex items-center space-x-2 cursor-pointer select-none text-xs font-bold text-slate-700 hover:text-indigo-600">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectForCompare(scan.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-white cursor-pointer"
                        />
                        <span>{isSelected ? 'Selected for Compare' : 'Select to Compare'}</span>
                      </label>

                      <div className="flex items-center space-x-1.5">
                        {/* Load into Dashboard */}
                        <button
                          type="button"
                          onClick={() => onRestoreScan(scan)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-colors flex items-center space-x-1"
                          title="Restore this scan in Dashboard"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Load</span>
                        </button>

                        {/* Delete Single Item */}
                        <button
                          type="button"
                          onClick={() => onDeleteScan(scan.id, scan.storagePath)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete this scan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            {showClearConfirm ? (
              <div className="flex items-center space-x-2">
                <span className="text-rose-600 font-bold">Clear all scans?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 text-slate-600 hover:underline"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={history.length === 0}
                className="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear All History
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
