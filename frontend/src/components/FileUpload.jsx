import React, { useState, useRef } from 'react';
import {
  UploadCloud, FileText, X, CheckCircle, AlertCircle,
  Sparkles, Trash2, FileCheck2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FileUpload({
  file,
  setFile,
  rawText,
  setRawText,
  inputMode,
  setInputMode,
  isLoading = false,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];

  const validateAndSetFile = (selectedFile) => {
    setErrorMessage('');
    if (!selectedFile) return;
    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      setErrorMessage('Unsupported format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };
  const clearFile = () => {
    setFile(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="bento-card p-6 sm:p-8 h-full flex flex-col justify-between relative overflow-hidden group/card bg-white"
    >
      {/* Clean Laser Scan Beam during analysis */}
      {isLoading && (
        <>
          <div className="laser-scan-line" />
          <div className="laser-scan-overlay" />
        </>
      )}

      <div>
        {/* Header + Mode Toggle */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm border border-indigo-200 shadow-sm">
              01
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Upload Candidate Resume</span>
                {file && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </h2>
              <p className="text-xs text-slate-500 font-medium">PDF, DOCX, or direct plain text</p>
            </div>
          </div>

          {/* Segmented Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
            {['file', 'text'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setInputMode(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  inputMode === mode
                    ? 'bg-white text-indigo-700 font-extrabold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode === 'file' ? 'Document' : 'Raw Text'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {inputMode === 'file' ? (
            <motion.div
              key="file-uploader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {!file ? (
                /* Prominent, Spacious Dropzone with Animated Indigo Dashed Border */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner'
                      : 'border-indigo-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Floating Upload Icon */}
                  <motion.div
                    animate={isDragging ? { scale: 1.15, y: -4 } : { y: [0, -4, 0] }}
                    transition={isDragging ? { type: 'spring' } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 group-hover:border-indigo-300 group-hover:shadow-indigo-500/20 transition-all duration-200"
                  >
                    <UploadCloud className="w-8 h-8" />
                  </motion.div>

                  <p className="text-sm sm:text-base font-extrabold text-slate-900">
                    <span className="text-indigo-600 group-hover:underline">Click to upload</span>
                    {' '}or drag & drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    {isDragging ? '⚡ Drop resume to load!' : 'Supports PDF, DOCX, TXT — up to 10MB'}
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    {['PDF', 'DOCX', 'TXT'].map((type) => (
                      <span
                        key={type}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-black text-slate-600 shadow-2xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Instant Upload-Success Card */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5 truncate">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">
                        <FileCheck2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm sm:text-base font-bold text-slate-900 truncate">{file.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium">{formatSize(file.size)}</span>
                          <span className="text-slate-300">·</span>
                          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {file.name.split('.').pop()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-all text-xs font-bold shadow-2xs"
                        title="Replace file"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-all"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Size Indicator Bar */}
                  <div className="mt-4">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (file.size / (10 * 1024 * 1024)) * 100)}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600"
                      />
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700 font-bold">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Ready for Analysis</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">ATTACHED</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="text-paster"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste full resume content (Experience, Skills, Education, Projects)..."
                rows={9}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none font-mono leading-relaxed shadow-inner"
              />
              <div className="flex justify-between items-center mt-2.5 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${rawText.length > 200 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {rawText.length} characters
                </span>
                {rawText && (
                  <button
                    type="button"
                    onClick={() => setRawText('')}
                    className="text-rose-600 hover:underline font-bold"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center space-x-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-bold"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
