import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs worker for Vite
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
  } catch (e) {
    console.warn('PDF.js worker setup fallback:', e);
  }
}

/**
 * Extract plain text from PDF File in Browser
 */
export const extractTextFromPdf = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;

    let fullText = '';
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message || 'Corrupted or password protected'}`);
  }
};

/**
 * Extract plain text from DOCX File in Browser
 */
export const extractTextFromDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
};

/**
 * Extract plain text from TXT File
 */
export const extractTextFromTxt = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result.trim());
    reader.onerror = (e) => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

/**
 * Universal Client-Side Resume File Parser
 */
export const parseResumeFile = async (file) => {
  if (!file) throw new Error('No file provided');

  const fileName = file.name.toLowerCase();
  let rawText = '';

  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    rawText = await extractTextFromPdf(file);
  } else if (
    fileName.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    rawText = await extractTextFromDocx(file);
  } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
    rawText = await extractTextFromTxt(file);
  } else {
    // Attempt text fallback
    try {
      rawText = await extractTextFromTxt(file);
    } catch {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
    }
  }

  if (!rawText || rawText.trim().length < 20) {
    throw new Error('Resume file seems empty or could not be read properly.');
  }

  const structured = extractMetadataFromText(rawText);
  return {
    rawText,
    ...structured,
  };
};

/**
 * Extract Contact Info, Keywords, and Sections from Plain Text
 */
export const extractMetadataFromText = (text) => {
  if (!text) return { email: '', phone: '', name: '', detectedSections: [] };

  // Email regex
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
  const email = emailMatch ? emailMatch[1] : '';

  // Phone regex
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Attempt Name extraction (first line or before email)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let name = '';
  if (lines.length > 0) {
    const candidateName = lines[0].replace(/[^a-zA-Z\s]/g, '').trim();
    if (candidateName.length > 2 && candidateName.split(' ').length <= 4) {
      name = candidateName;
    }
  }

  // Detect standard sections
  const sectionKeywords = [
    'experience', 'work experience', 'employment history',
    'skills', 'technical skills', 'core competencies',
    'education', 'academic background',
    'projects', 'key projects',
    'certifications', 'licenses',
    'summary', 'professional summary', 'objective',
  ];

  const detectedSections = [];
  const lowerText = text.toLowerCase();
  sectionKeywords.forEach((sec) => {
    if (lowerText.includes(sec)) {
      detectedSections.push(sec);
    }
  });

  return {
    name,
    email,
    phone,
    wordCount: text.split(/\s+/).length,
    detectedSections,
  };
};
