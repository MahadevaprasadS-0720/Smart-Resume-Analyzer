import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import TiltCard from './components/TiltCard';
import Antigravity3DScene from './components/Antigravity3DScene';
import BulletRewriter from './components/BulletRewriter';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import InterviewPrep from './components/InterviewPrep';
import HistoryDrawer from './components/HistoryDrawer';
import CompareModal from './components/CompareModal';
import AuthModal from './components/AuthModal';
import {
  auth,
  onAuthStateChanged,
  logoutUser,
} from './firebase/config';
import {
  uploadResumeToStorage,
  saveScanReport,
  subscribeToScans,
  removeScanReport,
} from './services/firebaseService';
import {
  clearScanHistory,
} from './services/historyStorage';
import {
  checkBackendHealth,
  analyzeResume,
} from './services/api';
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

/* ── Smooth Scroll Progress Bar ─────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [inputMode, setInputMode] = useState('file');
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isBulletRewriterOpen, setIsBulletRewriterOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isInterviewPrepOpen, setIsInterviewPrepOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareScanA, setCompareScanA] = useState(null);
  const [compareScanB, setCompareScanB] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`Signed in as ${user.displayName || user.email}`);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Scan Vault Subscription
  useEffect(() => {
    const unsubscribe = subscribeToScans(currentUser, (scans) => {
      setScanHistory(scans);
    });
    return () => unsubscribe();
  }, [currentUser]);

  /* Confetti burst on analysis complete */
  const fireConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#4F46E5', '#2563EB', '#06B6D4', '#10B981', '#F59E0B'],
        zIndex: 9000,
        scalar: 1.2,
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 70,
          angle: 60,
          origin: { y: 0.5, x: 0.15 },
          colors: ['#4F46E5', '#06B6D4'],
          zIndex: 9000,
        });
        confetti({
          particleCount: 60,
          spread: 70,
          angle: 120,
          origin: { y: 0.5, x: 0.85 },
          colors: ['#2563EB', '#10B981'],
          zIndex: 9000,
        });
      }, 250);
    } catch (e) {
      // silently skip
    }
  };

  // 3. Serverless Client-Side Analysis & Cloud Sync
  const handleAnalyze = async () => {
    setError('');
    if (inputMode === 'file' && !file) {
      setError('Please upload a resume file (PDF/DOCX/TXT).');
      return;
    }
    if (inputMode === 'text' && !rawText.trim()) {
      setError('Please paste your resume text to proceed with analysis.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description to match against.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Run 100% Client-Side Serverless AI Resume Analysis
      const result = await analyzeResume({
        file: inputMode === 'file' ? file : null,
        resumeText: inputMode === 'text' ? rawText : null,
        jobDescription,
        targetRole,
      });

      setAnalysisResult(result);
      if ((result?.ats_score || 85) >= 60) {
        fireConfetti();
      }

      // 2. Upload file to Firebase Storage if user is authenticated and uploaded a file
      let fileUrl = null;
      let storagePath = null;
      if (file && currentUser) {
        const uploadRes = await uploadResumeToStorage(file, currentUser.uid);
        fileUrl = uploadRes.fileUrl;
        storagePath = uploadRes.storagePath;
      }

      // 3. Save Scan Report to Firestore & Local Storage
      await saveScanReport(
        {
          id: `scan_${Date.now()}`,
          score: result.ats_score || result.score,
          overallScore: result.ats_score || result.score,
          targetRole: targetRole || 'Software Professional',
          fileName: file?.name || 'Pasted_Resume.txt',
          resumeName: file?.name || 'Pasted_Resume.txt',
          fileUrl,
          storagePath,
          matchedSkills: result.matchedSkills || result.technical_skills?.matched || [],
          missingSkills: result.missingSkills || result.missing_critical_skills || [],
          summary: result.summary_verdict || '',
          fullResult: result,
          jobDescription,
        },
        currentUser
      );

      showToast('✨ Precision scan complete & saved to Vault!');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Analysis failed: ${err.message || 'An error occurred during parsing.'}`);
      showToast(`Analysis failed: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const handleDeleteScan = async (id, storagePath) => {
    await removeScanReport(id, currentUser, storagePath);
    showToast('Scan removed from history.');
  };

  const handleClearHistory = () => {
    clearScanHistory();
    setScanHistory([]);
    showToast('Local scan history cleared.');
  };

  const handleRestoreScan = (scan) => {
    if (scan) {
      const fullRes = scan.fullResult || {
        ats_score: scan.score || scan.overallScore || 85,
        similarity_score: scan.score || 85,
        skills_score: scan.score || 85,
        summary_verdict: scan.summary || `Scan report for ${scan.targetRole}`,
        technical_skills: {
          matched: scan.matchedSkills || [],
          missing: scan.missingSkills || [],
        },
        missing_critical_skills: scan.missingSkills || [],
        metadata: {
          filename: scan.fileName || scan.resumeName || 'Resume.pdf',
          word_count: 550,
          page_count: 1,
          detected_emails: ['candidate@example.com'],
          detected_phones: ['+1 (555) 019-2834'],
        },
      };

      setAnalysisResult(fullRes);
      if (scan.targetRole) setTargetRole(scan.targetRole);
      if (scan.jobDescription) setJobDescription(scan.jobDescription);
      setIsHistoryDrawerOpen(false);
      showToast(`📂 Loaded scan: ${scan.targetRole}`);
    }
  };

  const handleCompareScans = (scanA, scanB) => {
    setCompareScanA(scanA);
    setCompareScanB(scanB);
    setIsHistoryDrawerOpen(false);
    setIsCompareModalOpen(true);
  };

  const handleReset = () => setAnalysisResult(null);

  const candidateDetectedName =
    currentUser?.displayName ||
    analysisResult?.metadata?.detected_emails?.[0]?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Candidate';

  return (
    <div className="light-canvas min-h-screen text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white relative">
      {/* 🚀 3D WebGL Antigravity Background Scene */}
      <Antigravity3DScene />

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.92, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.92, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 right-5 z-[999] px-4 py-3 rounded-2xl
              ${toastType === 'error' ? 'bg-rose-900 border-rose-700' : 'bg-slate-900 border-slate-700'}
              text-white shadow-xl shadow-slate-900/20 border flex items-center space-x-2.5 text-xs font-bold`}
          >
            <CheckCircle2 className={`w-4 h-4 ${toastType === 'error' ? 'text-rose-400' : 'text-emerald-400'} shrink-0`} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Crystalline White Navbar with Firebase Auth */}
      <Navbar
        user={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenBulletRewriter={() => setIsBulletRewriterOpen(true)}
        onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
        onOpenInterviewPrep={() => setIsInterviewPrepOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        historyCount={scanHistory.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        {!analysisResult ? (
          <div className="space-y-8 sm:space-y-10">

            {/* ── High-Impact 3D Hero Section ──────────────── */}
            <div className="text-center max-w-4xl mx-auto space-y-4 pt-4">

              {/* Minimal Clean 3D Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full
                  bg-white/90 backdrop-blur-md border border-indigo-200/90 text-xs font-black text-indigo-700
                  shadow-md shadow-indigo-100/60"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                </span>
                <span>✦ 100% SERVERLESS FIREBASE + CLIENT-SIDE AI</span>
              </motion.div>

              {/* Razor-Sharp High-Contrast Headline with 3D Depth */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.05 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] text-slate-900"
              >
                Land Your Dream Job with{' '}
                <span className="hero-gradient-text">
                  10x ATS Precision
                </span>
              </motion.h1>

              {/* High-Contrast Clear Subline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
                className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold"
              >
                Drop your resume. Paste the job description. Unlock instant interview-ready scores.
              </motion.p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto p-4 rounded-2xl
                    bg-rose-50 border border-rose-200
                    text-rose-800 text-xs font-bold
                    flex items-start space-x-3 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2-Column Bento Input Grid with 3D Parallax Tilt */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            >
              <TiltCard tiltIntensity={4}>
                <FileUpload
                  file={file}
                  setFile={setFile}
                  rawText={rawText}
                  setRawText={setRawText}
                  inputMode={inputMode}
                  setInputMode={setInputMode}
                  isLoading={isLoading}
                />
              </TiltCard>

              <TiltCard tiltIntensity={4}>
                <JobDescriptionInput
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  targetRole={targetRole}
                  setTargetRole={setTargetRole}
                />
              </TiltCard>
            </motion.div>

            {/* Confident Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.25 }}
              className="flex justify-center pt-2 pb-8"
            >
              <motion.button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="btn-primary-gradient group relative inline-flex items-center justify-center
                  w-full max-w-xl py-5 px-8 text-base sm:text-lg font-black
                  rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:transform-none shadow-2xl shadow-indigo-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin text-white" />
                    <span className="tracking-wide text-white">Extracting & Calculating Match Score...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2.5 text-white group-hover:scale-125 transition-transform duration-200" />
                    <span className="tracking-wide text-white">Analyze Resume Fit & Score</span>
                    <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-200 text-white" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <AnalysisDashboard
            result={analysisResult}
            targetRole={targetRole}
            onReset={handleReset}
            onOpenBulletRewriter={() => setIsBulletRewriterOpen(true)}
            onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
            onOpenInterviewPrep={() => setIsInterviewPrepOpen(true)}
            onOpenHistory={() => setIsHistoryDrawerOpen(true)}
            onOpenCompare={() => setIsCompareModalOpen(true)}
          />
        )}
      </main>

      {/* Drawers & Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome, ${user.displayName || user.email}!`);
        }}
      />
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={scanHistory}
        user={currentUser}
        onDeleteScan={handleDeleteScan}
        onClearHistory={handleClearHistory}
        onRestoreScan={handleRestoreScan}
        onCompareScans={handleCompareScans}
      />
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        history={scanHistory}
        initialScanA={compareScanA}
        initialScanB={compareScanB}
      />
      <BulletRewriter
        isOpen={isBulletRewriterOpen}
        onClose={() => setIsBulletRewriterOpen(false)}
        defaultTargetRole={targetRole}
      />
      <CoverLetterGenerator
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        initialCandidateName={candidateDetectedName}
        initialTargetRole={targetRole}
        initialSkills={analysisResult?.technical_skills?.matched || []}
        initialJobDescription={jobDescription}
        resumeText={inputMode === 'text' ? rawText : ''}
      />
      <InterviewPrep
        isOpen={isInterviewPrepOpen}
        onClose={() => setIsInterviewPrepOpen(false)}
        matchedSkills={analysisResult?.technical_skills?.matched || []}
        missingSkills={analysisResult?.missing_critical_skills || []}
        targetRole={targetRole || 'Senior Software Engineer'}
        seniorityLevel={analysisResult?.experience_fit?.candidate_seniority || 'Senior'}
        jobDescription={jobDescription}
        resumeText={inputMode === 'text' ? rawText : ''}
      />

      {/* Clean White Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            © 2026 Resume<span className="text-indigo-600 font-black">AI</span> ·{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 font-bold">
              100% Serverless Firebase + Client AI
            </span>
          </p>
          <div className="flex items-center space-x-3 text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              AI Core Online
            </span>
            <span>·</span>
            <span>Instant Precision Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
