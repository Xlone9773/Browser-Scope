import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Activity, Server, Hash } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface Ja3FingerprintModalProps {
  onClose: () => void;
  t: Record<string, string>;
}

interface Ja3Data {
  ja3_hash: string;
  ja3: string;
  ja3n_hash: string;
  ja3n: string;
  user_agent: string;
}

export const Ja3FingerprintModal: React.FC<Ja3FingerprintModalProps> = ({ onClose, t }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Ja3Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performFetch = async () => {
    // JA3 fingerprinting must be done directly from the client.
    // If we use a proxy, the TLS handshake is performed by the Node.js server,
    // which results in the server's JA3 fingerprint and User-Agent being returned instead.
    const res = await fetch('https://tls.browserleaks.com/json').catch(() => null);
    if (!res || !res.ok) throw new Error('Failed to fetch JA3 data. Adblockers or privacy extensions might be blocking the request.');
    return await res.json();
  };

  useEffect(() => {
    let isMounted = true;
    const fetchJa3 = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await performFetch();
        if (isMounted) setData(json);
      } catch (err: unknown) {
        console.error(err);
        if (isMounted) setError(err instanceof Error ? err.message : 'Error fetching TLS Fingerprint');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchJa3();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await performFetch();
        setData(json);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Error fetching TLS Fingerprint');
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal
      title={t?.title || "SSL/TLS Fingerprint (JA3/JA4)"}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-4 p-2">
        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
          <Shield className="text-indigo-500 shrink-0 mt-1" size={24} />
          <div className="text-sm space-y-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t?.desc_title || "TLS Client Hello Fingerprinting"}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {t?.desc || "During the HTTPS handshake, the browser sends a Client Hello message containing supported cipher suites, TLS extensions, etc. JA3/JA4 fingerprints these TCP/TLS characteristics to accurately identify the real browser engine or detect bots, proxies, and spoofed user agents."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Activity className="animate-spin text-indigo-500" size={32} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t?.fetching || "Analyzing TLS Handshake..."}
            </span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-sm border border-rose-100 dark:border-rose-900/50 text-center">
            {error}
            <div className="mt-3">
              <Button size="sm" onClick={handleRetry} variant="soft">{t?.retry || "Retry"}</Button>
            </div>
          </div>
        ) : data ? (
          <div className="grid gap-3">
            {/* JA3 Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint className="text-indigo-500" size={18} />
                <h5 className="font-semibold text-slate-800 dark:text-slate-100">{t?.ja3_title || "JA3 Fingerprint"}</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{t?.ja3_hash || "JA3 Hash (MD5)"}</span>
                  <div className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1 select-all">
                    {data.ja3_hash || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{t?.ja3_string || "JA3 String (Raw)"}</span>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1 h-24 overflow-y-auto select-all">
                    {data.ja3 || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* JA3N Section */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="text-emerald-500" size={18} />
                <h5 className="font-semibold text-slate-800 dark:text-slate-100">{t?.ja3n_title || "JA3N Fingerprint"}</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{t?.ja3n_hash || "JA3N Hash (MD5)"}</span>
                  <div className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1 select-all">
                    {data.ja3n_hash || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{t?.ja3n_string || "JA3N String (Raw)"}</span>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1 h-20 overflow-y-auto select-all">
                    {data.ja3n || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* User Agent context */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
               <Server className="text-slate-400 shrink-0 mt-0.5" size={16} />
               <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">{t?.server_ua || "Server Detected User-Agent"}</span>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">
                    {data.user_agent || "N/A"}
                  </div>
               </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
