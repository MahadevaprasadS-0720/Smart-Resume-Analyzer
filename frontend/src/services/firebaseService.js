import {
  db,
  storage,
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  isFirebaseConfigured,
} from '../firebase/config';
import { getHistory, saveToHistory, deleteFromHistory } from './historyStorage';

/**
 * Upload Resume File to Firebase Storage
 */
export const uploadResumeToStorage = async (file, userId) => {
  if (!file || !userId || !isFirebaseConfigured()) {
    return { fileUrl: null, storagePath: null };
  }

  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `resumes/${userId}/${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    return { fileUrl, storagePath, error: null };
  } catch (error) {
    console.warn('Firebase Storage upload failed, continuing locally:', error);
    return { fileUrl: null, storagePath: null, error: error.message };
  }
};

/**
 * Save Scan Report to Firestore & Local Storage
 */
export const saveScanReport = async (scanData, user = null) => {
  const scanId = scanData.id || `scan_${Date.now()}`;
  const record = {
    id: scanId,
    timestamp: scanData.timestamp || new Date().toISOString(),
    score: scanData.score || 0,
    targetRole: scanData.targetRole || 'Software Professional',
    fileName: scanData.fileName || 'Uploaded_Resume',
    fileUrl: scanData.fileUrl || null,
    storagePath: scanData.storagePath || null,
    matchedSkills: scanData.matchedSkills || [],
    missingSkills: scanData.missingSkills || [],
    summary: scanData.summary || '',
    strengths: scanData.strengths || [],
    improvements: scanData.improvements || [],
    formattingAudit: scanData.formattingAudit || {},
  };

  // Always save to local storage as fallback
  saveToHistory(record);

  // If user is authenticated and Firebase is configured, sync to Firestore
  if (user && user.uid && isFirebaseConfigured()) {
    try {
      const scanRef = doc(db, 'users', user.uid, 'scans', scanId);
      await setDoc(scanRef, {
        ...record,
        userId: user.uid,
        userEmail: user.email || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore sync failed, saved locally:', e);
    }
  }

  return record;
};

/**
 * Real-time Listener for User Scans from Firestore (with LocalStorage Fallback)
 */
export const subscribeToScans = (user, callback) => {
  // If user not authenticated or Firebase not configured, return local storage items
  if (!user || !user.uid || !isFirebaseConfigured()) {
    const localScans = getHistory();
    callback(localScans);
    return () => {};
  }

  try {
    const scansQuery = query(
      collection(db, 'users', user.uid, 'scans'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      scansQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const scans = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            // Format timestamp for display
            timestamp: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : d.data().timestamp,
          }));
          callback(scans);
        } else {
          // Fallback to local storage if Firestore is empty
          callback(getHistory());
        }
      },
      (error) => {
        console.warn('Firestore subscription error, using local history:', error);
        callback(getHistory());
      }
    );

    return unsubscribe;
  } catch (e) {
    console.warn('Error creating Firestore listener:', e);
    callback(getHistory());
    return () => {};
  }
};

/**
 * Delete Scan from Firestore and Storage
 */
export const removeScanReport = async (scanId, user = null, storagePath = null) => {
  // Delete from local storage
  deleteFromHistory(scanId);

  // If user is authenticated, delete from Firestore
  if (user && user.uid && isFirebaseConfigured()) {
    try {
      const scanRef = doc(db, 'users', user.uid, 'scans', scanId);
      await deleteDoc(scanRef);

      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore delete failed:', e);
    }
  }
};
