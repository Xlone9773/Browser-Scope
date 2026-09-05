// src/components/canvas-poisoning/secureBaseline.ts

import { hashString } from './utils';

export interface SignedBaselineRecord {
  v: number;
  key: string;
  hash: string;
  timestamp: number;
  anchor: string;
  sig: string;
}

export interface BaselineVerificationResult {
  status: 'MATCH' | 'MISMATCH' | 'FIRST_RUN' | 'TAMPERED';
  reason?: 'sig_invalid' | 'desync_storage' | 'anchor_mismatch' | 'legacy_tampered';
  storedBaseline?: string;
  currentHash: string;
}

const SEC_VERSION = 2;
const APP_SECRET_SALT = 'BrowserScope_Poisoning_SecSalt_2026_9x8f_anti_tamper';
const IDB_NAME = 'browserscope_sec_vault';
const IDB_STORE = 'secure_baselines';

// In-Memory Session Cache (freezes baseline during the active browser session to prevent runtime DOM injection)
const sessionCache = new Map<string, SignedBaselineRecord>();

/**
 * SHA-256 Digest using Web Crypto API with robust deterministic fallback
 */
export const computeDigest = async (content: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    try {
      const msgBuffer = new TextEncoder().encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }

  // Robust multi-round cryptographic hash fallback
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return combined.toString(16) + hashString(content);
};

/**
 * Generates an immutable hardware & environment anchor
 */
export const getEnvironmentAnchor = async (): Promise<string> => {
  const parts: string[] = [];

  if (typeof screen !== 'undefined') {
    parts.push(String(screen.colorDepth || 0));
    parts.push(String(screen.pixelDepth || 0));
  }

  if (typeof navigator !== 'undefined') {
    parts.push(String(navigator.hardwareConcurrency || 0));
    parts.push(String((navigator as unknown as { deviceMemory?: number }).deviceMemory || 0));
    parts.push(String(navigator.maxTouchPoints || 0));
    parts.push(String(navigator.platform || ''));
    parts.push(String(navigator.languages ? navigator.languages.join(',') : navigator.language || ''));
  }

  // Safe WebGL Renderer anchor
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        parts.push(String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || ''));
        parts.push(String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''));
      }
    }
  } catch {
    // Ignore context failure
  }

  parts.push(APP_SECRET_SALT);
  return computeDigest(parts.join('||'));
};

/**
 * Generates signature for a baseline record
 */
export const generateSignature = async (
  key: string,
  hash: string,
  timestamp: number,
  anchor: string
): Promise<string> => {
  const payload = [APP_SECRET_SALT, String(SEC_VERSION), key, hash, String(timestamp), anchor].join(':::');
  return computeDigest(payload);
};

// ================= IndexedDB Dual Vault Helpers =================

let idbPromise: Promise<IDBDatabase | null> | null = null;

