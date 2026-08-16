/**
 * LocalStorage Service for Scan History & Version Comparison
 * Manages the latest 10 ATS analysis scans.
 */

const STORAGE_KEY = 'smart_resume_scan_history_v1';
const MAX_HISTORY_ITEMS = 10;

/**
 * Retrieves all saved scan records from LocalStorage.
 * @returns {Array} List of scan objects sorted by timestamp descending.
 */
export const getScanHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read scan history from LocalStorage:', err);
    return [];
  }
};

export const getHistory = getScanHistory;

/**
 * Saves a new scan record to LocalStorage, keeping the latest 10 items.
 */
export const saveScanToHistory = (scanData) => {
  try {
    if (!scanData) return null;

    const history = getScanHistory();

    // Support both direct item object and { result, targetRole, resumeName, jobDescription }
    const result = scanData.result || scanData.fullResult || scanData;
    const targetRole = scanData.targetRole || 'Software Professional';
    const resumeName = scanData.resumeName || scanData.fileName || result.metadata?.filename || 'Uploaded Resume';
    const jobDescription = scanData.jobDescription || '';

    const newScanItem = {
      id: scanData.id || `scan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: scanData.timestamp || new Date().toISOString(),
      formattedDate: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
      resumeName,
      fileName: resumeName,
      fileUrl: scanData.fileUrl || null,
      storagePath: scanData.storagePath || null,
      targetRole,
      jobDescription,
      overallScore: Math.round(scanData.score || scanData.overallScore || result.ats_score || result.scores?.overall_score || 0),
      score: Math.round(scanData.score || scanData.overallScore || result.ats_score || result.scores?.overall_score || 0),
      similarityScore: Math.round(result.similarity_score || result.scores?.keyword_match || 0),
      skillsScore: Math.round(result.skills_score || result.scores?.skills_match || 0),
      healthScore: result.ats_health_audit?.health_score ?? Math.round(result.scores?.formatting_score || 80),
      healthGrade: result.ats_health_audit?.health_grade || 'Good',
      matchedSkills: scanData.matchedSkills || result.technical_skills?.matched || [],
      missingSkills: scanData.missingSkills || result.missing_critical_skills || result.technical_skills?.missing || [],
      candidateSeniority: result.experience_fit?.candidate_seniority || 'Mid',
      fullResult: result,
      summary: scanData.summary || result.summary_verdict || '',
    };

    // Prepend new item and slice to max 10
    const updatedHistory = [newScanItem, ...history.filter((h) => h.id !== newScanItem.id)].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    return newScanItem;
  } catch (err) {
    console.error('Failed to save scan to LocalStorage:', err);
    return null;
  }
};

export const saveToHistory = saveScanToHistory;

/**
 * Deletes a single scan record by ID.
 */
export const deleteScanItem = (id) => {
  try {
    const history = getScanHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan item:', err);
    return getScanHistory();
  }
};

export const deleteFromHistory = deleteScanItem;

/**
 * Clears all scan history from LocalStorage.
 */
export const clearScanHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear scan history:', err);
    return [];
  }
};

/**
 * Retrieves a single scan by ID.
 */
export const getScanItemById = (id) => {
  const history = getScanHistory();
  return history.find((item) => item.id === id) || null;
};
