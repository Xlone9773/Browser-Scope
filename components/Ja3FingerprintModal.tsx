import React, { useState, useEffect } from 'react';
import { Shield, Fingerprint, Activity, Server, Hash, Copy, Check, Info, HelpCircle, Terminal } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface Ja3FingerprintModalProps {
  onClose: () => void;
  t: Record<string, string>;
}

interface Ja3Data {
  ja3_hash?: string;
  ja3?: string;
  ja3_text?: string;
  ja3n_hash?: string;
  ja3n?: string;
  ja3n_text?: string;
  ja4?: string;
  ja4_r?: string;
  ja4_o?: string;
  ja4_ro?: string;
  user_agent?: string;
}

const USERSCRIPT_CODE = `// ==UserScript==
// @name         BrowserScope TLS Fingerprint Helper
// @namespace    https://browserleaks.com/
// @version      1.1
// @description  Bypass CORS to fetch real client TLS (JA3/JA4) fingerprint for BrowserScope
// @author       BrowserScope Architect
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      tls.browserleaks.com
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Announce presence
    window.addEventListener('PING_TLS_HELPER', function() {
        window.dispatchEvent(new CustomEvent('PONG_TLS_HELPER'));
    });

    // Listen for custom requests from our web page
    window.addEventListener('GET_TLS_FINGERPRINT', function() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://tls.browserleaks.com/json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: true, data: data }
                    }));
                } catch (e) {
                    window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                        detail: { success: false, error: 'Failed to parse JSON' }
                    }));
                }
            },
            onerror: function(err) {
                window.dispatchEvent(new CustomEvent('TLS_FINGERPRINT_RESPONSE', {
                    detail: { success: false, error: 'Network error in Userscript fetch' }
                }));
            }
        });
    });
})();`;