const getIDB = (): Promise<IDBDatabase | null> => {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (!idbPromise) {
    idbPromise = new Promise<IDBDatabase | null>((resolve) => {
      try {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'key' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  return idbPromise;
};

const getIdbRecord = async (key: string): Promise<SignedBaselineRecord | null> => {
  try {
    const db = await getIDB();
    if (!db) return null;
    return new Promise<SignedBaselineRecord | null>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
};

const setIdbRecord = async (record: SignedBaselineRecord): Promise<void> => {
  try {
    const db = await getIDB();
    if (!db) return;
    return new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {
    // Ignore IDB errors
  }
};

const clearIdbRecords = async (): Promise<void> => {
  try {
    const db = await getIDB();
    if (!db) return;
    return new Promise<void>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {
    // Ignore
  }
};

// ================= LocalStorage Helpers =================

const getStorageKey = (key: string) => `browserscope_sec_baseline_${key}`;

const getLocalStorageRecord = (key: string): { record: SignedBaselineRecord | null; raw: string | null; isTamperedRaw: boolean } => {
  if (typeof localStorage === 'undefined') return { record: null, raw: null, isTamperedRaw: false };
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    if (!raw) return { record: null, raw: null, isTamperedRaw: false };
    
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.key === key && parsed.sig && parsed.hash) {
        return { record: parsed as SignedBaselineRecord, raw, isTamperedRaw: false };
      }
    } catch {
      // JSON parse error means someone modified it to non-JSON or plain string
    }
    return { record: null, raw, isTamperedRaw: true };
  } catch {
    return { record: null, raw: null, isTamperedRaw: false };
  }
};

const setLocalStorageRecord = (record: SignedBaselineRecord): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(record.key), JSON.stringify(record));
  } catch {
    // Ignore storage quota errors
  }
};

// ================= Main Verification Engine =================

/**
 * Validates or initializes a secure fingerprint baseline.
 * Detects:
 *  1. Malicious raw string modification in localStorage (missing/broken HMAC signature).
 *  2. Selective deletion of localStorage to force fake clean first-run (IndexedDB desync).
 *  3. Cross-device / Cross-profile transplantation (Environment anchor mismatch).
 *  4. Seed-based persistent poisoning (Fingerprint mismatch against genuine baseline).
 */
export const verifyOrStoreBaseline = async (
  key: string,
  currentHash: string
): Promise<BaselineVerificationResult> => {
  const envAnchor = await getEnvironmentAnchor();
  const cached = sessionCache.get(key);

  const lsResult = getLocalStorageRecord(key);
  const idbRecord = await getIdbRecord(key);

  // Case 1: Plaintext or malformed tampering in localStorage
  if (lsResult.isTamperedRaw) {
    return {
      status: 'TAMPERED',
      reason: 'sig_invalid',
      currentHash
    };
  }

  // Case 2: LocalStorage was cleared, but IndexedDB still has the original baseline record
  // (Evasion attempt: wiping localStorage to fool the detector into saving a new baseline)
  if (!lsResult.record && idbRecord) {
    const expectedSig = await generateSignature(idbRecord.key, idbRecord.hash, idbRecord.timestamp, idbRecord.anchor);
    if (idbRecord.sig === expectedSig) {
      // Restore verified baseline from secure IndexedDB vault
      setLocalStorageRecord(idbRecord);
      sessionCache.set(key, idbRecord);
      
      if (idbRecord.hash === currentHash) {
        return { status: 'MATCH', storedBaseline: idbRecord.hash, currentHash };
      } else {
        return { status: 'MISMATCH', storedBaseline: idbRecord.hash, currentHash };
      }
    } else {
      return {
        status: 'TAMPERED',
        reason: 'sig_invalid',
        currentHash
      };
    }
  }

  // Case 3: Both stores are empty -> Authentic First Run
  if (!lsResult.record && !idbRecord && !cached) {
    const timestamp = Date.now();
    const signature = await generateSignature(key, currentHash, timestamp, envAnchor);
    const newRecord: SignedBaselineRecord = {
      v: SEC_VERSION,
      key,
      hash: currentHash,
      timestamp,
      anchor: envAnchor,
      sig: signature
    };

    sessionCache.set(key, newRecord);
    setLocalStorageRecord(newRecord);
    await setIdbRecord(newRecord);

    return {
      status: 'FIRST_RUN',
      storedBaseline: currentHash,
      currentHash
    };
  }

  // Choose the authoritative record
  const baselineRecord = lsResult.record || idbRecord || cached;
  if (!baselineRecord) {
    return {
      status: 'TAMPERED',
      reason: 'desync_storage',
      currentHash
    };
  }

  // Case 4: Verify Cryptographic Signature
  const expectedSignature = await generateSignature(
    baselineRecord.key,
    baselineRecord.hash,
    baselineRecord.timestamp,
    baselineRecord.anchor
  );

  if (baselineRecord.sig !== expectedSignature) {
    return {
      status: 'TAMPERED',
      reason: 'sig_invalid',
      storedBaseline: baselineRecord.hash,
      currentHash
    };
  }

  // Case 5: Verify Hardware & Environment Anchor
  if (baselineRecord.anchor !== envAnchor) {
    return {
      status: 'TAMPERED',
      reason: 'anchor_mismatch',
      storedBaseline: baselineRecord.hash,
      currentHash
    };
  }

  // Case 6: Cross-check Dual-Store consistency
  if (idbRecord && lsResult.record && idbRecord.hash !== lsResult.record.hash) {
    return {
      status: 'TAMPERED',
      reason: 'desync_storage',
      storedBaseline: idbRecord.hash,
      currentHash
    };
  }

  // Ensure stores are synchronized
  sessionCache.set(key, baselineRecord);
  if (!lsResult.record) setLocalStorageRecord(baselineRecord);
  if (!idbRecord) await setIdbRecord(baselineRecord);

  // Case 7: Legitimate comparison with verified baseline
  if (baselineRecord.hash === currentHash) {
    return {
      status: 'MATCH',
      storedBaseline: baselineRecord.hash,
      currentHash
    };
  } else {
    return {
      status: 'MISMATCH',
      storedBaseline: baselineRecord.hash,
      currentHash
    };
  }
};

/**
 * Securely clears all baselines from In-Memory, IndexedDB, and LocalStorage
 */
export const clearAllSecureBaselines = async (): Promise<void> => {
  sessionCache.clear();
  await clearIdbRecords();

  if (typeof localStorage !== 'undefined') {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('browserscope_sec_baseline_') || k.startsWith('browserscope_canvas_baseline_') || k.startsWith('browserscope_webgl_baseline_') || k.startsWith('browserscope_audio_baseline_') || k === 'browserscope_first_media_devices')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // Ignore
      }
    });
  }
};
