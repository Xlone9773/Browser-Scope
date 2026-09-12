import { useState, useCallback, useEffect } from 'react';

export interface StorageResidueSummary {
  idb: boolean;
  cache: boolean;
  opfs: boolean;
  opfsCount: number;
  hasAny: boolean;
}

export interface StorageUsageEstimate {
  usedBytes: number;
  quotaBytes: number;
  percentage: number;
  formattedUsage: string;
}

export interface CleanupResult {
  success: boolean;
  cleanedItems: number;
  details: {
    idb: boolean;
    cache: boolean;
    opfs: boolean;
  };
  error?: string;
}

export interface UseStorageCleanupReturn {
  isCleaning: boolean;
  isScanning: boolean;
  residueSummary: StorageResidueSummary;
  storageUsage: StorageUsageEstimate | null;
  scanResidues: () => Promise<StorageResidueSummary>;
  clearResidues: (target?: 'all' | 'idb' | 'cache' | 'opfs') => Promise<CleanupResult>;
}

export const useStorageCleanup = (): UseStorageCleanupReturn => {
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [residueSummary, setResidueSummary] = useState<StorageResidueSummary>({
    idb: false,
    cache: false,
    opfs: false,
    opfsCount: 0,
    hasAny: false,
  });
  const [storageUsage, setStorageUsage] = useState<StorageUsageEstimate | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const updateStorageEstimate = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator?.storage?.estimate) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage ?? 0;
        const quota = estimate.quota ?? 0;
        const percentage = quota > 0 ? (usage / quota) * 100 : 0;
        setStorageUsage({
          usedBytes: usage,
          quotaBytes: quota,
          percentage: Math.min(100, Math.max(0, percentage)),
          formattedUsage: formatBytes(usage),
        });
      }
    } catch (err: unknown) {
      console.warn('Unable to retrieve storage estimate:', err);
    }
  }, []);

  const scanResidues = useCallback(async (): Promise<StorageResidueSummary> => {
    setIsScanning(true);
    const summary: StorageResidueSummary = {
      idb: false,
      cache: false,
      opfs: false,
      opfsCount: 0,
      hasAny: false,
    };

    try {
      // 1. Scan IndexedDB
      try {
        if (typeof indexedDB !== 'undefined') {
          if (indexedDB.databases) {
            const dbs = await indexedDB.databases();
            summary.idb = dbs?.some((db) => db.name === 'BrowserScopeBench' || db.name?.startsWith('bench_')) ?? false;
          } else {
            // Fallback for browsers without indexedDB.databases()
            const exists = await new Promise<boolean>((resolve) => {
              const req = indexedDB.open('BrowserScopeBench');
              let isNew = false;
              req.onupgradeneeded = () => {
                isNew = true;
              };
              req.onsuccess = (e: Event) => {
                const db = (e.target as IDBOpenDBRequest)?.result;
                db?.close();
                if (isNew) {
                  indexedDB.deleteDatabase('BrowserScopeBench');
                  resolve(false);
                } else {
                  resolve(true);
                }
              };
              req.onerror = () => resolve(false);
            });
            summary.idb = exists;
          }
        }
      } catch (idbErr) {
        console.warn('Error scanning IndexedDB residue:', idbErr);
      }

      // 2. Scan Cache Storage
      try {
        if (typeof caches !== 'undefined') {
          const keys = await caches.keys();
          summary.cache = keys?.some((key) => key === 'bench-cache' || key.startsWith('bench_')) ?? false;
        }
      } catch (cacheErr) {
        console.warn('Error scanning Cache Storage residue:', cacheErr);
      }

      // 3. Scan OPFS
      try {
        if (typeof navigator !== 'undefined' && navigator?.storage?.getDirectory) {
          const root = await navigator.storage.getDirectory();
          let opfsCount = 0;
          try {
            // @ts-expect-error async iterator on DirectoryHandle
            for await (const [name] of root) {
              if (name?.startsWith('bench_') || name === 'bench-cache' || name === 'BrowserScopeBench') {
                opfsCount += 1;
              }
            }
          } catch {
            // Async iterator not supported in this engine context
          }
          summary.opfsCount = opfsCount;
          summary.opfs = opfsCount > 0;
        }
      } catch (opfsErr) {
        console.warn('Error scanning OPFS residue:', opfsErr);
      }

      summary.hasAny = summary.idb || summary.cache || summary.opfs;
      setResidueSummary(summary);
      await updateStorageEstimate();
      return summary;
    } finally {
      setIsScanning(false);
    }
  }, [updateStorageEstimate]);

  const clearResidues = useCallback(
    async (target: 'all' | 'idb' | 'cache' | 'opfs' = 'all'): Promise<CleanupResult> => {
      setIsCleaning(true);
      const result: CleanupResult = {
        success: true,
        cleanedItems: 0,
        details: {
          idb: false,
          cache: false,
          opfs: false,
        },
      };

      try {
        // 1. Clear IndexedDB
        if (target === 'all' || target === 'idb') {
          try {
            await new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase('BrowserScopeBench');
              req.onsuccess = () => {
                result.details.idb = true;
                result.cleanedItems += 1;
                resolve();
              };
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            });
          } catch (idbErr: unknown) {
            console.error('Failed to delete IDB benchmark database:', idbErr);
          }
        }

        // 2. Clear Cache Storage
        if (target === 'all' || target === 'cache') {
          try {
            if (typeof caches !== 'undefined') {
              const keys = await caches.keys();
              const benchKeys = keys.filter((key) => key === 'bench-cache' || key.startsWith('bench_'));
              for (const key of benchKeys) {
                const deleted = await caches.delete(key);
                if (deleted) {
                  result.cleanedItems += 1;
                }
              }
              result.details.cache = true;
            }
          } catch (cacheErr: unknown) {
            console.error('Failed to delete Cache API benchmark caches:', cacheErr);
          }
        }

        // 3. Clear OPFS
        if (target === 'all' || target === 'opfs') {
          try {
            if (typeof navigator !== 'undefined' && navigator?.storage?.getDirectory) {
              const root = await navigator.storage.getDirectory();
              try {
                // @ts-expect-error async iterator on DirectoryHandle
                for await (const [name] of root) {
                  if (name?.startsWith('bench_') || name === 'bench-cache' || name === 'BrowserScopeBench') {
                    await root.removeEntry(name, { recursive: true }).catch(() => {});
                    result.cleanedItems += 1;
                  }
                }
                result.details.opfs = true;
              } catch {
                // If async iterator fails on some browsers, attempt direct delete
                try {
                  await root.removeEntry('bench_test.bin', { recursive: true }).catch(() => {});
                } catch {}
              }
            }
          } catch (opfsErr: unknown) {
            console.error('Failed to clear OPFS benchmark directory:', opfsErr);
          }
        }

        await scanResidues();
        await updateStorageEstimate();
        return result;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown storage cleanup failure';
        result.success = false;
        result.error = errorMsg;
        return result;
      } finally {
        setIsCleaning(false);
      }
    },
    [scanResidues, updateStorageEstimate]
  );

  useEffect(() => {
    scanResidues();
    updateStorageEstimate();
  }, [scanResidues, updateStorageEstimate]);

  return {
    isCleaning,
    isScanning,
    residueSummary,
    storageUsage,
    scanResidues,
    clearResidues,
  };
};