export const Ja3FingerprintModal: React.FC<Ja3FingerprintModalProps> = ({ onClose, t }) => {
  const [retrievalMode, setRetrievalMode] = useState<'userscript' | 'direct' | 'proxy'>('userscript');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Ja3Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userscriptDetected, setUserscriptDetected] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Setup custom event listeners for Tampermonkey Userscript
  useEffect(() => {
    const handleResponse = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.success) {
        setData(customEvent.detail.data);
        setUserscriptDetected(true);
        setError(null);
        setLoading(false);
      } else if (customEvent.detail && !customEvent.detail.success) {
        setError(customEvent.detail.error || 'Failed to fetch via userscript');
        setLoading(false);
      }
    };

    const handlePong = () => {
      setUserscriptDetected(true);
    };

    window.addEventListener('TLS_FINGERPRINT_RESPONSE', handleResponse);
    window.addEventListener('PONG_TLS_HELPER', handlePong);

    return () => {
      window.removeEventListener('TLS_FINGERPRINT_RESPONSE', handleResponse);
      window.removeEventListener('PONG_TLS_HELPER', handlePong);
    };
  }, []);

  const performFetch = async (mode: 'userscript' | 'direct' | 'proxy') => {
    setLoading(true);
    setError(null);
    setData(null);

    if (mode === 'userscript') {
      // First ping the script to see if it responds
      window.dispatchEvent(new CustomEvent('PING_TLS_HELPER'));
      // Request fingerprint
      window.dispatchEvent(new CustomEvent('GET_TLS_FINGERPRINT'));

      // Set timeout to determine if userscript helper is not installed/active
      setTimeout(() => {
        setLoading((stillLoading) => {
          if (stillLoading) {
            setError(t?.userscript_uninstalled || 'Userscript helper not responding.');
            setUserscriptDetected(false);
            return false;
          }
          return stillLoading;
        });
      }, 1000);
      return;
    }

    if (mode === 'direct') {
      try {
        const res = await fetch('https://tls.browserleaks.com/json');
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(t?.direct_desc || 'Direct fetch blocked by CORS.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'proxy') {
      try {
        const res = await fetch('/api/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://tls.browserleaks.com/json' })
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        if (result.status !== 200) throw new Error();
        const json = JSON.parse(result.data);
        setData(json);
        setError(null);
      } catch (err) {
        setError('Failed to fetch TLS Fingerprint via Backend Proxy.');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  // Trigger initial fetch on mount with the selected mode
  useEffect(() => {
    performFetch(retrievalMode);
  }, [retrievalMode]);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(USERSCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Map incoming browserleaks data safely supporting both original and new formats
  const mapped = data ? {
    ja3_hash: data.ja3_hash || '',
    ja3: data.ja3 || data.ja3_text || '',
    ja3n_hash: data.ja3n_hash || '',
    ja3n: data.ja3n || data.ja3n_text || '',
    ja4: data.ja4 || '',
    ja4_r: data.ja4_r || '',
    ja4_o: data.ja4_o || '',
    ja4_ro: data.ja4_ro || '',
    user_agent: data.user_agent || '',
  } : null;

  return (
    <Modal
      title={t?.title}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-4 p-2 max-h-[80vh] overflow-y-auto">
        {/* Intro Banner */}
        <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/80">
          <Shield className="text-indigo-500 shrink-0 mt-1" size={24} />
          <div className="text-sm space-y-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{t?.desc_title}</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {t?.desc}
            </p>
          </div>
        </div>

        {/* Retrieval Mode Tabs */}
        <div className="bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setRetrievalMode('userscript')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              retrievalMode === 'userscript'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🚀 {t?.mode_userscript || 'Userscript'}
          </button>
          <button
            onClick={() => setRetrievalMode('direct')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              retrievalMode === 'direct'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🌐 {t?.mode_direct || 'Direct'}
          </button>
          <button
            onClick={() => setRetrievalMode('proxy')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              retrievalMode === 'proxy'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🖥️ {t?.mode_proxy || 'Proxy'}
          </button>
        </div>

        {/* Active Mode Descriptions */}
        <div className="text-xs px-1 text-slate-500 dark:text-slate-400">
          {retrievalMode === 'userscript' && (
            <p>{t?.userscript_desc || 'Bypasses CORS using the installed Tampermonkey userscript to perform the handshake directly on your browser.'}</p>
          )}
          {retrievalMode === 'direct' && (
            <p className="text-amber-600 dark:text-amber-400">{t?.direct_desc || 'Requests are made directly from the client. Will fail due to browser CORS policy unless you have disabled CORS manually.'}</p>
          )}
          {retrievalMode === 'proxy' && (
            <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>{t?.proxy_desc || '⚠️ Warning: Under Server Proxy, the TLS handshake is completed by the Node.js backend. The fingerprint below represents the Server\'s runtime environment, not your local browser.'}</p>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Activity className="animate-spin text-indigo-500" size={32} />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t?.fetching}
            </span>
          </div>
        )}

        {/* Error / Instruction Panel */}
        {!loading && error && (
          <div className="space-y-4">
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-sm border border-rose-100 dark:border-rose-900/30 text-center">
              {error}
              <div className="mt-3">
                <Button size="sm" onClick={() => performFetch(retrievalMode)} variant="soft">{t?.retry}</Button>
              </div>
            </div>

            {/* Tampermonkey Installation Guide */}
            {retrievalMode === 'userscript' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Terminal size={18} className="text-indigo-500" />
                  <h5 className="font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t?.mode_userscript || 'Tampermonkey Userscript Guide'}
                  </h5>
                </div>
                
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>安装 <strong>Tampermonkey (篡改猴)</strong> 浏览器扩展。</li>
                  <li>在扩展中点击 <strong>“添加新脚本” (Create a new script)</strong>。</li>
                  <li>复制下方配置与代码，全部替换并保存 (Ctrl+S)。</li>
                  <li>刷新当前页面，即可在无代理、不降低安全策略的前提下直连并捕获真实 TLS 指纹！</li>
                </ol>

                <div className="relative">
                  <pre className="text-[10px] font-mono bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-40 select-all text-slate-600 dark:text-slate-400">
                    {USERSCRIPT_CODE}
                  </pre>
                  <Button
                    size="xs"
                    onClick={handleCopyScript}
                    variant="soft"
                    className="absolute top-2 right-2 shadow"
                    leftIcon={copiedScript ? <Check size={12} /> : <Copy size={12} />}
                  >
                    {copiedScript ? (t?.copied || 'Copied!') : (t?.copy_userscript || 'Copy Code')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && mapped && (
          <div className="grid gap-3">
            {/* Userscript Success Tag */}
            {retrievalMode === 'userscript' && userscriptDetected && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                <Check size={16} className="shrink-0" />
                <span>{t?.userscript_detected || 'Userscript helper active! Successfully bypassed CORS.'}</span>
              </div>
            )}

            {/* JA4 Section */}
            {mapped.ja4 && (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="text-violet-500" size={18} />
                  <h5 className="font-semibold text-slate-800 dark:text-slate-100">{t?.ja4_title || 'JA4 Fingerprint'}</h5>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja4_hash || 'JA4 Hash'}</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1">
                        {mapped.ja4}
                      </div>
                      <button
                        onClick={() => handleCopyText(mapped.ja4, 'ja4')}
                        className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                      >
                        {copiedKey === 'ja4' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  {mapped.ja4_o && (
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja4_o_title || 'JA4_O Fingerprint'}</span>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1">
                          {mapped.ja4_o}
                        </div>
                        <button
                          onClick={() => handleCopyText(mapped.ja4_o, 'ja4_o')}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                        >
                          {copiedKey === 'ja4_o' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* JA3 Section */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-3">
                <Fingerprint className="text-indigo-500" size={18} />
                <h5 className="font-semibold text-slate-800 dark:text-slate-100">{t?.ja3_title}</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja3_hash}</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1">
                      {mapped.ja3_hash}
                    </div>
                    <button
                      onClick={() => handleCopyText(mapped.ja3_hash, 'ja3_hash')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                    >
                      {copiedKey === 'ja3_hash' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja3_string}</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1 h-20 overflow-y-auto">
                      {mapped.ja3}
                    </div>
                    <button
                      onClick={() => handleCopyText(mapped.ja3, 'ja3')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors align-top"
                    >
                      {copiedKey === 'ja3' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* JA3N Section */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="text-emerald-500" size={18} />
                <h5 className="font-semibold text-slate-800 dark:text-slate-100">{t?.ja3n_title}</h5>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja3n_hash}</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1">
                      {mapped.ja3n_hash}
                    </div>
                    <button
                      onClick={() => handleCopyText(mapped.ja3n_hash, 'ja3n_hash')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                    >
                      {copiedKey === 'ja3n_hash' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t?.ja3n_string}</span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1 h-16 overflow-y-auto">
                      {mapped.ja3n}
                    </div>
                    <button
                      onClick={() => handleCopyText(mapped.ja3n, 'ja3n')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-colors align-top"
                    >
                      {copiedKey === 'ja3n' ? <Check className="text-emerald-500" size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Agent context */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
               <Server className="text-slate-400 shrink-0 mt-0.5" size={16} />
               <div className="flex-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">{t?.server_ua}</span>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">
                    {mapped.user_agent}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
