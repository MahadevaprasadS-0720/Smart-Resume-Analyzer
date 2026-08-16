import {
  analyzeResumeClient,
  rewriteBulletClient,
  generateCoverLetterClient,
  getInterviewPrepClient,
} from './aiAnalyzer';
import { parseResumeFile } from './resumeParser';

/**
 * Health Check (Returns active client-side AI engine status)
 */
export const checkBackendHealth = async () => {
  return {
    status: 'healthy',
    mode: '100% Serverless Client-Side AI',
    engine: 'Firebase + WebGL + Gemini NLP',
    timestamp: new Date().toISOString(),
  };
};

/**
 * Universal Resume Analysis Function (Client-Side Serverless)
 */
export const analyzeResume = async ({ file, resumeText, jobDescription, targetRole = '' }) => {
  let parsedText = resumeText || '';

  // If a file is uploaded, extract plain text in browser
  if (file && !parsedText) {
    const parsedData = await parseResumeFile(file);
    parsedText = parsedData.rawText;
  }

  if (!parsedText || parsedText.trim().length < 20) {
    throw new Error('Please provide resume text or upload a valid resume document.');
  }

  if (!jobDescription || jobDescription.trim().length < 10) {
    throw new Error('Please enter a target job description to match against.');
  }

  // Run client-side AI analysis
  return await analyzeResumeClient({
    file,
    resumeText: parsedText,
    jobDescription,
    targetRole,
  });
};

export const analyzeResumeFile = async (file, jobDescription, targetRole = '') => {
  return analyzeResume({ file, jobDescription, targetRole });
};

export const analyzeResumeText = async (resumeText, jobDescription, targetRole = '') => {
  return analyzeResume({ resumeText, jobDescription, targetRole });
};

/**
 * AI Bullet Point Rewriter
 */
export const rewriteBullet = async ({ bullet, targetRole = '' }) => {
  return await rewriteBulletClient({ bullet, targetRole });
};

/**
 * AI Cover Letter Generator
 */
export const generateCoverLetter = async ({
  candidateName = '',
  targetRole = '',
  skills = [],
  experienceSummary = '',
  jobDescription = '',
  tone = 'Professional',
  resumeText = '',
}) => {
  return await generateCoverLetterClient({
    candidateName,
    targetRole,
    skills,
    experienceSummary,
    jobDescription,
    tone,
    resumeText,
  });
};

/**
 * AI Mock Interview Prep
 */
export const getInterviewPrep = async ({
  matchedSkills = [],
  missingSkills = [],
  targetRole = '',
  seniorityLevel = 'Senior',
  jobDescription = '',
  resumeText = '',
}) => {
  return await getInterviewPrepClient({
    matchedSkills,
    missingSkills,
    targetRole,
    seniorityLevel,
    jobDescription,
    resumeText,
  });
};

export default {
  analyzeResume,
  analyzeResumeFile,
  analyzeResumeText,
  rewriteBullet,
  generateCoverLetter,
  getInterviewPrep,
  checkBackendHealth,
};
