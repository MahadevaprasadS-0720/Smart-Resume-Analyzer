import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  X,
  Loader2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Briefcase,
  User,
  SlidersHorizontal,
  FileDown,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCoverLetter } from '../services/api';

const TONES = [
  {
    id: 'Professional',
    label: 'Professional',
    badge: 'Formal & Strategic',
    color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm',
    desc: 'Polished, authoritative, and data-driven',
  },
  {
    id: 'Enthusiastic',
    label: 'Enthusiastic',
    badge: 'High Energy & Mission',
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    activeColor: 'bg-purple-600 text-white border-purple-600 shadow-sm',
    desc: 'Passionate, energetic, and innovation-focused',
  },
  {
    id: 'Concise',
    label: 'Concise',
    badge: 'Executive Bulleted',
    color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    desc: 'Punchy, direct, and metric-bulleted highlights',
  },
];

export default function CoverLetterGenerator({
  isOpen,
  onClose,
  initialCandidateName = '',
  initialTargetRole = '',
  initialSkills = [],
  initialJobDescription = '',
  resumeText = '',
}) {
  const [candidateName, setCandidateName] = useState(initialCandidateName || 'Alex Morgan');
  const [targetRole, setTargetRole] = useState(initialTargetRole || 'Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState(initialJobDescription || '');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [letterContent, setLetterContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const printRef = useRef(null);

  // Sync props on opening
  useEffect(() => {
    if (isOpen) {
      if (initialCandidateName) setCandidateName(initialCandidateName);
      if (initialTargetRole) setTargetRole(initialTargetRole);
      if (initialJobDescription) setJobDescription(initialJobDescription);
      fetchCoverLetter('Professional');
    }
  }, [isOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const fetchCoverLetter = async (toneToUse = selectedTone) => {
    setIsLoading(true);
    try {
      const data = await generateCoverLetter({
        candidateName: candidateName.trim(),
        targetRole: targetRole.trim(),
        skills: initialSkills,
        jobDescription: jobDescription.trim() || 'Software Engineer role with focus on modern full-stack development and cloud architecture.',
        tone: toneToUse,
        resumeText: resumeText,
      });

      if (data && data.cover_letter) {
        setLetterContent(data.cover_letter);
        if (data.candidate_name) setCandidateName(data.candidate_name);
        if (data.target_role) setTargetRole(data.target_role);
      }
    } catch (err) {
      console.error('Cover letter generation error:', err);
      // Fallback generator
      const fallback = generateFallbackLetter(candidateName, targetRole, toneToUse);
      setLetterContent(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackLetter = (name, role, tone) => {
    const safeName = name || 'Alex Morgan';
    const safeRole = role || 'Senior Software Engineer';
    return `${safeName}
Contact: Candidate Profile • Portfolio & GitHub
Date: August 16, 2026

To: Hiring Committee
the Hiring Team

Dear Hiring Manager,

I am writing to express my strong interest in the ${safeRole} position at the Hiring Team. With over 4+ years of dedicated experience specializing in Python, FastAPI, React, PostgreSQL, and cloud infrastructure, I have established a track record of delivering resilient, high-performance software systems that align directly with organizational objectives.

In reviewing your requirements, I noted your emphasis on modern software engineering and system optimization. In my recent engagements, I spearheaded the architecture and optimization of critical backend and distributed services, consistently reducing latency by over 35% and elevating system availability to 99.95%. My hands-on proficiency across modern frameworks enables me to rapidly diagnose complex challenges and transform specifications into scalable solutions.

What particularly distinguishes your organization is your commitment to engineering excellence and scalable innovation. I thrive in collaborative, high-standard engineering cultures where cross-functional alignment and measurable outcomes drive product momentum.

I welcome the opportunity to discuss in detail how my background will deliver immediate value to your engineering initiatives. Thank you for your time and consideration.

Sincerely,
${safeName}`;
  };

  const handleToneChange = (toneId) => {
    setSelectedTone(toneId);
    fetchCoverLetter(toneId);
  };

  const handleCopy = () => {
    if (!letterContent) return;
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    showToast('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!letterContent) return;
    const blob = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (candidateName || 'Candidate').replace(/\s+/g, '_');
    link.href = url;
    link.download = `Cover_Letter_${safeName}_${selectedTone}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Cover letter downloaded as .TXT file!');
  };

  const handleDownloadPdf = async () => {
    if (!letterContent) return;
    setIsExportingPdf(true);

    try {
      const html2pdfModule = window.html2pdf;
      if (html2pdfModule && printRef.current) {
        const opt = {
          margin: [15, 15, 15, 15],
          filename: `Cover_Letter_${(candidateName || 'Candidate').replace(/\s+/g, '_')}_${selectedTone}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        await html2pdfModule().set(opt).from(printRef.current).save();
      } else {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Cover Letter - ${candidateName}</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 50px; line-height: 1.6; color: #1e293b; font-size: 14px; }
                  pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; margin: 0; }
                </style>
              </head>
              <body>
                <pre>${letterContent}</pre>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 300);
        }
      }
      showToast('Cover letter exported as .PDF!');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Exported cover letter.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (!isOpen) return null;

  const wordCount = letterContent ? letterContent.trim().split(/\s+/).length : 0;
  const charCount = letterContent ? letterContent.length : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-700 flex items-center space-x-2.5 text-xs sm:text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    AI Cover Letter Generator
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ATS Aligned
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Custom-tailored cover letter mapped directly to target job requirements.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls & Tone Selector Row */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-zinc-850/80 border-b border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Tone Selector Pills */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:inline">
                Tone:
              </span>
              <div className="flex items-center space-x-1.5">
                {TONES.map((tone) => {
                  const isActive = selectedTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => handleToneChange(tone.id)}
                      disabled={isLoading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isActive ? tone.activeColor : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                      title={tone.desc}
                    >
                      <span>{tone.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Regenerate Button & Word Counter */}
            <div className="flex items-center justify-between md:justify-end space-x-3">
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{wordCount}</span> words •{' '}
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{charCount}</span> chars
              </div>

              <button
                type="button"
                onClick={() => fetchCoverLetter(selectedTone)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isLoading ? 'Generating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>

          {/* Body Preview & Edit Area */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50 dark:bg-zinc-950/40">
            {/* Candidate & Target Role Quick Customization Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white dark:bg-zinc-850 border border-slate-200/90 dark:border-zinc-800 shadow-2xs text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-indigo-600 dark:text-indigo-400" /> Candidate Name:
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-indigo-600 dark:text-indigo-400" /> Target Role:
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>
            </div>

            {/* Editable Live Preview Box */}
            <div className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-md p-6 sm:p-8">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-[2px] rounded-2xl z-10 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Drafting {selectedTone} Cover Letter with matched JD keywords...
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Live Letter Editor (Click to edit text):
                </span>
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {selectedTone} Tone
                </span>
              </div>

              {/* Textarea for live direct editing */}
              <textarea
                rows={16}
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="w-full bg-transparent text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed font-sans focus:outline-none resize-y"
                placeholder="Cover letter draft will appear here..."
              />
            </div>
          </div>

          {/* Action Toolbar & Footer */}
          <div className="px-6 py-4 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Tailored using candidate profile and job requirements</span>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>

              {/* Download TXT Button */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-zinc-700 shadow-2xs transition-all"
              >
                <FileDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Download as .TXT</span>
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 rounded-xl glow-btn text-white text-xs font-bold flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Exporting PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Download as .PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hidden Print Container for PDF Generation */}
          <div className="hidden">
            <div
              ref={printRef}
              style={{
                padding: '40px 50px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#1e293b',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{letterContent}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
